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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --green: #2A5C2E; --green-pale: #EDF4EE; --cream: #FDFAF5; --cream-dark: #F5EFE4; --text: #1A1A1A; --text-muted: #6B6B6B; --border: #E2D9CA; --white: #FFFFFF; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--cream); color: var(--text); }
        a { color: inherit; }
        nav { background: rgba(253,250,245,0.9); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); padding: 0 24px; height: 62px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .nav-logo-text { font-size: 17px; font-weight: 800; color: var(--green); letter-spacing: -0.3px; text-decoration: none; }
        .nav-links { display: flex; align-items: center; gap: 20px; }
        .nav-links a { text-decoration: none; color: var(--text-muted); font-size: 14px; font-weight: 600; }
        .wrap { max-width: 1000px; margin: 0 auto; padding: 44px 20px 60px; }
        h1 { font-family: Georgia, serif; font-size: clamp(30px, 5vw, 44px); font-weight: 700; color: var(--green); letter-spacing: -1px; margin-bottom: 12px; text-align: center; }
        .sub { font-size: 17px; color: var(--text-muted); line-height: 1.6; max-width: 620px; margin: 0 auto 22px; text-align: center; }
        .disclosure { background: var(--cream-dark); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; font-size: 13px; color: var(--text-muted); line-height: 1.5; max-width: 720px; margin: 0 auto 36px; text-align: center; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .card { background: var(--white); border: 1px solid var(--border); border-radius: 18px; padding: 24px; display: flex; flex-direction: column; }
        .card-emoji { font-size: 34px; margin-bottom: 10px; }
        .card h3 { font-size: 19px; font-weight: 800; color: var(--text); margin-bottom: 10px; }
        .card p { font-size: 14.5px; color: #444; line-height: 1.6; margin-bottom: 12px; flex: 1; }
        .card .note { font-size: 13px; color: var(--green); background: var(--green-pale); border-radius: 10px; padding: 9px 12px; margin-bottom: 16px; line-height: 1.45; }
        .btn { display: inline-block; text-align: center; background: var(--green); color: #fff; font-weight: 700; font-size: 15px; padding: 12px 18px; border-radius: 24px; text-decoration: none; }
        .btn:hover { background: #21471f; }
        footer { background: var(--text); color: rgba(255,255,255,0.55); padding: 34px 24px; text-align: center; font-size: 13px; line-height: 1.9; margin-top: 20px; }
        footer a { color: rgba(255,255,255,0.75); text-decoration: none; }
      `}</style>

      <nav>
        <Link href="/" className="nav-logo-text">Common Sense Dog</Link>
        <div className="nav-links">
          <Link href="/#ask">Ask</Link>
          <Link href="/scan">Checker</Link>
          <Link href="/library">Library</Link>
        </div>
      </nav>

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

      <footer>
        <p>
          <Link href="/">Home</Link> · <Link href="/scan">Ingredient checker</Link> · <Link href="/library">Health A–Z</Link> · <a href={APP_URL} target="_blank" rel="noopener noreferrer">PawGrade app</a>
        </p>
        <p>© Common Sense Dog · Educational only — not veterinary advice. As an Amazon Associate we earn from qualifying purchases.</p>
      </footer>
    </>
  )
}
