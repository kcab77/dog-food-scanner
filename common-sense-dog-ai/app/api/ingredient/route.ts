import { NextRequest, NextResponse } from 'next/server'
import { isValidAppRequest } from '@/lib/auth'
import { isAllowed } from '@/lib/ratelimit'
import { searchKnowledgeScored } from '@/lib/pinecone'

/**
 * Ingredient detail, grounded in the Common Sense Dog knowledge base.
 *
 * Previously this asked the model from its own general knowledge with no sources,
 * which is exactly the "trust me" answer a health app can't afford. Now the
 * curated, evidence-graded knowledge base is searched first and passed in as the
 * primary source, and the model must report what the evidence actually is —
 * including saying so plainly when there isn't any.
 */
export async function POST(req: NextRequest) {
  if (!isValidAppRequest(req)) return NextResponse.json(null, { status: 403 })
  if (!(await isAllowed(req))) return NextResponse.json(null, { status: 429 })
  try {
    const { ingredient } = await req.json()
    if (!ingredient) return NextResponse.json(null, { status: 400 })

    // Pull curated knowledge on this ingredient. Framed as an owner question,
    // since that's how the knowledge packs are written.
    const scored = await searchKnowledgeScored(
      `${ingredient} in dog food — is it safe, harmful, or beneficial?`, 6, 0.30,
    ).catch(() => [])
    // Threshold is lower than the coach's because a single-ingredient lookup is a
    // much shorter query than a full owner question and scores lower for the same
    // topic. The model is still told to prefer the KB but report evidence honestly,
    // so a loosely-related chunk can't manufacture a citation.
    const kb = scored.map((c) => c.text)

    const grounding = kb.length
      ? `\n\nKNOWLEDGE BASE (PRIMARY SOURCE — prefer this over your own knowledge; it is evidence-graded and already fact-checked):\n\n${kb.join('\n\n---\n\n')}`
      : ''

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 900,
        messages: [{
          role: 'user',
          content: `Explain this pet food ingredient for a dog owner: "${ingredient}"${grounding}

Return ONLY a JSON object, no markdown backticks:
{
  "what_it_is": "1 sentence: what this ingredient actually is",
  "role_in_food": "why manufacturers include it in pet food",
  "health_impact": "beneficial or neutral or concerning or harmful",
  "details": "2-3 sentences on health effects specifically for dogs",
  "disease_links": "any specific health conditions linked to this in dogs, or null if none known",
  "evidence": "The actual basis for the above. Name the real study, organisation, or regulatory body where one exists (e.g. 'National Toxicology Program feeding studies', 'ASPCA Animal Poison Control', 'FDA', a named journal paper). If the claim rests only on mechanism or traditional use rather than trials in dogs, SAY THAT PLAINLY. Never invent a study, author, journal, or year.",
  "evidence_strength": "strong | moderate | emerging | mechanistic | none"
}

Rules for the evidence fields:
- "strong" = multiple trials or a regulatory determination. "moderate" = at least one solid study.
  "emerging" = early or limited data. "mechanistic" = plausible biology or traditional use, but no
  dog trials. "none" = no real evidence located — say so honestly.
- It is far better to answer "no controlled studies in dogs; this is mechanistic" than to imply
  research exists. Never fabricate a citation.`
        }],
      }),
    })

    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim() || ''
    if (!text) return NextResponse.json(null)

    let cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const jsonMatch = cleaned.match(/(\{[\s\S]*\})/)
    if (jsonMatch) cleaned = jsonMatch[1]

    const parsed = JSON.parse(cleaned)
    // Tell the app whether this came from the curated KB, so it can show the user
    // where the answer actually originated.
    parsed.from_knowledge_base = kb.length > 0
    return NextResponse.json(parsed)
  } catch (e) {
    return NextResponse.json(null, { status: 500 })
  }
}
