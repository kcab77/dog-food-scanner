import { NextRequest, NextResponse } from 'next/server'
import { isValidAppRequest } from '@/lib/auth'
import { isAllowed } from '@/lib/ratelimit'

const SCAN_PROMPT = `You are analyzing a photo of a dog food product. The photo may show the front of the bag, the ingredient list panel, the Guaranteed Analysis panel, or a combination.

First classify what is visible:
- "front_of_bag" — brand/product name visible but NO ingredient list text
- "ingredient_list" — ingredient list visible (comma-separated ingredients starting with the primary protein)
- "guaranteed_analysis" — Guaranteed Analysis table visible with percentages
- "ingredient_and_ga" — both ingredient list AND Guaranteed Analysis panel visible
- "full_label" — front of bag AND ingredient list and/or GA visible

For processing_method, look for these clues:
- "raw", "raw frozen", "raw food" → "raw"
- "gently cooked", "lightly cooked", "slow cooked", "human-grade", "fresh cooked", "minimally processed" → "gently cooked"
- "freeze-dried", "freeze dried", "air dried", "air-dried", "dehydrated" → "freeze-dried"
- "baked", "oven baked", "oven-baked" → "baked"
- "kibble", "dry food", "extruded", or standard dry dog food bag → "kibble"
- Otherwise → "unknown"

Also look for an AAFCO nutritional adequacy statement:
- "formulated to meet the nutritional levels established by the AAFCO Dog Food Nutrient Profiles" → aafco_status: "nutrient_profile"
- "Animal feeding tests using AAFCO procedures" → aafco_status: "feeding_trials"
- If no AAFCO statement visible → aafco_status: null

Return ONLY a valid JSON object, no markdown backticks:
{
  "scan_type": "front_of_bag|ingredient_list|guaranteed_analysis|ingredient_and_ga|full_label",
  "product_name": "exact product name as printed on the bag, or empty string if not visible",
  "brand": "brand name as printed, or empty string if not visible",
  "ingredients": "comma separated ingredient list exactly as shown, or empty string if not visible",
  "processing_method": "kibble or raw or gently cooked or freeze-dried or baked or unknown",
  "aafco_status": "feeding_trials or nutrient_profile or null",
  "guaranteed_analysis": {
    "protein_pct": number or null,
    "fat_pct": number or null,
    "fiber_pct": number or null,
    "moisture_pct": number or null,
    "omega3_pct": number or null,
    "omega6_pct": number or null
  },
  "found": true
}

If you cannot extract any useful information from the image, return only:
{"found": false}`

export async function POST(req: NextRequest) {
  if (!isValidAppRequest(req)) return NextResponse.json({ found: false }, { status: 403 })
  if (!(await isAllowed(req))) return NextResponse.json({ found: false, error: 'Too many requests' }, { status: 429 })
  try {
    const { image } = await req.json()
    if (!image) {
      return NextResponse.json({ found: false, error: 'No image provided' }, { status: 400 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
            { type: 'text', text: SCAN_PROMPT }
          ]
        }],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ found: false, error: 'Vision API error' }, { status: 500 })
    }

    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim() || ''
    if (!text) return NextResponse.json({ found: false })

    let cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
    if (jsonMatch) cleaned = jsonMatch[1]

    return NextResponse.json(JSON.parse(cleaned))
  } catch (e) {
    return NextResponse.json({ found: false, error: 'Server error' }, { status: 500 })
  }
}
