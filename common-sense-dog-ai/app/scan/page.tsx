import type { Metadata } from 'next'
import Link from 'next/link'
import IngredientChecker from './IngredientChecker'

export const metadata: Metadata = {
  title: 'Free Dog Food Ingredient Checker — Common Sense Dog',
  description:
    'Paste any dog food ingredient list and get an instant, holistic, plain-language breakdown — red flags, good signs, and what to do. Free, no app needed.',
}

export default function ScanPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --green: #2A5C2E; --green-pale: #EDF4EE; --cream: #FDFAF5; --border: #E2D9CA; --text: #1A1A1A; --text-muted: #6B6B6B; --white: #FFFFFF; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--cream); color: var(--text); }
        nav { background: var(--white); border-bottom: 1px solid var(--border); padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .nav-logo { display: flex; flex-direction: column; text-decoration: none; }
        .nav-logo-text { font-size: 17px; font-weight: 700; color: var(--green); }
        .nav-logo-sub { font-size: 11px; color: var(--text-muted); }
        .nav-links { display: flex; gap: 24px; align-items: center; }
        .nav-links a { text-decoration: none; color: var(--text-muted); font-size: 14px; font-weight: 500; }
        .nav-links a:hover { color: var(--green); }
        .hero { text-align: center; padding: 54px 24px 14px; max-width: 720px; margin: 0 auto; }
        .hero h1 { font-size: clamp(30px, 5vw, 42px); color: var(--green); letter-spacing: -1px; margin-bottom: 12px; }
        .hero p { font-size: 18px; color: var(--text-muted); line-height: 1.55; }
        .tool { padding: 18px 24px 50px; }
        .alt { max-width: 680px; margin: 14px auto 70px; background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 24px; text-align: center; }
        .alt h3 { font-size: 18px; color: var(--text); margin-bottom: 8px; }
        .alt p { font-size: 14px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; }
        .alt-buttons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .alt-buttons a { text-decoration: none; font-weight: 700; font-size: 14px; padding: 11px 20px; border-radius: 12px; }
        .btn-primary { background: var(--green); color: #fff; }
        .btn-secondary { background: var(--green-pale); color: var(--green); }
        footer { background: var(--text); color: rgba(255,255,255,0.5); padding: 36px 24px; text-align: center; font-size: 13px; line-height: 1.8; }
        footer a { color: rgba(255,255,255,0.7); text-decoration: none; }
        @media (max-width: 600px) { .nav-links { display: none; } }
      `}</style>

      <nav>
        <Link href="/" className="nav-logo">
          <span className="nav-logo-text">Common Sense Dog</span>
          <span className="nav-logo-sub">Real dog health from a real dog owner</span>
        </Link>
        <div className="nav-links">
          <Link href="/#story">Our Story</Link>
          <Link href="/library">📖 A–Z</Link>
          <Link href="/blog">Articles</Link>
          <Link href="/chat">Ask AI</Link>
          <Link href="/scan" style={{ color: '#2A5C2E', fontWeight: 700 }}>Checker</Link>
        </div>
      </nav>

      <section className="hero">
        <h1>Free Dog Food Ingredient Checker</h1>
        <p>Copy the ingredient list off any bag or website, paste it below, and get an instant holistic breakdown — red flags, good signs, and what to do. No app needed.</p>
      </section>

      <div className="tool">
        <IngredientChecker />
      </div>

      <div className="alt">
        <h3>📷 Want to scan a barcode or label with your camera?</h3>
        <p>The full PawGrade scanner reads barcodes and ingredient photos and gives a 0–100 score for thousands of products.</p>
        <div className="alt-buttons">
          <a className="btn-primary" href="https://apps.apple.com/app/id6760376540" target="_blank" rel="noopener noreferrer">🍎 Get the free app</a>
          <a className="btn-secondary" href="https://dog-food-scanner-bice.vercel.app" target="_blank" rel="noopener noreferrer">Open the web scanner →</a>
        </div>
      </div>

      <footer>
        <p>
          <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Common Sense Dog</strong><br />
          <Link href="/">Home</Link> · <Link href="/library">A–Z</Link> · <Link href="/blog">Articles</Link> · <Link href="/chat">Ask AI</Link> · <Link href="/scan">Checker</Link><br /><br />
          Not veterinary advice. Always consult your vet for medical decisions.
        </p>
      </footer>
    </>
  )
}
