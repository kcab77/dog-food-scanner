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
]

export const getAnswer = (slug: string) => answerPages.find((a) => a.slug === slug)
export const getAnswerSlugs = () => answerPages.map((a) => a.slug)
