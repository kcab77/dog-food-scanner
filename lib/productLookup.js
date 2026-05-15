import { supabase } from './supabase'

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY
const ANTHROPIC_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY
const SHEET_SCRIPT_URL = process.env.EXPO_PUBLIC_SHEET_SCRIPT_URL

async function claudeFetch(prompt) {
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
}

// Gemini API helper — text only
async function geminiFetch(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      })
    }
  )
  return response
}

// Gemini API helper — vision (image + text)
async function geminiVisionFetch(base64Image, prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
            { text: prompt }
          ]
        }],
        generationConfig: { temperature: 0.1 }
      })
    }
  )
  return response
}

// Gemini API helper — text with Google Search grounding
async function geminiGroundedFetch(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.1 }
      })
    }
  )
  return response
}

function extractGeminiText(data) {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
}

function parseGeminiJSON(text) {
  let cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  // Find JSON object or array in the text
  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) cleaned = jsonMatch[1];
  return JSON.parse(cleaned)
}

// Look up product by barcode in Supabase first
export async function lookupProduct(barcode) {
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .maybeSingle()

    if (data) {
      console.log('Found in Supabase products:', data.product_name)
      return data
    }
  } catch (e) {
    console.log('Supabase product lookup failed:', e)
  }
  return null
}

// Save a product to Supabase so next lookup is instant
// Returns true on success, error message string on failure
export async function saveProduct(barcode, productName, brand, ingredients, processingMethod) {
  try {
    const row = {
      product_name: productName,
      brand: brand || '',
      ingredients: ingredients || '',
      processing_method: processingMethod || 'unknown'
    }
    const barcodeKey = barcode || `manual_${Date.now()}`
    const result = await supabase.from('products').upsert({ barcode: barcodeKey, ...row }, { onConflict: 'barcode' })
    if (result.error) {
      console.log('Supabase save error:', JSON.stringify(result.error))
      return result.error.message || 'Save failed'
    }
    console.log('Saved to Supabase products:', productName)
    return true
  } catch (e) {
    console.log('Failed to save product:', e)
    return String(e)
  }
}

// Save verified Guaranteed Analysis numbers for a product (from label scan)
export async function saveProductGA(barcode, ga) {
  if (!barcode) return
  try {
    await supabase
      .from('products')
      .upsert({
        barcode,
        protein_pct: ga.protein_pct ?? null,
        fat_pct: ga.fat_pct ?? null,
        fiber_pct: ga.fiber_pct ?? null,
        moisture_pct: ga.moisture_pct ?? null,
        omega3_pct: ga.omega3_pct ?? null,
        omega6_pct: ga.omega6_pct ?? null,
      }, { onConflict: 'barcode', ignoreDuplicates: false })
    console.log('Saved GA to Supabase for barcode:', barcode)
  } catch (e) {
    console.log('Failed to save GA:', e)
  }
}

// Save a scan result to your Google Sheet via Apps Script
export async function saveToGoogleSheet(barcode, productName, brand, ingredients, processingMethod, score) {
  if (!SHEET_SCRIPT_URL) return
  try {
    await fetch(SHEET_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        barcode,
        product_name: productName,
        brand: brand || '',
        ingredients: ingredients || '',
        processing_method: processingMethod || '',
        score: score ?? '',
        scanned_at: new Date().toISOString()
      })
    })
    console.log('Saved to Google Sheet:', productName)
  } catch (e) {
    console.log('Failed to save to Google Sheet:', e)
  }
}

// Look up a product in Supabase by name (for front-of-bag smart scan hits)
export async function lookupProductByName(productName, brand) {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .ilike('product_name', `%${productName}%`)
    if (brand) query = query.ilike('brand', `%${brand}%`)
    const { data } = await query.maybeSingle()
    if (data) {
      console.log('Found in Supabase by name:', data.product_name)
      return data
    }
  } catch (e) {
    console.log('Supabase name lookup failed:', e)
  }
  return null
}

// Smart scan — handles front of bag, ingredient list, GA panel, or any combo
export async function smartScanWithClaude(base64Image) {
  try {
    const prompt = `You are analyzing a photo of a dog food product. The photo may show the front of the bag, the ingredient list panel, the Guaranteed Analysis panel, or a combination.

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

    const response = await geminiVisionFetch(base64Image, prompt)
    if (!response.ok) {
      console.log('Smart scan HTTP error:', response.status)
      return { found: false, error: `API returned ${response.status}` }
    }
    const data = await response.json()
    const text = extractGeminiText(data)
    if (!text) return { found: false, error: 'No response from Gemini' }
    return parseGeminiJSON(text)
  } catch (e) {
    console.log('Smart scan failed:', e)
    return { found: false, error: String(e) }
  }
}

// Use Gemini vision to extract ingredients from a photo of the ingredient label
export async function scanLabelWithClaude(base64Image) {
  try {
    const prompt = `This is a photo of a pet food product label or ingredient list. Please read the ingredients from the image.

For processing_method, look for these clues on the label:
- "raw", "raw frozen", "raw food" → use "raw"
- "gently cooked", "lightly cooked", "slow cooked", "human-grade", "fresh cooked", "minimally processed" → use "gently cooked"
- "freeze-dried", "freeze dried", "air dried", "air-dried", "dehydrated" → use "freeze-dried"
- "baked", "oven baked", "oven-baked" → use "baked"
- "kibble", "dry food", "extruded", or standard dry dog food bag → use "kibble"
- If none apply → use "unknown"

Return ONLY a JSON object, no markdown backticks:
{
  "product_name": "product name if visible, or empty string",
  "brand": "brand name if visible, or empty string",
  "ingredients": "comma separated ingredient list exactly as shown in the image",
  "processing_method": "kibble or raw or gently cooked or freeze-dried or baked or unknown",
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

If you cannot read any ingredients from the image, return only:
{"found": false}`

    const response = await geminiVisionFetch(base64Image, prompt)
    const data = await response.json()
    const text = extractGeminiText(data)
    return parseGeminiJSON(text)
  } catch (e) {
    console.log('Gemini label scan failed:', e)
    return { found: false }
  }
}

// Look up detailed info about a single ingredient for the detail popup
export async function lookupIngredientDetail(ingredientName) {
  const cleaned = ingredientName.toLowerCase().trim()

  // Check vitamins_and_minerals table first
  try {
    const { data: vitData } = await supabase
      .from('vitamins and minerals list')
      .select('*')
      .ilike('Vitamin', `%${cleaned}%`)
      .maybeSingle()

    if (vitData) {
      return {
        what_it_is: `${vitData['Vitamin']} — ${vitData['Category'] || 'vitamin/mineral'}`,
        role_in_food: vitData['Synthetic Form Added'] ? `Added as ${vitData['Synthetic Form Added']}` : 'Added as a nutritional supplement',
        health_impact: vitData['Safety Rating'] === 'green' ? 'beneficial' : vitData['Safety Rating'] === 'yellow' ? 'neutral' : 'concerning',
        details: [vitData['Notes for App'], vitData['Short-Term Effect on Dog'], vitData['Long-Term Risk (Excess)']].filter(Boolean).join(' '),
        disease_links: vitData['Organs / Systems Affected'] || null,
        safe_daily_range: vitData['Safe Daily Range (Dog)'] || null,
        synthetic_safety: vitData['Synthetic Safety'] || null,
        source: 'supabase_vitamins'
      }
    }
  } catch (e) {
    console.log('Vitamin/mineral lookup failed:', e)
  }

  // Check ingredients table
  try {
    const { data: ingData } = await supabase
      .from('ingredients')
      .select('*')
      .ilike('name', `%${cleaned}%`)
      .maybeSingle()

    if (ingData) {
      return {
        what_it_is: `${ingData.name}${ingData.category ? ` (${ingData.category})` : ''}`,
        role_in_food: ingData.notes || 'Used as an ingredient in pet food',
        health_impact: ingData.safety_rating === 'green' ? 'beneficial' : ingData.safety_rating === 'yellow' ? 'neutral' : 'concerning',
        details: [ingData.notes, ingData.long_term_risk].filter(Boolean).join(' '),
        disease_links: ingData.long_term_risk || null,
        source: 'supabase_ingredients'
      }
    }
  } catch (e) {
    console.log('Ingredients table lookup failed:', e)
  }

  // Fall back to Gemini
  try {
    const response = await geminiFetch(`Explain this pet food ingredient for a dog owner: "${ingredientName}"

Return ONLY a JSON object, no markdown backticks:
{
  "what_it_is": "1 sentence: what this ingredient actually is",
  "role_in_food": "why manufacturers include it in pet food",
  "health_impact": "beneficial or neutral or concerning or harmful",
  "details": "2-3 sentences on health effects specifically for dogs",
  "disease_links": "any specific health conditions or diseases this has been linked to in dogs, or null if none known"
}`)
    const data = await response.json()
    const text = extractGeminiText(data)
    return parseGeminiJSON(text)
  } catch (e) {
    console.log('Ingredient detail lookup failed:', e)
    return null
  }
}

// AI Nutrition Coach — chat about a specific scanned product
export async function askNutritionCoach(productName, ingredientList, score, flaggedNames, messages) {
  try {
    const systemContext = `You are a friendly, knowledgeable dog nutrition coach helping a dog owner understand what's in their pet's food. You explain things simply and conversationally. Keep responses to 2-4 sentences unless the user asks for more detail. Never diagnose medical conditions — always recommend a vet for health concerns.

Product being reviewed: ${productName}
Score: ${score}/100
Concerning ingredients: ${flaggedNames.length > 0 ? flaggedNames.join(', ') : 'None detected'}
Full ingredient list: ${ingredientList}`

    const history = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
    const prompt = `${systemContext}\n\nConversation:\n${history}`

    const response = await geminiFetch(prompt)
    const data = await response.json()
    return extractGeminiText(data) || "Sorry, I couldn't connect right now. Check your internet and try again."
  } catch (e) {
    console.log('Coach failed:', e)
    return "Sorry, I couldn't connect right now. Check your internet and try again."
  }
}

// Look up ingredient list for a product name or barcode — uses Google Search grounding for barcodes
export async function lookupIngredientsWithClaude(productNameOrBarcode, brand) {
  try {
    const isBarcode = /^\d{8,14}$/.test(productNameOrBarcode.trim())

    const prompt = isBarcode
      ? `Search Google for UPC barcode ${productNameOrBarcode} dog food product. Find the exact product name, brand, and complete ingredient list. Return the full ingredient list exactly as it appears on the packaging.

Return ONLY a JSON object, no markdown:
{
  "product_name": "exact product name",
  "brand": "brand name",
  "ingredients": "comma separated ingredient list exactly as on the bag",
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

If you cannot find this product: {"found": false}`
      : `I need the ingredient list for this dog food product: "${productNameOrBarcode}"${brand ? ` by ${brand}` : ''}. Provide the full ingredient list exactly as it appears on the packaging.

Return ONLY a JSON object, no markdown:
{
  "product_name": "exact product name",
  "brand": "brand name",
  "ingredients": "comma separated ingredient list exactly as on the bag",
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

If you cannot find this product: {"found": false}`

    // Use grounding for barcodes (Google Search), plain for product names
    const response = isBarcode
      ? await geminiGroundedFetch(prompt)
      : await geminiFetch(prompt)

    const data = await response.json()
    console.log('Gemini raw response:', JSON.stringify(data))
    const text = extractGeminiText(data)
    if (!text) return { found: false }
    return parseGeminiJSON(text)
  } catch (e) {
    console.log('Gemini lookup failed:', e)
    return { found: false }
  }
}

// Batch analyze all ingredients in one Gemini call
export async function analyzeIngredientsBatch(ingredientList) {
  // Claude API is blocked by CORS on web — skip AI analysis, return empty
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return {}
  }
  try {
    const response = await claudeFetch(`You are a dog nutrition expert helping a pet owner understand their dog's food.

Analyze each ingredient below and return a JSON array.

Ingredients: ${ingredientList.join(', ')}

For each ingredient return an object:
{
  "ingredient": "exact ingredient name as given",
  "quality": "excellent|good|neutral|poor|harmful",
  "provides": "specific nutrients/benefits (e.g. 'Protein, taurine, B12, iron' — be specific)",
  "explanation": "1 clear sentence: what this ingredient is and its key health effect on dogs"
}

Return ONLY a valid JSON array. No markdown, no extra text.`)

    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim() || ''
    const arr = parseGeminiJSON(text)
    const result = {}
    for (const item of arr) {
      if (item.ingredient === '__profile__') {
        result['__profile__'] = item
      } else if (item.ingredient) {
        result[item.ingredient.toLowerCase()] = item
      }
    }
    return result
  } catch (e) {
    console.log('Batch ingredient analysis failed:', e)
    return {}
  }
}
