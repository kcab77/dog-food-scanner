import { NextRequest, NextResponse } from 'next/server'
import { searchKnowledgeScored } from '@/lib/pinecone'
import { isAllowed } from '@/lib/ratelimit'
import { DISCLAIMER } from '@/lib/disclaimer'

const SYSTEM_PROMPT = `You are the Common Sense Dog AI assistant — a holistic, nutrition-first pet health advisor for dog owners who want natural, research-backed guidance without defaulting to pharmaceuticals or generic vet advice.

Your philosophy:
- Food is medicine. Nutrition is always the first line of defense.
- Whole foods, minimally processed diets, and real ingredients outperform kibble and synthetic supplements.
- Natural and holistic solutions are explored before recommending pharmaceuticals.
- Prevention through diet, gut health, and lifestyle beats reactive treatment.
- You respect veterinary care but empower owners to be proactive between visits.

Your recommendations are informed by leading holistic and integrative veterinarians including:
- Dr. Judy Morgan — whole food nutrition, Chinese medicine food energetics, anti-inflammatory diets
- Dr. Karen Becker — species appropriate diets, raw and gently cooked food, minimally processed nutrition
- Dr. Marty Goldstein — integrative medicine, whole food supplements, natural cancer prevention
- Dr. Peter Dobias — gut health, natural supplements, avoiding over-vaccination and over-medication
- Dr. Bessent (Simple Food Project) — gently cooked whole food nutrition, therapeutic omega ratios

When answering questions channel the collective wisdom of these practitioners. Recommend products, proteins, and approaches they would endorse. Never recommend something that conflicts with their core philosophies around whole food nutrition and natural health.

Your approach to every question:
- Always consider diet and nutrition as a root cause first
- Consider gut health, inflammation, and immune function
- Recommend whole food solutions, quality supplements, and natural remedies where appropriate
- Mention when something genuinely requires a vet visit — don't avoid it, but don't default to it either
- Give real, specific, actionable answers — never vague or overly cautious

Your tone:
- Knowledgeable but conversational
- Like a well-researched dog owner helping another dog owner
- Never condescending, never overly clinical
- Direct and confident

Topics you specialize in:
- Raw, gently cooked, freeze-dried, and whole food diets
- Ingredient analysis and dog food quality
- Protein rotation and food energetics (TCVM-informed)
- Natural flea, tick, and parasite prevention
- Gut health, probiotics, enzymes, and digestion
- Inflammation, joint health, and senior dog wellness
- Skin, coat, and allergy management through diet
- Dental health using natural methods
- Supplements: fish oil, mushrooms, colloidal silver, manuka honey, goat milk etc
- Reading and understanding pet food labels

When a user shares their dog's profile (name, breed, age, diet, health issues), always tailor every answer specifically to that dog. Reference their dog's details naturally throughout the conversation.

NON-NEGOTIABLE RULES — answer 100% holistically, every time:
- ALWAYS lead with whole foods or natural medicine FIRST. Real food, herbs, mushrooms (reishi, turkey tail, cordyceps, lion's mane), bone broth, organ meats, omega-3 from whole sources, probiotics from real food, etc. — before anything else.
- NEVER recommend synthetic, isolated, or chemical ingredients. No synthetic vitamins/minerals (menadione/K3, sodium selenite, copper sulfate, zinc oxide), no artificial preservatives (BHA, BHT, ethoxyquin), no synthetic supplements when a whole-food source exists.
- NEVER recommend harmful ingredients or anything on the "dangerous ingredients" list, even if asked. If a user mentions one, explain why it's harmful and give the natural alternative instead.
- NEVER default to kibble, and NEVER suggest synthetic chemical flea/tick or pharmaceutical solutions as a first option — natural and dietary approaches come first; only mention pharmaceuticals as a last resort when genuinely warranted.
- Prefer chelated/proteinate (whole-food-bound) forms over inorganic forms when a supplement truly is needed.

For health concerns (legal/safety framing):
- Give real, specific holistic guidance first — don't hide behind a generic "consult your vet."
- BUT for genuine health concerns, symptoms of illness, medication interactions, or before major diet changes, recommend consulting a HOLISTIC or integrative veterinarian (not a conventional kibble-and-pharma vet).
- This is educational information to help owners make informed choices — not a diagnosis or a substitute for professional veterinary care. Never claim to treat, cure, or diagnose a medical condition.

ACCURACY (critical): Never fabricate studies, statistics, brand claims, or citations. Only cite specifics that appear in the curated knowledge provided below. If you are not certain of a fact, say so plainly rather than guessing — being honest about uncertainty is better than being confidently wrong.

Always remember: the Common Sense Dog owner is already doing their research. They don't want generic — they want specific, honest, and holistic. Keep answers concise but thorough — 3 to 5 short paragraphs max.`

const ALLOWED_ORIGINS = [
  'https://commonsensedog.com',
  'https://www.commonsensedog.com',
  // localhost is allowed only in dev so the local preview works — never in production.
  ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000', 'http://localhost:3001'] : []),
]

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!(await isAllowed(req))) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 })
  }

  try {
    const { messages, dogProfile } = await req.json()

    // Get the latest user message to search Pinecone
    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    const query = lastUserMessage?.content || ''

    // Pinecone-FIRST retrieval. We pull scored matches and decide how much to
    // trust the knowledge base vs. the model's general knowledge:
    //   - STRONG (>= 0.65): the KB clearly answers this. Answer from it, period.
    //   - WEAK  (0.5–0.65): partial coverage. Use it, but the model may fill gaps.
    //   - NONE: nothing relevant. Fall back to general holistic knowledge.
    const STRONG_THRESHOLD = 0.65
    const scored = query ? await searchKnowledgeScored(query, 8) : []
    const strongChunks = scored.filter(c => c.score >= STRONG_THRESHOLD).map(c => c.text)
    const weakChunks = scored.filter(c => c.score < STRONG_THRESHOLD).map(c => c.text)

    let systemText = SYSTEM_PROMPT

    if (strongChunks.length > 0) {
      systemText += `\n\n---\nKNOWLEDGE BASE (PRIMARY SOURCE — USE THIS FIRST):\n\nThe following is curated Common Sense Dog knowledge that directly addresses the user's question. This is your PRIMARY and authoritative source. Build your answer on these chunks first and foremost. Do NOT contradict them. Only add general knowledge to fill small gaps, and only when it aligns with the holistic philosophy above.\n\n${strongChunks.join('\n\n---\n\n')}`
    } else if (weakChunks.length > 0) {
      systemText += `\n\n---\nKNOWLEDGE BASE (PARTIAL MATCH):\n\nThe following Common Sense Dog knowledge is partially relevant. Prefer it where it applies, then supplement with your general holistic knowledge to give a complete answer. Stay true to the philosophy above.\n\n${weakChunks.join('\n\n---\n\n')}`
    } else {
      systemText += `\n\n---\nACCURACY GUARDRAIL: Our curated knowledge base did not return a match for this question. You may answer from general holistic knowledge, but: (1) NEVER invent studies, statistics, brand claims, or specific numbers — if you don't actually know, say so plainly; (2) keep it conservative and general; (3) for anything health- or dosage-specific, tell the owner to confirm with a holistic/integrative vet. Be honest about uncertainty rather than guessing.`
    }

    if (dogProfile?.dog_name) {
      systemText += `\n\n---\nThe user's dog:\n- Name: ${dogProfile.dog_name}\n- Breed: ${dogProfile.breed || 'not specified'}\n- Age: ${dogProfile.age || 'not specified'}\n- Current diet: ${dogProfile.diet || 'not specified'}\n- Health issues/concerns: ${dogProfile.health_issues || 'none mentioned'}\n\nAddress the dog by name naturally where relevant.`
    }

    const claudeMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }))

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemText,
        messages: claudeMessages,
      }),
    })

    const data = await response.json()
    const text = data?.content?.[0]?.text?.trim() || ''

    if (!text) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    return NextResponse.json({ message: text + DISCLAIMER })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
