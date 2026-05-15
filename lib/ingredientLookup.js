import { supabase } from './supabase'

// Clean a raw ingredient string into individual ingredients
export function parseIngredientList(rawString) {
  return rawString
    .toLowerCase()
    .replace(/\[/g, ',')
    .replace(/\]/g, ',')
    .replace(/\([^)]*\)/g, '')
    .split(',')
    .map(i => i.trim())
    .filter(i => i.length > 0)
}

// Look up a single ingredient by name or alias
export async function lookupIngredient(ingredientName) {
  const cleaned = ingredientName.toLowerCase().trim()
  console.log('Looking up:', cleaned)

  // First try exact name match
const { data: exactMatch, error: exactError } = await supabase
    .from('ingredients')
    .select('*')
    .ilike('name', cleaned)
    .maybeSingle()
  console.log('Result for', cleaned, ':', exactMatch, 'Error:', exactError)
  if (exactMatch) return exactMatch

  // Then try alias match
  const { data: aliasMatches } = await supabase
    .from('ingredients')
    .select('*')
    .contains('aliases', [cleaned])

  if (aliasMatches && aliasMatches.length > 0) return aliasMatches[0]

  // Nothing found — return unknown
  return {
    name: ingredientName,
    safety_rating: 'unknown',
    purine_level: 'unknown',
    synthetic: null,
    category: 'unknown',
    notes: 'This ingredient is not yet in our database.',
    long_term_risk: null,
    unknown: true
  }
}

// Auto-add new ingredients to master table so you can rate them later
async function autoAddNewIngredients(parsedIngredients) {
  try {
    // Fetch all existing ingredient names in one call
    const { data: existing } = await supabase
      .from('ingredients')
      .select('name')

    const existingNames = new Set((existing || []).map(r => r.name.toLowerCase()))

    const toInsert = parsedIngredients
      .filter(name => name.length > 2 && !existingNames.has(name.toLowerCase()))
      .map(name => ({
        name: name.toLowerCase().trim(),
        safety_rating: null,
        category: null,
        synthetic: false,
        notes: 'Auto-added from scan — needs review',
      }))

    if (toInsert.length === 0) return

    await supabase
      .from('ingredients')
      .upsert(toInsert, { onConflict: 'name', ignoreDuplicates: true })

    console.log(`Auto-added ${toInsert.length} new ingredients to master table`)
  } catch (e) {
    console.log('Auto-add ingredients failed:', e)
  }
}

// Analyze a full ingredient list string
export async function analyzeIngredients(rawIngredientString) {
  const parsed = parseIngredientList(rawIngredientString)

  // Auto-add any new ingredients to master table in background (don't await)
  autoAddNewIngredients(parsed).catch(() => {})

  // Look up all ingredients in parallel
  const results = await Promise.all(
    parsed.map(ingredient => lookupIngredient(ingredient))
  )

  // Calculate overall score
  const score = calculateScore(results)

  return {
    ingredients: results,
    score,
    totalCount: results.length,
    redCount: results.filter(i => i.safety_rating === 'red').length,
    yellowCount: results.filter(i => i.safety_rating === 'yellow').length,
    greenCount: results.filter(i => i.safety_rating === 'green').length,
    unknownCount: results.filter(i => i.safety_rating === 'unknown').length,
    highPurineCount: results.filter(i =>
      i.purine_level === 'high' || i.purine_level === 'very_high'
    ).length,
    syntheticCount: results.filter(i => i.synthetic === true).length,
    redFlags: results.filter(i => i.safety_rating === 'red'),
  }
}

// Score the food A through F
function calculateScore(ingredients) {
  const known = ingredients.filter(i => i.safety_rating !== 'unknown')
  if (known.length === 0) return { letter: '?', numeric: 0 }

  let points = 0
  const total = known.length

  known.forEach(ingredient => {
    if (ingredient.safety_rating === 'green') points += 2
    if (ingredient.safety_rating === 'yellow') points += 1
    if (ingredient.safety_rating === 'red') points += 0

    // Extra penalty for specific red flag ingredients
    if (ingredient.name === 'menadione sodium bisulfite complex') points -= 3
    if (ingredient.name === 'sodium selenite') points -= 2
    if (ingredient.name === 'poultry by-product meal') points -= 2
  })

  const percentage = (points / (total * 2)) * 100

  let letter
  if (percentage >= 85) letter = 'A'
  else if (percentage >= 70) letter = 'B'
  else if (percentage >= 55) letter = 'C'
  else if (percentage >= 40) letter = 'D'
  else letter = 'F'

  return { letter, numeric: Math.round(percentage) }
}