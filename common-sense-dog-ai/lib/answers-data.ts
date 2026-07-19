// Minimal SEO "answer pages" — one clean question per URL, funnels into the AI assistant.
// NOT linked in the site nav. Only people who Google the exact question land here.
// Same knowledge that's in Pinecone, published crawlably so it can rank + earn FAQ rich results.

export type AnswerFaq = { q: string; a: string }
export type AnswerPage = {
  slug: string
  emoji: string
  tag: string
  title: string            // the search-query headline (H1 + <title>)
  metaDescription: string
  lead: string             // the direct 2-3 sentence answer up top
  faqs: AnswerFaq[]
}

export const answerPages: AnswerPage[] = [
  {
    slug: 'natural-thyroid-support-for-dogs',
    emoji: '🦋',
    tag: 'Holistic Organ Support',
    title: 'Natural Thyroid Support for Dogs',
    metaDescription:
      "Can you support a dog's thyroid naturally? The honest answer — which nutrients and herbs help hypothyroid dogs, what to avoid, and why medication still matters.",
    lead:
      "You can't cure a truly hypothyroid dog with herbs alone — the proven treatment is thyroid hormone (levothyroxine), and it works. But the right nutrients and a few herbs genuinely support the gland alongside medication. Here's what helps, and what can quietly make things worse.",
    faqs: [
      {
        q: 'What helps a dog’s thyroid naturally?',
        a: 'Support the gland’s machinery, don’t try to replace the hormone: selenium and zinc help convert storage hormone T4 into active T3, tyrosine from quality animal protein is the building block, and omega-3 fish oil helps the skin and coat problems that come with low thyroid. These are an adjunct to medication, never a replacement.',
      },
      {
        q: 'Is kelp or seaweed good for a dog’s thyroid?',
        a: 'It’s double-edged. Kelp is concentrated iodine, which the thyroid needs — but too much can actually worsen hypothyroidism and interfere with medication. Commercial kibble is already fortified with iodine (don’t stack daily kelp on top), while home-cooked or raw diets may genuinely need a measured source. Never free-feed kelp to a medicated dog without your vet.',
      },
      {
        q: 'What herbs support a dog’s thyroid?',
        a: 'For an underactive thyroid, ashwagandha and guggul are traditionally used (human/traditional data, no canine trials) and adaptogens like rhodiola and holy basil support the stress axis. One critical safety point: bugleweed, lemon balm, and motherwort are ANTI-thyroid herbs used for an OVERactive thyroid — giving them to a hypothyroid dog is backwards and can make it worse.',
      },
      {
        q: 'Does feeding kibble vs. fresh food change my dog’s thyroid needs?',
        a: 'Yes. Kibble-fed dogs usually get plenty of iodine (it’s fortified), so the risk is over-supplementing; cheaper kibble also uses less-bioavailable mineral forms. Raw or home-cooked dogs are the ones who may fall short on iodine and trace minerals and need them added. So “should I add iodine?” has almost opposite answers depending on the bowl.',
      },
      {
        q: 'What are the signs of low thyroid in dogs?',
        a: 'Weight gain without eating more, low energy, a dull coat with symmetrical hair loss (the “rat tail”), recurrent skin and ear infections, and seeking out warm spots — most often in middle-aged medium-to-large breeds. It’s confirmed with a blood panel (T4, free T4, TSH), not a single low reading.',
      },
    ],
  },
  {
    slug: 'milk-thistle-for-dogs',
    emoji: '🌿',
    tag: 'Holistic Liver Support',
    title: 'Milk Thistle for Dogs: Liver Benefits, Dosage & Safety',
    metaDescription:
      "Milk thistle (silymarin) is the most evidence-backed liver herb for dogs. What it does, when to give it, safe dosing basics, and what to watch for.",
    lead:
      "Milk thistle — specifically its active compound silymarin — is the most evidence-supported herb for canine liver support. It’s an antioxidant that helps protect and regenerate liver cells, which is why it’s used during and after medications, toxin exposure, or when liver enzymes are elevated. It supports the liver; it isn’t a cure for liver disease, so use it alongside your vet.",
    faqs: [
      {
        q: 'What does milk thistle do for a dog’s liver?',
        a: 'Its active compound, silymarin, is an antioxidant that helps shield liver cells from damage and supports their regeneration. It also supports the liver’s natural detox pathways. That’s why it’s commonly given when a dog is on liver-taxing medications, has been exposed to toxins or pesticides, or has raised liver values — as support, not a replacement for veterinary treatment.',
      },
      {
        q: 'Is milk thistle safe for dogs?',
        a: 'It’s generally well-tolerated, with mild digestive upset the most common effect at higher doses. It’s usually given in courses (during and after a liver stressor) rather than continuously for life unless a vet advises it. Because it can affect how the liver processes certain drugs, tell your vet your dog is on it — especially if they’re taking other medications.',
      },
      {
        q: 'How much milk thistle should I give my dog?',
        a: 'The right amount depends on the product’s silymarin content and your dog’s size, so this is a vet-guided number rather than a one-size dose. Look for standardized extracts (ideally ones that state their silymarin percentage; phosphatidylcholine-bound forms absorb better). Don’t guess with human supplements that contain added ingredients — get the dose confirmed for your dog.',
      },
      {
        q: 'When should I give my dog milk thistle?',
        a: 'The best-supported times are around a liver stressor: during and after a course of medication (including anesthesia, antibiotics, or long-term drugs), after known toxin or pesticide exposure, or when bloodwork shows elevated liver enzymes. Some owners run short supportive courses; it’s not automatically a daily-forever supplement.',
      },
      {
        q: 'Does my dog’s diet change how much liver support they need?',
        a: 'It can. Dogs on ultra-processed, lower-quality diets — or with more exposure to processed foods, chemical preservatives, and environmental toxins — put more day-to-day load on the liver than dogs on fresh, whole-food diets. Milk thistle is supportive either way, but a cleaner diet is the foundation; the herb doesn’t undo a poor one.',
      },
    ],
  },
  {
    slug: 'homemade-dog-toothpaste',
    emoji: '🦷',
    tag: 'Dental Care',
    title: 'Homemade Dog Toothpaste: Safe DIY Recipe',
    metaDescription:
      "A vet-safety-checked homemade dog toothpaste recipe — plus the human-toothpaste ingredients (xylitol, fluoride, essential oils) that are genuinely dangerous for dogs.",
    lead:
      "You can make a safe, effective dog toothpaste at home with just two ingredients — but the bigger issue is what NOT to put in it. Never use human toothpaste on a dog: fluoride and xylitol (a common human-toothpaste sweetener) are both toxic to dogs, and xylitol can be fatal in small amounts. Here's a simple, safe recipe and exactly which \"natural\" additions to avoid.",
    faqs: [
      {
        q: 'What is a safe homemade dog toothpaste recipe?',
        a: 'The simplest safe base is coconut oil plus baking soda: mix roughly 2 tablespoons of coconut oil with 1 teaspoon of baking soda into a paste. Coconut oil has natural antibacterial properties (lauric acid) and dogs generally tolerate the taste; baking soda mildly helps lift plaque. Keep the ratio baking-soda-light — it should taste mostly like coconut oil, not a science-fair volcano. Store in a small sealed container and use a soft dog toothbrush or a finger brush.',
      },
      {
        q: 'Can I just use my own toothpaste on my dog?',
        a: 'No — never use human toothpaste on a dog. Two ingredients make it genuinely dangerous: fluoride, which is toxic to dogs in the amounts found in a tube of human toothpaste, and xylitol, a sugar substitute in many "natural" and sugar-free human toothpastes that causes a rapid, dangerous drop in blood sugar and can lead to liver failure in dogs — even a small lick of a xylitol-containing toothpaste is a genuine emergency. Check ingredient labels carefully; xylitol shows up in unexpected products.',
      },
      {
        q: 'Are essential oils safe to add to dog toothpaste?',
        a: 'Most are not, so it\'s safest to leave them out entirely. Tea tree (melaleuca), wintergreen, clove, and cinnamon essential oils are all established canine toxins even in small concentrated amounts, and dogs are swallowing this paste, not spitting it out like a person would. If you want flavor, a small pinch of finely chopped curly parsley (not spring/wild parsley, which is different and can be toxic) is a safe, breath-freshening addition — skip the essential oil aisle altogether.',
      },
      {
        q: 'Is baking soda safe for dogs in toothpaste?',
        a: 'In the small amount used in a toothpaste recipe (roughly a teaspoon mixed into oil, most of which stays on the brush and gums rather than being swallowed), baking soda is considered safe for occasional dental use. It becomes a real concern only in large ingested quantities, where sodium bicarbonate can cause GI upset or, in extreme cases, electrolyte imbalance — which is a reason to keep any homemade toothpaste stored well out of reach, not left out where a dog could get into the whole batch.',
      },
      {
        q: 'Does homemade toothpaste actually replace brushing or dental chews?',
        a: 'No product — homemade, commercial, or a dental chew — replaces mechanical brushing as the gold standard for canine dental health. Toothpaste (homemade or store-bought) is a flavor/compliance aid that makes brushing tolerable for the dog; the actual plaque removal comes from the brushing action itself, ideally daily. Use a safe homemade paste to make the habit stick, not as a substitute for the brush.',
      },
    ],
  },
  {
    slug: 'can-dogs-eat-apples',
    emoji: '🍎',
    tag: 'Safe & Toxic Foods',
    title: 'Can Dogs Eat Apples?',
    metaDescription:
      "Yes, dogs can eat apples — with one real precaution. What to remove first, how much is safe, and the one part of the apple that's genuinely a hazard.",
    lead:
      "Yes — apples are a safe, healthy snack for most dogs, and a genuinely good one: real fiber, vitamin C, and antioxidants for very few calories. The one rule that matters: always remove the core and seeds first. Apple seeds contain trace amounts of a cyanide-producing compound — harmless in the amount a dog would get from stealing one seed, but not something to feed on purpose.",
    faqs: [
      {
        q: 'Are apple seeds actually dangerous to dogs?',
        a: "Apple seeds contain amygdalin, which breaks down into a small amount of cyanide compound when chewed and digested. In practice, the amount in the few seeds from a slice or two is not enough to cause harm — this isn't an emergency-room scenario for a dog that snags a seed or two. It's still good practice to core an apple before giving it to your dog, both because seeds aren't meant to be eaten in quantity and because a whole core can be a choking or obstruction risk, especially in small dogs.",
      },
      {
        q: 'How much apple can I give my dog?',
        a: "Treat it like any other treat: roughly 10% or less of daily calories. A few slices is plenty for most dogs — this is a snack and enrichment item, not a meal component. Introduce it gradually the first time, like any new food, since a sudden amount of extra fiber can cause loose stool in a dog whose gut isn't used to it.",
      },
      {
        q: "What's actually good about apples for dogs?",
        a: "Real fiber (good for digestion and stool quality), vitamin C and vitamin A, and antioxidants called polyphenols — all for very few calories, which makes apple slices a genuinely better treat option than most commercial dog treats calorie-for-calorie. The skin is fine to leave on (that's where a lot of the fiber and antioxidants are) as long as it's washed.",
      },
      {
        q: 'Can dogs eat applesauce or apple juice?',
        a: "Plain, unsweetened applesauce with no added sugar, cinnamon, or other additives is fine in small amounts, though it lacks the fiber benefit of the whole fruit since it's been processed. Apple juice is mostly sugar and water with the fiber removed — not toxic, but not something worth giving regularly; plain apple slices are the better choice by a wide margin.",
      },
      {
        q: 'Are there dogs that should avoid apples?',
        a: "Diabetic dogs or dogs on a strict low-sugar/low-carb plan should get apples sparingly if at all, given the natural sugar content, and it's worth asking your vet what fits their specific management plan. Otherwise, apples are one of the safer, more universally tolerated fruits for dogs — just always minus the core and seeds.",
      },
    ],
  },
]

export const getAnswer = (slug: string) => answerPages.find((a) => a.slug === slug)
export const getAnswerSlugs = () => answerPages.map((a) => a.slug)
