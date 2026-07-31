import Anthropic from '@anthropic-ai/sdk'
import { getExpertBySlug, serviceClient } from '@/lib/supabase'
import { embedQuery } from '@/lib/embed'
import { retrieve, looksLikeEmergency, RELEVANCE_FLOOR } from '@/lib/retrieval'

export const runtime = 'nodejs'
export const maxDuration = 60 // headroom for Voyage 429 backoff (up to ~24s) + generation

const MODEL = 'claude-sonnet-5'
const REWRITE_MODEL = 'claude-haiku-4-5-20251001' // cheap/fast query understanding

// Turn a possibly-messy user message (typos, slang, a bare follow-up like
// "what do you recommend?") into a clean, standalone search query, using recent
// context. Improves retrieval robustness without touching the strict
// answer-only-from-context + refusal behavior. Falls back to the raw message on
// any error, so a hiccup here can never break a request.
async function rewriteQuery(
  anthropic: Anthropic,
  history: { role: 'user' | 'assistant'; content: string }[],
  message: string,
): Promise<string> {
  try {
    const convo = history
      .slice(-4)
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n')
    const res = await anthropic.messages.create({
      model: REWRITE_MODEL,
      max_tokens: 60,
      system:
        'You rewrite a pet owner\'s latest message into a concise standalone search query for a veterinary knowledge base. Fix spelling and typos (e.g. brand/drug/ingredient names), expand what they clearly mean, and resolve references ("it", "that", "which one") using the conversation. Output ONLY the rewritten query text — no quotes, no preamble. Keep it short. Do NOT invent a topic that is not implied by the message.',
      messages: [
        {
          role: 'user',
          content: `${convo ? `Conversation so far:\n${convo}\n\n` : ''}Latest message: ${message}\n\nRewritten search query:`,
        },
      ],
    })
    const out = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()
    return out || message
  } catch {
    return message
  }
}
const DISCLAIMER =
  'This is educational information drawn from published content, not veterinary advice. For anything specific to your pet, please consult your veterinarian.'
const EMERGENCY_REPLY =
  "This sounds like it could be an emergency. Please contact your veterinarian or the nearest emergency animal hospital right now — or call the ASPCA Animal Poison Control Center at (888) 426-4435 if a toxin may be involved. Don't wait for an online answer."

type Citation = { source_id: string; title: string; url: string | null; type: string; image: string | null }

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

    // 2) Understand the question, THEN retrieve. A cheap model pass fixes typos
    // ("simperica" -> "Simparica"), expands intent, and resolves bare follow-ups
    // ("what do you recommend?") into a standalone query using context — so
    // retrieval is robust to messy input. This only shapes the SEARCH; the
    // answer is still generated strictly from what's retrieved, and still refuses
    // when nothing relevant is found.
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_KEY })
    const retrievalText = await rewriteQuery(anthropic, history, message)
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
- Never use outside knowledge. Do not improvise or fill gaps.
- If the CONTEXT does not genuinely address the question, begin your reply with the exact token [[NOCTX]] on its own, then a brief, warm one-sentence redirect to ${expert.name}. Do this whenever the passages are off-topic or only tangentially related — do not stretch unrelated content to force an answer.
- Otherwise, write in ${expert.name}'s voice: warm, practical, holistic. Keep it concise and directly useful. Do not fabricate studies, doses, or product names.
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

    const completion = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system,
      messages: [...priorTurns, { role: 'user', content: message }],
    })

    const raw =
      completion.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('')
        .trim() || `[[NOCTX]] ${refusalText(expert.name)}`

    // Deterministic refusal signal: with a lower retrieval floor we sometimes
    // pull a weakly-related chunk. Rather than guess from wording, the model
    // emits [[NOCTX]] when the context doesn't genuinely answer. On refusal we
    // strip the token, drop citations/products (no misleading source), and log
    // the gap.
    const softRefusal = raw.includes('[[NOCTX]]')
    const answer = raw.replace('[[NOCTX]]', '').trim() || refusalText(expert.name)

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
