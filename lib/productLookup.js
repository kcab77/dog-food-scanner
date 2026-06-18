import { supabase } from './supabase'

const API_BASE = 'https://commonsensedog.com/api'
const APP_SECRET = process.env.EXPO_PUBLIC_APP_SECRET
const GOUPC_KEY = process.env.EXPO_PUBLIC_GOUPC_KEY

function appHeaders() {
  return { 'Content-Type': 'application/json', 'x-app-secret': APP_SECRET }
}

// Look up product via Go-UPC directly
export async function lookupWithGoUPC(barcode) {
  if (!GOUPC_KEY) return null
  try {
    const response = await fetch(`https://go-upc.com/api/v1/code/${barcode}`, {
      headers: { 'Authorization': `Bearer ${GOUPC_KEY}` }
    })
    if (!response.ok) return null
    const json = await response.json()
    const product = json?.product
    if (!product) return null
    const ingredients = product.ingredients?.text || ''
    console.log('Go-UPC found:', product.name, '| ingredients:', ingredients ? 'yes' : 'no')
    return {
      found: true,
      product_name: product.name || '',
      brand: product.brand || '',
      ingredients,
      image_url: product.imageUrl || '',
    }
  } catch (e) {
    console.log('Go-UPC lookup failed:', e)
    return null
  }
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

// Save a scan result to Google Sheet — proxied through backend so URL is never in the app
export async function saveToGoogleSheet(barcode, productName, brand, ingredients, processingMethod, score) {
  try {
    await fetch(`${API_BASE}/log-scan`, {
      method: 'POST',
      headers: appHeaders(),
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

// Smart scan — proxied through backend so API key is never in the app
export async function smartScanWithClaude(base64Image) {
  try {
    const response = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers: appHeaders(),
      body: JSON.stringify({ image: base64Image }),
    })
    if (!response.ok) return { found: false, error: `API returned ${response.status}` }
    return await response.json()
  } catch (e) {
    console.log('Smart scan failed:', e)
    return { found: false, error: String(e) }
  }
}

// Look up detailed info about a single ingredient — Supabase first, backend fallback
export async function lookupIngredientDetail(ingredientName) {
  const cleaned = ingredientName.toLowerCase().trim()

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

  // Backend fallback — key stays server-side
  try {
    const response = await fetch(`${API_BASE}/ingredient`, {
      method: 'POST',
      headers: appHeaders(),
      body: JSON.stringify({ ingredient: ingredientName }),
    })
    if (response.ok) return await response.json()
  } catch (e) {
    console.log('Ingredient detail backend lookup failed:', e)
  }

  return null
}

// AI Nutrition Coach — proxied through backend so API key is never in the app
export async function askNutritionCoach(productName, ingredientList, score, flaggedNames, messages) {
  try {
    const response = await fetch(`${API_BASE}/coach`, {
      method: 'POST',
      headers: appHeaders(),
      body: JSON.stringify({ productName, ingredientList, score, flaggedNames, messages }),
    })
    if (response.ok) {
      const data = await response.json()
      return data.message || "Sorry, I couldn't connect right now."
    }
    return "Sorry, I couldn't connect right now. Check your internet and try again."
  } catch (e) {
    console.log('Coach failed:', e)
    return "Sorry, I couldn't connect right now. Check your internet and try again."
  }
}
