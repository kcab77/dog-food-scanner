import { NextRequest, NextResponse } from 'next/server'
import { isValidAppRequest } from '@/lib/auth'
import { isAllowed } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  if (!isValidAppRequest(req)) return NextResponse.json(null, { status: 403 })
  if (!(await isAllowed(req))) return NextResponse.json(null, { status: 429 })
  try {
    const { ingredient } = await req.json()
    if (!ingredient) return NextResponse.json(null, { status: 400 })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: `Explain this pet food ingredient for a dog owner: "${ingredient}"

Return ONLY a JSON object, no markdown backticks:
{
  "what_it_is": "1 sentence: what this ingredient actually is",
  "role_in_food": "why manufacturers include it in pet food",
  "health_impact": "beneficial or neutral or concerning or harmful",
  "details": "2-3 sentences on health effects specifically for dogs",
  "disease_links": "any specific health conditions linked to this in dogs, or null if none known"
}`
        }],
      }),
    })

    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim() || ''
    if (!text) return NextResponse.json(null)

    let cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const jsonMatch = cleaned.match(/(\{[\s\S]*\})/)
    if (jsonMatch) cleaned = jsonMatch[1]

    return NextResponse.json(JSON.parse(cleaned))
  } catch (e) {
    return NextResponse.json(null, { status: 500 })
  }
}
