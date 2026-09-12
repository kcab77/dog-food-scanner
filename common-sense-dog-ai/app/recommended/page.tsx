import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Trusted Holistic Picks for Dogs — Common Sense Dog',
  description:
    'Vet-informed, holistic-first supplement and whole-food picks for dogs — probiotics, omega-3s, green lipped mussel, organ treats, and liver/detox support. Honestly chosen to match a whole-food philosophy.',
}

const PICKS = [
  {
    emoji: '🦠', name: 'Probiotics',
    body: 'Multi-strain probiotics support gut microbiome diversity, immune function, and stool quality. Look for at least 1 billion CFU with Lactobacillus and Bifidobacterium strains. Most beneficial for dogs on kibble, after antibiotics, or with chronic digestive issues.',
    note: 'Pair with fish oil for a synergistic gut + inflammation benefit',
    link: 'https://amzn.to/4dPRAWP',
  },
  {
    emoji: '🐟', name: 'Fish Oil (Omega-3)',
    body: 'Wild-caught sardine or anchovy oil reduces inflammation and supports coat, joints, and brain function. Look for the triglyceride form — not ethyl ester — and store in the fridge after opening to prevent rancidity.',
    note: 'Target: ~20mg EPA+DHA per pound of body weight daily',
    link: 'https://amzn.to/4efzKxO',
  },
  {
    emoji: '🌊', name: 'Green Lipped Mussel',
    body: 'New Zealand green lipped mussel contains unique omega-3s (ETA) not found in fish oil, plus natural glucosamine and chondroitin. One of the most evidence-backed natural anti-inflammatories for joints — ideal for active, senior, or large-breed dogs.',
    note: 'Works synergistically with fish oil for broader omega-3 coverage',
    link: 'https://amzn.to/4vpJKdX',
  },
  {
    emoji: '❤️', name: 'Heart Treats',
    body: 'Beef or chicken heart is the #1 dietary source of CoQ10 and naturally rich in taurine — critical for cardiac function. Unlike liver, heart is a muscle meat so the organ cap is less strict, but keep all treats under 10% of total diet.',
    note: 'Especially important for breeds with taurine-deficiency concerns',
    link: 'https://amzn.to/4vkvZgs',
  },
  {
    emoji: '🫀', name: 'Liver Treats',
    body: 'Beef or chicken liver is packed with Vitamin A, B12, iron, and CoQ10 — one of the most nutrient-dense treats you can give. Because excess Vitamin A accumulates, keep liver treats to no more than ~5% of the total daily diet (treats included).',
    note: '5% rule: a 50lb dog eating 2 cups/day → max 1–2 small liver treats',
    link: 'https://amzn.to/4wWcj44',
  },
  {
    emoji: '🌿', name: 'Detox & Liver Support',
    body: 'Dogs are exposed to pesticides, lawn chemicals, and environmental toxins year-round. The liver filters all of it. Milk thistle (silymarin) is one of the most well-studied natural liver protectants in dogs, helping it detox and regenerate. Pairs well with turkey tail mushroom for immune support.',
    note: 'Especially valuable after flea treatments, vaccines, or heavy outdoor exposure',
    link: 'https://amzn.to/4dZ2ZDT',
  },
  {
    emoji: '🍃', name: 'Four Leaf Rover',
    body: 'Four Leaf Rover makes research-backed supplements formulated specifically for dogs — including liver support, toxin binders, probiotics, and more. One of the most trusted brands in holistic dog health.',
    note: 'Browse their full line — each product targets a specific need',
    link: 'https://amzn.to/43FJ5sK',
  },
]

const APP_URL = 'https://apps.apple.com/app/id6760376540'

export default function RecommendedPage() {
  return (
    <>
      <style>{`
        .wrap { max-width: 1000px; margin: 0 auto; padding: 44px 20px 60px; }
        .sub { font-size: 17px; color: var(--text-muted); line-height: 1.6; max-width: 620px; margin: 0 auto 22px; text-align: center; }
        .disclosure { background: var(--cream-dark); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; font-size: 13px; color: var(--text-muted); line-height: 1.5; max-width: 720px; margin: 0 auto 36px; text-align: center; }
        .card .note { font-size: 13px; color: var(--green); background: var(--green-pale); border-radius: 10px; padding: 9px 12px; margin-bottom: 16px; line-height: 1.45; }
        .btn:hover { background: var(--leaf-deep); }
        footer a { color: rgba(255,255,255,0.75); text-decoration: none; }
      `}</style>

      <div className="wrap">
        <h1>Trusted Holistic Picks</h1>
        <p className="sub">A short, honest list of the supplements and whole-food treats we actually recommend — chosen to match a whole-food, anti-inflammatory philosophy, not to fill a catalog.</p>
        <p className="disclosure">
          As an Amazon Associate, Common Sense Dog earns from qualifying purchases. This never affects our recommendations or your price — we only list products we'd genuinely feed our own dogs. Educational only, not veterinary advice.
        </p>

        <div className="grid">
          {PICKS.map((p) => (
            <div className="card" key={p.name}>
              <div className="card-emoji">{p.emoji}</div>
              <h3>{p.name}</h3>
              <p>{p.body}</p>
              <div className="note">💡 {p.note}</div>
              <a className="btn" href={p.link} target="_blank" rel="nofollow sponsored noopener noreferrer">
                🛒 View on Amazon →
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
