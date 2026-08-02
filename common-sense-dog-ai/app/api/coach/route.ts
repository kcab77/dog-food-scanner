import { NextRequest, NextResponse } from 'next/server'
import { isValidAppRequest } from '@/lib/auth'
import { getDogProfileFromRequest, profilePromptBlock } from '@/lib/dogProfile'
import { searchKnowledgeScored } from '@/lib/pinecone'
import { isAllowed } from '@/lib/ratelimit'
import { DISCLAIMER } from '@/lib/disclaimer'

const COACH_PHILOSOPHY = `You are the PawGrade nutrition coach — a holistic, nutrition-first dog health guide. You help dog owners understand what's in their pet's food and what to do about it. Explain simply and conversationally. Keep responses to 2-4 sentences unless the user asks for more detail.

ANSWER 100% HOLISTICALLY — every time:
- ALWAYS lead with whole foods or natural medicine FIRST: real food, herbs, functional mushrooms (reishi, turkey tail, cordyceps, lion's mane), bone broth, organ meats, whole-food omega-3, food-based probiotics.
- NEVER recommend synthetic, isolated, or chemical ingredients: no synthetic vitamins/minerals (menadione/K3, sodium selenite, copper sulfate, zinc oxide), no artificial preservatives (BHA, BHT, ethoxyquin), no synthetic supplements when a whole-food source exists.
- NEVER recommend harmful ingredients, even if asked. If a user mentions one, explain why it's harmful and give the natural alternative instead.
- NEVER default to kibble, and NEVER push synthetic chemical flea/tick or pharmaceuticals as a first option — natural and dietary approaches come first; pharma only as a genuine last resort.
- Give real, specific holistic guidance first — don't hide behind a generic "ask your vet." BUT for genuine health concerns, symptoms of illness, medication interactions, or before making major diet changes, recommend the owner consult a HOLISTIC or integrative veterinarian (not a conventional kibble-and-pharma vet).
- This is educational information to help owners make informed choices — it is not a diagnosis or a substitute for professional veterinary care. Keep that framing; never claim to treat, cure, or diagnose a medical condition.`

export async function POST(req: NextRequest) {
  if (!isValidAppRequest(req)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  if (!(await isAllowed(req))) return NextResponse.json({ message: "You're sending messages too fast — give it a sec and try again." }, { status: 429 })
  try {
    const { productName, ingredientList, score, flaggedNames, messages } = await req.json()

    // Pinecone-FIRST: pull curated knowledge for the user's latest question, fall
    // back to the holistic AI only when the knowledge base doesn't cover it.
    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    const query = lastUserMessage?.content || ''
    const STRONG_THRESHOLD = 0.65
    const scored = query ? await searchKnowledgeScored(query, 8) : []
    const strongChunks = scored.filter(c => c.score >= STRONG_THRESHOLD).map(c => c.text)
    const weakChunks = scored.filter(c => c.score < STRONG_THRESHOLD).map(c => c.text)

    // The owner's saved dog profile, resolved from their auth token and read from
    // the database (never trusted from the request body). Null for anonymous
    // callers and for app versions already shipped that send no token — those
    // must keep working exactly as before.
    const dogProfile = await getDogProfileFromRequest(req)

    let systemText = `${COACH_PHILOSOPHY}

Product being reviewed: ${productName}
Score: ${score}/100
Concerning ingredients: ${flaggedNames?.length > 0 ? flaggedNames.join(', ') : 'None detected'}
Full ingredient list: ${ingredientList}`

    if (dogProfile) systemText += profilePromptBlock(dogProfile)

    if (strongChunks.length > 0) {
      systemText += `\n\n---\nKNOWLEDGE BASE (PRIMARY SOURCE — USE THIS FIRST):\nThis curated Common Sense Dog knowledge directly addresses the question. Build your answer on it first; do not contradict it. Only add general knowledge to fill small gaps, and keep it within the holistic philosophy above.\n\n${strongChunks.join('\n\n---\n\n')}`
    } else if (weakChunks.length > 0) {
      systemText += `\n\n---\nKNOWLEDGE BASE (PARTIAL MATCH):\nThe following is partially relevant. Prefer it where it applies, then supplement with your general holistic knowledge.\n\n${weakChunks.join('\n\n---\n\n')}`
    }

    const claudeMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }))

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        system: systemText,
        messages: claudeMessages,
      }),
    })

    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim() || ''
    const message = text ? text + DISCLAIMER : "Sorry, I couldn't connect right now."
    return NextResponse.json({ message })
  } catch (e) {
    return NextResponse.json({ message: "Sorry, I couldn't connect right now." }, { status: 500 })
  }
}
