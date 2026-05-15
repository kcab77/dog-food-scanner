import { supabase } from './supabase'

// Clean a raw ingredient string into individual ingredients
export function parseIngredientList(rawString) {
  return rawString
    .toLowerCase()
    // Remove content inside brackets like [zinc proteinate, ...]
    // but keep the ingredients inside by replacing brackets with commas
    .replace(/\[/g, ',')
    .replace(/\]/g, ',')
    // Remove parenthetical notes like (Vitamin B-1)
    .replace(/\([^)]*\)/g, '')
    // Split on commas
    .split(',')
    // Clean whitespace
    .map(i => i.trim())
    // Remove empty strings
    .filter(i => i.length > 0)
}

// Look up a single ingredient by name or alias
export async function lookupIngredient(ingredientName) {
  const cleaned = ingredientName.toLowerCase().trim()

  // First try exact name match
  const { data: exactMatch } = await supabase
    .from('ingredients')
    .select('*')
    .ilike('name', cleaned)
    .single()

  if (exactMatch) return exactMatch

  // Then try alias match
  const { data: aliasMatch } = await supabase
    .from('ingredients')
    .select('*')
    .contains('aliases', [cleaned])
    .single()

  if (aliasMatch) return aliasMatch

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

// Analyze a full ingredient list string
export async function analyzeIngredients(rawIngredientString) {
  const parsed = parseIngredientList(rawIngredientString)
  
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