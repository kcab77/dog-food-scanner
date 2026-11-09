import { NextRequest, NextResponse } from 'next/server'
import { isValidAppRequest } from '@/lib/auth'
import { getDogProfileFromRequest, profilePromptBlock } from '@/lib/dogProfile'
import { searchKnowledgeScored } from '@/lib/pinecone'
import { loadHistory, saveExchange, isNewConversation } from '@/lib/chatMemory'
import { getNotebook, routeToNotebook } from '@/lib/notebooks'
import { isAllowed } from '@/lib/ratelimit'
import { DISCLAIMER } from '@/lib/disclaimer'

const COACH_PHILOSOPHY = `You are the PawGrade nutrition coach — a holistic, nutrition-first dog health guide. You help dog owners understand what's in their pet's food and what to do about it. Explain simply and conversationally.

LENGTH — let the evidence decide, not a word count:
- When the knowledge base below covers the question well, ANSWER IN FULL. Give the
  dose, the form, the timing, the mechanism, and when not to use it. A detailed,
  specific answer is the entire point — do not pad, but do not withhold either.
- When it does not cover the question, be brief and say so (see honesty rule).
- A quick follow-up about a food that was just scanned stays short, 2-4 sentences.

ANSWER 100% HOLISTICALLY — every time:
- ALWAYS lead with whole foods or natural medicine FIRST: real food, herbs, functional mushrooms (reishi, turkey tail, cordyceps, lion's mane), bone broth, organ meats, whole-food omega-3, food-based probiotics.
- NEVER recommend synthetic, isolated, or chemical ingredients: no synthetic vitamins/minerals (menadione/K3, sodium selenite, copper sulfate, zinc oxide), no artificial preservatives (BHA, BHT, ethoxyquin), no synthetic supplements when a whole-food source exists.
- NEVER recommend harmful ingredients, even if asked. If a user mentions one, explain why it's harmful and give the natural alternative instead.
- NEVER default to kibble, and NEVER push synthetic chemical flea/tick or pharmaceuticals as a first option — natural and dietary approaches come first; pharma only as a genuine last resort.
- Give real, specific holistic guidance first — don't hide behind a generic "ask your vet." BUT for genuine health concerns, symptoms of illness, medication interactions, or before making major diet changes, recommend the owner consult a HOLISTIC or integrative veterinarian (not a conventional kibble-and-pharma vet).
- This is educational information to help owners make informed choices — it is not a diagnosis or a substitute for professional veterinary care. Keep that framing; never claim to treat, cure, or diagnose a medical condition.

HONESTY ABOUT WHAT YOU ACTUALLY KNOW — this matters more than sounding helpful:
- The curated knowledge below is the trustworthy part. It is deep on some topics and
  thin on others, and you will not always be told which.
- When a KNOWLEDGE BASE block is present, build the answer on it and be specific.
- When NO knowledge base block appears, or it is only a PARTIAL MATCH, say plainly
  that you do not have specific curated research on this one, give only general
  holistic guidance, and keep it short. Never dress up a general answer to sound as
  authoritative as a sourced one.
- Carry the confidence language through from the source when it is there — "no canine
  trials", "mechanism only", "owner reports, weak study design". Saying the evidence
  is thin is not a weakness; it is the reason to trust the rest.
- Never invent a dose, a study, a trial result, or a number. If you do not have the
  dose, say you do not have it.`

export async function POST(req: NextRequest) {
  if (!isValidAppRequest(req)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  if (!(await isAllowed(req))) return NextResponse.json({ message: "You're sending messages too fast — give it a sec and try again." }, { status: 429 })
  try {
    const { productName, ingredientList, score, flaggedNames, messages, notebook } = await req.json()

    /**
     * The scan context is now OPTIONAL.
     *
     * This route used to require productName / ingredientList / score, which
     * meant the coach could only ever be reached *after* scanning a bag. An
     * owner could not open the app and ask "my dog is itchy, could it be
     * food?" — the one question the knowledge base is best at answering.
     *
     * Both shapes are supported on purpose: app versions already in the wild
     * keep sending the scan fields and must behave exactly as before.
     */
    const hasScanContext = Boolean(productName || ingredientList || typeof score === 'number')

    // Pinecone-FIRST: pull curated knowledge for the user's latest question, fall
    // back to the holistic AI only when the knowledge base doesn't cover it.
    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    const query = lastUserMessage?.content || ''
    /**
     * Scope the search to a notebook when we have one — chosen by the user, or
     * inferred from the question when they just started typing. Conservative on
     * purpose: an ambiguous question routes nowhere and searches everything,
     * because a wrong notebook hides the right answer rather than merely
     * failing to narrow.
     */
    const chosen = getNotebook(notebook) ?? routeToNotebook(query)

    const STRONG_THRESHOLD = 0.65
    let scored = query ? await searchKnowledgeScored(query, 8, 0.5, chosen?.topics) : []
    // A notebook that turns up nothing is a worse answer than no notebook.
    if (chosen && scored.length === 0 && query) {
      scored = await searchKnowledgeScored(query, 8)
    }
    const strongChunks = scored.filter(c => c.score >= STRONG_THRESHOLD).map(c => c.text)
    const weakChunks = scored.filter(c => c.score < STRONG_THRESHOLD).map(c => c.text)

    // The owner's saved dog profile, resolved from their auth token and read from
    // the database (never trusted from the request body). Null for anonymous
    // callers and for app versions already shipped that send no token — those
    // must keep working exactly as before.
    const dogProfile = await getDogProfileFromRequest(req)

    let systemText = COACH_PHILOSOPHY

    if (hasScanContext) {
      systemText += `

Product being reviewed: ${productName}
Score: ${score}/100
Concerning ingredients: ${flaggedNames?.length > 0 ? flaggedNames.join(', ') : 'None detected'}
Full ingredient list: ${ingredientList}`
    } else {
      systemText += `

The owner has NOT scanned a food — this is a general question about their dog.
Do not refer to "this food", "the scan" or "the ingredient list"; there isn't one.
Answer the question they actually asked. If knowing what they currently feed would
change your answer, ask for it in one short sentence rather than guessing, and
mention they can scan the bag in the app to get it analysed properly.`
    }

    if (dogProfile) systemText += profilePromptBlock(dogProfile)

    if (strongChunks.length > 0) {
      systemText += `\n\n---\nKNOWLEDGE BASE (PRIMARY SOURCE — USE THIS FIRST):\nThis curated Common Sense Dog knowledge directly addresses the question. Build your answer on it first; do not contradict it. Only add general knowledge to fill small gaps, and keep it within the holistic philosophy above.\n\n${strongChunks.join('\n\n---\n\n')}`
    } else if (weakChunks.length === 0) {
      systemText += `\n\n---\nKNOWLEDGE BASE: no curated entry matched this question. Say so plainly, answer briefly from general holistic principles, and do not state specific doses or study results you cannot source.`
    }
    if (weakChunks.length > 0 && strongChunks.length === 0) {
      systemText += `\n\n---\nKNOWLEDGE BASE (PARTIAL MATCH):\nThe following is partially relevant. Prefer it where it applies, then supplement with your general holistic knowledge.\n\n${weakChunks.join('\n\n---\n\n')}`
    }

    /**
     * Prepend remembered turns only when the client is starting fresh. If it is
     * already holding the thread, the same exchanges would arrive twice — once
     * from the client, once from the table — and the model would see itself
     * repeat.
     */
    const remembered = isNewConversation(messages) ? await loadHistory(req) : []

    const claudeMessages = [...remembered, ...messages].map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }))

    if (chosen) {
      systemText += `\n\n---\nNOTEBOOK: this question is being answered from the "${chosen.title}" notebook — ${chosen.blurb} If the question has clearly moved to a different subject, say so and answer it anyway; never refuse because of the notebook.`
    }

    if (remembered.length > 0) {
      systemText += `\n\n---\nEARLIER CONVERSATIONS WITH THIS OWNER: the messages above this turn are from previous sessions, not today. Use them to remember their dog and what you have already advised — do not re-ask what they have told you, and do not greet them as a stranger. Do not claim to remember anything that is not actually in them.`
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: hasScanContext ? 700 : 2048,
        system: systemText,
        messages: claudeMessages,
      }),
    })

    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim() || ''
    const message = text ? text + DISCLAIMER : "Sorry, I couldn't connect right now."

    // Remember this exchange. Deliberately not awaited for correctness of the
    // response — a failed write must not cost the user the reply they waited for.
    if (text && query) {
      saveExchange(req, query, text, hasScanContext ? 'app' : 'app').catch(() => {})
    }
    return NextResponse.json({ message })
  } catch (e) {
    return NextResponse.json({ message: "Sorry, I couldn't connect right now." }, { status: 500 })
  }
}
