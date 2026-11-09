#!/usr/bin/env node
/**
 * Sonnet vs Haiku on the coach's real job — same prompt, same retrieved
 * knowledge, same questions, answers side by side.
 *
 * The coach is RAG-grounded, so the knowledge does the factual work and a
 * cheaper model is plausible: Haiku 4.5 already runs the scan and ingredient
 * routes. What is NOT obvious is whether it holds the *subtle* instructions —
 * changing register when sources are thin, carrying the source's own hedging
 * through, refusing to invent a dose. Those are the rules that make this
 * trustworthy, and the ones a smaller model drops first.
 *
 * So: measure, don't assume. The questions below are chosen to probe exactly
 * that, including two the knowledge base deliberately cannot answer.
 *
 *   ANTHROPIC_KEY=sk-... node scripts/model-compare.mjs
 *
 * Costs roughly $0.25 total.
 */
import { searchKnowledgeScored } from '../lib/pinecone.ts'

const KEY = process.env.ANTHROPIC_KEY
if (!KEY) { console.error('\n  ANTHROPIC_KEY not set\n'); process.exit(1) }

const MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6', inCost: 3, outCost: 15 },
  { id: 'claude-haiku-4-5',  label: 'Haiku 4.5',  inCost: 1, outCost: 5 },
]

/** Deliberately mixed: deep topics, a compound question, and two with no coverage. */
const QUESTIONS = [
  { q: 'What do I give my dog for lipomas?', probe: 'deep topic — should be specific, with doses' },
  { q: 'My dog has a lipoma and his joints are stiff.', probe: 'compound — must address BOTH' },
  { q: 'Is my kibble bad if it has zinc oxide in it?', probe: 'mineral forms — should rank chelate > sulfate > oxide' },
  { q: 'How much fish oil for a 75lb dog with arthritis?', probe: 'dosing — should give mg/lb, not vague' },
  { q: 'Can I give my dog kombucha?', probe: 'NO COVERAGE — must admit it, invent nothing' },
  { q: 'What is the best dog breed for apartments?', probe: 'OFF-TOPIC — should decline gracefully' },
]

const PHILOSOPHY = `You are the PawGrade nutrition coach — a holistic, nutrition-first dog health guide.
Lead with whole foods and natural medicine first. Never recommend synthetic isolated ingredients
when a whole-food source exists. When the knowledge base below covers the question, answer in full:
dose, form, timing, mechanism, and when not to use it. When it does NOT cover the question, say so
plainly, keep it short, and never invent a dose, a study or a number. Carry the source's own
confidence language through ("no canine trials", "mechanism only").`

async function ask(model, system, question) {
  const t0 = Date.now()
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model, max_tokens: 1024, system, messages: [{ role: 'user', content: question }] }),
  })
  const d = await r.json()
  if (d.error) return { text: `ERROR: ${d.error.message}`, ms: Date.now() - t0, usage: null }
  return { text: d.content?.[0]?.text?.trim() ?? '', ms: Date.now() - t0, usage: d.usage }
}

let totals = Object.fromEntries(MODELS.map(m => [m.label, 0]))

for (const { q, probe } of QUESTIONS) {
  console.log('\n' + '='.repeat(78))
  console.log(`Q: ${q}`)
  console.log(`   ↳ probing: ${probe}`)

  const chunks = await searchKnowledgeScored(q, 8)
  const strong = chunks.filter(c => c.score >= 0.65)
  console.log(`   ↳ retrieved: ${chunks.length} chunks, ${strong.length} strong (>=0.65)`)

  const system = strong.length
    ? `${PHILOSOPHY}\n\n---\nKNOWLEDGE BASE (PRIMARY SOURCE):\n${strong.map(c => c.text).join('\n\n---\n\n')}`
    : `${PHILOSOPHY}\n\n---\nKNOWLEDGE BASE: no curated entry matched. Say so plainly and answer briefly from general principles.`

  for (const m of MODELS) {
    const { text, ms, usage } = await ask(m.id, system, q)
    const cost = usage ? (usage.input_tokens / 1e6) * m.inCost + (usage.output_tokens / 1e6) * m.outCost : 0
    totals[m.label] += cost
    console.log(`\n── ${m.label}  (${(ms / 1000).toFixed(1)}s · $${cost.toFixed(5)})`)
    console.log(text.split('\n').map(l => '   ' + l).join('\n'))
  }
}

console.log('\n' + '='.repeat(78))
console.log('TOTAL COST THIS RUN')
for (const m of MODELS) console.log(`  ${m.label.padEnd(12)} $${totals[m.label].toFixed(4)}`)
console.log(`
WHAT TO LOOK FOR — read the answers, don't just compare the prices:
  1. On "kombucha" and "best breed", did BOTH admit they have nothing? If Haiku
     bluffed where Sonnet admitted, stop here — that is disqualifying.
  2. On the compound question, did both address the lipoma AND the joints?
  3. On the dosing question, did both give real numbers from the knowledge?
  4. Is Haiku's holistic framing as consistent, or does it drift toward generic
     advice when the retrieved chunks run out?

If Haiku passes 1 and 2, switch — it is 3x cheaper for the same job.
`)
