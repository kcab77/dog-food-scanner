import { supabase } from './supabase'

const API_BASE = 'https://commonsensedog.com/api'
const APP_SECRET = process.env.EXPO_PUBLIC_APP_SECRET

function appHeaders() {
  return { 'Content-Type': 'application/json', 'x-app-secret': APP_SECRET }
}

// Look up product via the server-side Go-UPC proxy (paid key stays on the server)
export async function lookupWithGoUPC(barcode) {
  try {
    const response = await fetch(`${API_BASE}/barcode?code=${encodeURIComponent(barcode)}`, {
      headers: appHeaders(),
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

// Sources we SERVE as our own DB.
// smartscan = extracted from a user's ingredient-panel photo (fully ours, trusted);
// manual = hand-entered/verified by us.
// NOT served: go-upc (use-only license), legacy_unknown, and — for now —
// 'openfoodfacts' (open-licensed openpetfoodfacts import; preserved + tagged but
// Kyle judged it "not really meaningful", so it's excluded from serving until
// reviewed. To re-enable serving that open-license data, add 'openfoodfacts' here).
export const OWNED_SOURCES = ['smartscan', 'manual']

// Look up product by barcode in our OWN Supabase DB first.
// By default only returns owned rows — go-upc/sheet/legacy rows are NOT served
// as our data (they get overwritten by SmartScan on rescan).
export async function lookupProduct(barcode, { ownedOnly = true } = {}) {
  try {
    let query = supabase.from('products').select('*').eq('barcode', barcode)
    if (ownedOnly) query = query.in('source', OWNED_SOURCES)
    const { data } = await query.maybeSingle()

    if (data) {
      console.log('Found in owned products DB:', data.product_name, `(${data.source})`)
      return data
    }
  } catch (e) {
    console.log('Supabase product lookup failed:', e)
  }
  return null
}

// Save a product to our Supabase products DB.
// `source` defaults to 'smartscan' (the primary flow). Go-UPC responses must
// NOT be persisted (use-only license) — this is enforced below as a hard guard.
export async function saveProduct(barcode, productName, brand, ingredients, processingMethod, source = 'smartscan') {
  // Licensing guard: never write Go-UPC-sourced data to our DB.
  if (source === 'go-upc') {
    console.log('Refusing to persist go-upc data (use-only license).')
    return 'skipped: go-upc not persisted'
  }
  try {
    const row = {
      product_name: productName,
      brand: brand || '',
      ingredients: ingredients || '',
      processing_method: processingMethod || 'unknown',
      source,
      updated_at: new Date().toISOString(),
    }
    const barcodeKey = barcode || `manual_${Date.now()}`
    const result = await supabase.from('products').upsert({ barcode: barcodeKey, ...row }, { onConflict: 'barcode' })
    if (result.error) {
      console.log('Supabase save error:', JSON.stringify(result.error))
      return result.error.message || 'Save failed'
    }
    console.log(`Saved to owned products DB (${source}):`, productName)
    return true
  } catch (e) {
    console.log('Failed to save product:', e)
    return String(e)
  }
}

// ---- Barcode API (Go-UPC) monthly quota — 150 free lookups/month ----
export const BARCODE_MONTHLY_LIMIT = 150
const currentMonthKey = () => new Date().toISOString().slice(0, 7) // 'YYYY-MM'

// Read this month's Go-UPC usage. Returns { used, limit, remaining, canUse }.
export async function getBarcodeQuota() {
  const month = currentMonthKey()
  try {
    const { data } = await supabase
      .from('barcode_quota')
      .select('used')
      .eq('month', month)
      .maybeSingle()
    const used = data?.used ?? 0
    return { used, limit: BARCODE_MONTHLY_LIMIT, remaining: Math.max(0, BARCODE_MONTHLY_LIMIT - used), canUse: used < BARCODE_MONTHLY_LIMIT }
  } catch (e) {
    console.log('Quota read failed:', e)
    // Fail SAFE: if we can't read the quota, don't burn API calls.
    return { used: BARCODE_MONTHLY_LIMIT, limit: BARCODE_MONTHLY_LIMIT, remaining: 0, canUse: false }
  }
}

// Atomically increment this month's Go-UPC usage (call ONLY after a successful API lookup).
export async function incrementBarcodeQuota() {
  try {
    const { data, error } = await supabase.rpc('increment_barcode_quota', { p_month: currentMonthKey() })
    if (error) { console.log('Quota increment failed:', error.message); return null }
    return data // new used count
  } catch (e) {
    console.log('Quota increment error:', e)
    return null
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

// DEPRECATED (2026-07): the Google Sheet was of unknown origin and is removed
// from the lookup pipeline. Kept as a no-op so any lingering caller doesn't crash.
// Scan analytics now live in Supabase `scans` (see lib/supabase.js logScan).
export async function saveToGoogleSheet(..._args) {
  return // intentionally no-op — do not re-enable the unknown-origin sheet
}

// Look up a product in our OWN Supabase DB by name (front-of-bag smart scan hits).
// Owned sources only — we don't surface go-upc/legacy rows as our data.
export async function lookupProductByName(productName, brand) {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .in('source', OWNED_SOURCES)
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

/**
 * Normalise a safety rating into the app's three impact levels.
 *
 * ⚠️ The two Supabase tables store this differently and the old code only
 * understood one of them. `ingredients.safety_rating` holds 'green' / 'yellow' /
 * 'red', but `vitamins and minerals list`."Safety Rating" holds prose that was
 * meant to carry an emoji — "✅ Safe", "⚠️ Caution in excess" — and arrived
 * mangled as "? Safe" and "?? Caution in excess".
 *
 * The old comparison was `=== 'green'`, so NOTHING in the vitamins table ever
 * matched and every single vitamin fell through to 'concerning' — biotin and
 * riboflavin included. Reads the words now, not just the colour.
 */
function ratingToImpact(rating) {
  const r = String(rating || '').toLowerCase()
  if (!r) return 'neutral'
  if (r.includes('green') || (r.includes('safe') && !r.includes('avoid'))) return 'beneficial'
  if (r.includes('yellow') || r.includes('caution') || r.includes('prefer') || r.includes('balance')) return 'neutral'
  if (r.includes('red') || r.includes('avoid') || r.includes('toxic') || r.includes('high risk')) return 'concerning'
  return 'neutral'
}

/**
 * Look up detailed info about a single ingredient.
 *
 * ⚠️ PRECEDENCE, set by Kyle 2026-09-04: the app's own HARMFUL_INGREDIENTS and
 * docs/MINERAL_FORMS_CHEATSHEET.md are CANONICAL. Supabase is enrichment — it
 * carries fields the app doesn't (long_term_risk, organs affected, safe daily
 * range), and that's its job. Where the two ever disagree on severity or on
 * whether something is a concern, the in-app data wins and the Supabase row is
 * the thing to fix.
 *
 * The Supabase mineral rows were themselves derived from those two files on
 * 2026-09-04, so they agree today. This note exists so they still agree later.
 */
// Supabase first for the richer fields, backend fallback
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
        health_impact: ratingToImpact(vitData['Safety Rating']),
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
        health_impact: ratingToImpact(ingData.safety_rating),
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

// AI Nutrition Coach — proxied through backend so API key is never in the app.
// When the owner is signed in we also send their auth token, which lets the server
// look up their dog's profile and tailor the answer. The profile itself is never
// sent from here: the server reads it from the database using the verified token,
// so a client can't fake a profile to steer the response. Signed out, this behaves
// exactly as before.
export async function askNutritionCoach(productName, ingredientList, score, flaggedNames, messages) {
  try {
    const headers = appHeaders()
    try {
      const { getSession } = require('./supabase')
      const session = await getSession()
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`
    } catch (_) {
      // not signed in, or auth unavailable — fall through as anonymous
    }

    const response = await fetch(`${API_BASE}/coach`, {
      method: 'POST',
      headers,
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
