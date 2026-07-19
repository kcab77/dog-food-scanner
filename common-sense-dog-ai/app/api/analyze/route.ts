import { NextRequest, NextResponse } from 'next/server'
import { searchKnowledgeScored } from '@/lib/pinecone'
import { isAllowed } from '@/lib/ratelimit'
import { DISCLAIMER } from '@/lib/disclaimer'

// Website ingredient checker — paste a dog food's ingredient list, get a holistic
// plain-language assessment. Origin-gated to the site (browser), rate-limited.
const ALLOWED_ORIGINS = [
  'https://commonsensedog.com',
  'https://www.commonsensedog.com',
  ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000', 'http://localhost:3001'] : []),
]

const ANALYZE_SYSTEM = `You are the Common Sense Dog ingredient checker — a holistic, nutrition-first guide. A dog owner pastes either a full dog food ingredient list, OR just asks about one or a few specific ingredients (e.g. "is menadione bad?" or "BHA, pea protein"). Give a clear, honest, plain-language assessment a non-expert can act on, adapted to which of those they gave you.

Be 100% holistic: whole foods/natural first. Flag synthetic vitamins (menadione/K3, sodium selenite, copper sulfate, zinc oxide), preservatives (BHA, BHT, ethoxyquin), inflammatory oils, fillers/by-products, generic (unnamed) meats/meals, added sugars, and artificial colors/dyes. Praise whole-food proteins, named meats, whole-food omega-3s, and recognizable real ingredients.

**If it's a full ingredient list (roughly 4+ comma-separated items reading like a product label),** return EXACTLY this markdown structure — concise and skimmable:

## 🐾 Overall: <one short verdict, e.g. "Decent — a couple things to watch" or "Low quality — several red flags">

**🚩 Red flags**
- <ingredient> — <one short reason>
(only list genuinely concerning ones; if there are none, write a single line: "None obvious — nice.")

**✅ Good signs**
- <whole-food / quality positives>
(omit this whole section if there are none)

**💡 What I'd do**
- <1–2 concrete, holistic next steps>

**If it's just one or a few specific ingredients being asked about (not a full label),** skip that structure — instead give a short, direct answer per ingredient: what it is, whether it's a concern (and why, with severity — mild/moderate/severe) or a genuine positive, and one practical takeaway. No need to force the Overall/Red flags/Good signs headers for a single-ingredient question.

Keep it tight and friendly. Do NOT invent ingredients that aren't mentioned. Never recommend synthetic/harmful additives.`

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  if (!ALLOWED_ORIGINS.includes(origin)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!(await isAllowed(req))) return NextResponse.json({ error: 'Too many requests — give it a sec and try again.' }, { status: 429 })

  try {
    const { ingredients } = await req.json()
    const text = (ingredients ?? '').toString().trim()
    if (text.length < 3) return NextResponse.json({ error: 'Please paste an ingredient list.' }, { status: 400 })

    // Pull curated knowledge relevant to these ingredients (holistic, Pinecone-first).
    const scored = await searchKnowledgeScored(text.slice(0, 600), 6)
    const chunks = scored.filter((c) => c.score >= 0.5).map((c) => c.text)
    let system = ANALYZE_SYSTEM
    if (chunks.length > 0) {
      system += `\n\n---\nCURATED COMMON SENSE DOG KNOWLEDGE (use where relevant, stay holistic):\n\n${chunks.join('\n\n---\n\n')}`
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
        max_tokens: 700,
        system,
        messages: [{ role: 'user', content: `Analyze this dog food ingredient list:\n\n${text}` }],
      }),
    })

    const data = await response.json()
    const out = data?.content?.[0]?.text?.trim() || ''
    const message = out ? out + DISCLAIMER : "Sorry, I couldn't analyze that right now — please try again."
    return NextResponse.json({ message })
  } catch (e) {
    return NextResponse.json({ error: "Sorry, I couldn't analyze that right now — please try again." }, { status: 500 })
  }
}
