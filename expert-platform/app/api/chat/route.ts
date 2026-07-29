import Anthropic from '@anthropic-ai/sdk'
import { getExpertBySlug, serviceClient } from '@/lib/supabase'
import { embedQuery } from '@/lib/embed'
import { retrieve, looksLikeEmergency, RELEVANCE_FLOOR } from '@/lib/retrieval'

export const runtime = 'nodejs'
export const maxDuration = 60 // headroom for Voyage 429 backoff (up to ~24s) + generation

const MODEL = 'claude-sonnet-5'
const DISCLAIMER =
  'This is educational information drawn from published content, not veterinary advice. For anything specific to your pet, please consult your veterinarian.'
const EMERGENCY_REPLY =
  "This sounds like it could be an emergency. Please contact your veterinarian or the nearest emergency animal hospital right now — or call the ASPCA Animal Poison Control Center at (888) 426-4435 if a toxin may be involved. Don't wait for an online answer."

type Citation = { source_id: string; title: string; url: string | null; type: string }

function refusalText(expertName: string): string {
  return `I can only answer from ${expertName}'s published material, and I couldn't find anything in it that covers this. Rather than guess, I'd point you to ${expertName} directly for this one.`
}

export async function POST(req: Request) {
  let expertSlug = ''
  try {
    const body = await req.json()
    const message: string = (body.message ?? '').toString().trim()
    expertSlug = (body.expert ?? '').toString().trim()
    const conversationId: string | null = body.conversationId ?? null

    if (!message) return Response.json({ error: 'Empty message.' }, { status: 400 })
    if (!expertSlug) return Response.json({ error: 'Missing expert.' }, { status: 400 })

    const expert = await getExpertBySlug(expertSlug)
    if (!expert) return Response.json({ error: 'Unknown expert.' }, { status: 404 })

    const sb = serviceClient()

    // Ensure a conversation to attach messages to (public visitor, no auth).
    let convoId = conversationId
    if (!convoId) {
      const { data } = await sb
        .from('conversations')
        .insert({ expert_id: expert.id, visitor_id: body.visitorId ?? null })
        .select('id')
        .single()
      convoId = data?.id ?? null
    }

    const logMessage = async (
      role: 'user' | 'assistant',
      content: string,
      citations: Citation[] = [],
      refused = false,
    ) => {
      if (!convoId) return
      await sb.from('messages').insert({
        conversation_id: convoId,
        expert_id: expert.id,
        role,
        content,
        citations,
        refused,
      })
    }

    // Conversation memory: pull the recent turns (BEFORE logging the new one)
    // so follow-ups like "what do you recommend for that?" keep their context.
    let history: { role: 'user' | 'assistant'; content: string }[] = []
    if (convoId) {
      const { data: past } = await sb
        .from('messages')
        .select('role, content')
        .eq('conversation_id', convoId)
        .order('created_at', { ascending: false })
        .limit(6)
      history = ((past ?? []) as { role: 'user' | 'assistant'; content: string }[]).reverse()
    }

    await logMessage('user', message)

    // 1) Emergency short-circuit — BEFORE any retrieval or model call.
    if (looksLikeEmergency(message)) {
      await logMessage('assistant', EMERGENCY_REPLY, [], false)
      return Response.json({
        conversationId: convoId,
        answer: EMERGENCY_REPLY,
        citations: [],
        emergency: true,
        refused: false,
        disclaimer: DISCLAIMER,
      })
    }

    // 2) Retrieve with the relevance floor. Only for a genuinely REFERENTIAL
    // follow-up ("what do you recommend?", "which one?", "how much of it?") do
    // we borrow the previous user turn for context — because those have no
    // standalone meaning. A short question that names a NEW subject
    // ("what do you think of Simparica?") must retrieve on its own, or prior
    // context bleeds in and produces a mismatched citation. Detect referential
    // intent explicitly rather than by length.
    // Strip conversational/opinion framing that dilutes the topical signal.
    // "do you think a raw diet is good?" -> "a raw diet is good" retrieves far
    // better, because the embedding isn't dominated by "do you think ... is good".
    const stripped =
      message
        .replace(/^\s*(so|and|but|well|ok|okay|hey|hi)[,\s]+/i, '')
        .replace(
          /^(do you (really )?think( that)?|what do you (really )?think( about| of)?|what('?s| is) your (take|opinion|view|thoughts?)( on| about)?|do you recommend|would you recommend|how do you feel about|(any )?thoughts on|is it true that|can you tell me about|tell me about|i('?m| am) wondering( about| if)?|i want to know( about)?|i'?d like to know( about)?)\s+/i,
          '',
        )
        .trim() || message

    const prevUser = [...history].reverse().find((m) => m.role === 'user')?.content
    const referential =
      /\b(it|that|those|these|this|them|one|ones|him|her)\b/i.test(message) ||
      /\b(recommend|which|how (much|many|often|do i)|what should i|any (of )?(others?|else))\b/i.test(message)
    const retrievalText = prevUser && referential ? `${prevUser}\n${stripped}` : stripped
    const queryEmbedding = await embedQuery(retrievalText)
    const { matches, sources, topSimilarity } = await retrieve(expert.id, queryEmbedding)

    // 3) Refusal path: nothing cleared the floor -> do NOT call the model.
    if (matches.length === 0) {
      const text = refusalText(expert.name)
      await logMessage('assistant', text, [], true)
      // Log the gap for the monthly digest.
      await sb.from('unanswered').insert({
        expert_id: expert.id,
        question: message,
        embedding: queryEmbedding,
      })
      return Response.json({
        conversationId: convoId,
        answer: text,
        citations: [],
        refused: true,
        disclaimer: DISCLAIMER,
      })
    }

    // 4) Generate strictly from retrieved context, in the expert's voice.
    const context = matches
      .map((m, i) => `[Source ${i + 1}] (similarity ${m.similarity.toFixed(2)})\n${m.content}`)
      .join('\n\n---\n\n')

    // Products matched by REAL semantic similarity (reuses the same question
    // embedding already computed above — no extra embedding cost), against
    // each expert's actual catalog. This is deliberately precise: it returns
    // the single best-fit item(s) above a relevance floor, not every product
    // that happens to share a keyword. If nothing is specifically relevant,
    // it returns nothing rather than shotgunning the whole catalog.
    const { data: productMatches } = await sb.rpc('match_products', {
      p_expert: expert.id,
      query_embedding: queryEmbedding,
      match_count: 2,
      similarity_threshold: Number(process.env.PRODUCT_RELEVANCE_FLOOR ?? '0.42'),
    })
    const relevantProducts = (productMatches ?? []) as { name: string; url: string | null; similarity: number }[]

    const system = `${expert.persona_prompt}

You are an assistant that answers ONLY using the CONTEXT passages below, which are drawn from ${expert.name}'s own published work. Absolute rules:
- Never use outside knowledge. If the CONTEXT doesn't clearly answer the question, say you don't have that in the material and suggest asking ${expert.name} directly. Do not improvise or fill gaps.
- Write in ${expert.name}'s voice: warm, practical, holistic.
- Keep it concise and directly useful. Do not fabricate studies, doses, or product names.
- End with the exact disclaimer provided by the app (do not restate it yourself).

CONTEXT:
${context}${
      relevantProducts.length
        ? `\n\nThe expert offers these related products you MAY mention if genuinely relevant (never push): ${relevantProducts
            .map((p) => p.name)
            .join(', ')}.`
        : ''
    }`

    // Give the model the recent conversation so follow-ups keep their thread,
    // then the current question last. History is still answered ONLY from the
    // freshly-retrieved CONTEXT above — memory adds continuity, not new facts.
    const priorTurns = history.map((m) => ({ role: m.role, content: m.content }))

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_KEY })
    const completion = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system,
      messages: [...priorTurns, { role: 'user', content: message }],
    })

    const answer =
      completion.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('')
        .trim() || refusalText(expert.name)

    // Safety net: with a lower retrieval floor we sometimes pull a weakly-related
    // chunk, and the model honestly answers "I don't have that in the material."
    // In that case DON'T attach a citation (it would be misleading) — treat it as
    // a refusal, and log the gap. This lets us keep recall high without ever
    // stapling a wrong source onto a non-answer.
    const softRefusal =
      /couldn'?t find|don'?t have (anything|that)|isn'?t (in|part of)|not (in|part of) (the|what)|only answer from|point you to/i.test(
        answer,
      )

    const citations: Citation[] = softRefusal ? [] : sources
    if (softRefusal) {
      await sb.from('unanswered').insert({ expert_id: expert.id, question: message, embedding: queryEmbedding })
    }
    await logMessage('assistant', answer, citations, softRefusal)

    // 5) Usage metering.
    await sb.from('usage_events').insert({
      expert_id: expert.id,
      kind: 'chat',
      input_tokens: completion.usage?.input_tokens ?? 0,
      output_tokens: completion.usage?.output_tokens ?? 0,
    })

    return Response.json({
      conversationId: convoId,
      answer,
      citations,
      products: softRefusal ? [] : relevantProducts.map((p) => ({ name: p.name, url: p.url })),
      refused: softRefusal,
      topSimilarity,
      floor: RELEVANCE_FLOOR,
      disclaimer: DISCLAIMER,
    })
  } catch (err) {
    console.error('chat route error:', err)
    // Fail closed — never leak a half-answer. A visible, honest error.
    return Response.json(
      { error: 'Something went wrong answering that. Please try again in a moment.' },
      { status: 500 },
    )
  }
}
