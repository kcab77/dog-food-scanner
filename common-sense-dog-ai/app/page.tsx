import type { Metadata } from 'next'
import Link from 'next/link'
import HomeChat from './HomeChat'

export const metadata: Metadata = {
  title: 'Common Sense Dog — Ask the Holistic Dog Nutrition Assistant',
  description:
    'Stop searching. Just ask. One holistic dog nutrition AI assistant, built from years of research — ask it anything instead of digging through articles.',
}

const APP_URL = 'https://apps.apple.com/app/id6760376540'

export default function Home() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --green: #2A5C2E; --green-light: #3D7A42; --green-pale: #EDF4EE; --cream: #FDFAF5; --cream-dark: #F5EFE4; --text: #1A1A1A; --text-muted: #7A746B; --border: #E2D9CA; --white: #FFFFFF; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--cream); color: var(--text); }
        a { color: inherit; }

        nav { background: rgba(253,250,245,0.9); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); padding: 0 24px; height: 62px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .nav-logo { display: flex; flex-direction: column; text-decoration: none; }
        .nav-logo-text { font-size: 17px; font-weight: 800; color: var(--green); letter-spacing: -0.3px; }
        .nav-logo-sub { font-size: 11px; color: var(--text-muted); }
        .nav-links { display: flex; align-items: center; gap: 22px; }
        .nav-links a { text-decoration: none; color: var(--text-muted); font-size: 14px; font-weight: 600; }
        .nav-links a:hover { color: var(--green); }
        .nav-cta { background: var(--green); color: #fff !important; padding: 8px 16px; border-radius: 20px; font-size: 13px; }

        .top { max-width: 760px; margin: 0 auto; padding: 44px 20px 60px; text-align: center; }
        .avatar { width: 64px; height: 64px; border-radius: 50%; background: var(--green-pale); border: 2px solid #D4E6D5; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 18px; }
        h1 { font-family: Georgia, serif; font-size: clamp(34px, 6vw, 52px); font-weight: 700; color: var(--green); letter-spacing: -1px; line-height: 1.1; margin-bottom: 14px; }
        .sub { font-size: 17px; color: var(--text-muted); line-height: 1.55; max-width: 540px; margin: 0 auto 30px; }

        .trust { background: var(--cream-dark); border-top: 1px solid var(--border); padding: 28px 20px; }
        .trust-inner { max-width: 880px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .trust-item { text-align: center; font-size: 14px; color: var(--text); line-height: 1.5; }
        .trust-item span { display: block; font-size: 22px; margin-bottom: 6px; }
        .trust-item a { color: var(--green); font-weight: 700; text-decoration: none; }

        footer { background: var(--text); color: rgba(255,255,255,0.55); padding: 36px 24px; text-align: center; font-size: 13px; line-height: 1.9; }
        footer a { color: rgba(255,255,255,0.75); text-decoration: none; }
        footer .links { margin-bottom: 10px; }
        footer .disclaimer { max-width: 760px; margin: 0 auto 16px; font-size: 12px; line-height: 1.8; color: rgba(255,255,255,0.5); text-align: left; }
        footer .disclaimer strong { color: rgba(255,255,255,0.78); }

        @media (max-width: 640px) { .nav-links a:not(.nav-cta) { display: none; } .trust-inner { grid-template-columns: 1fr; gap: 14px; } }
      `}</style>

      <nav>
        <Link href="/" className="nav-logo">
          <span className="nav-logo-text">Common Sense Dog</span>
          <span className="nav-logo-sub">Holistic dog nutrition — just ask</span>
        </Link>
        <div className="nav-links">
          <Link href="/answers">Directory</Link>
          <Link href="/recommended">Picks</Link>
          <Link href="/blog">Articles</Link>
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="nav-cta">📱 Get the App</a>
        </div>
      </nav>

      <section className="top">
        <div className="avatar">🐾</div>
        <h1>Stop searching. Just ask.</h1>
        <p className="sub">One holistic dog nutrition assistant, built from years of research — ask it anything instead of digging through articles.</p>
        <HomeChat />
      </section>

      <section className="trust">
        <div className="trust-inner">
          <div className="trust-item"><span>📚</span>Backed by holistic vet sources — Dr. Judy Morgan & Dr. Karen Becker–style, research-cited.</div>
          <div className="trust-item"><span>🧠</span>Years of holistic dog-nutrition research, distilled into one assistant.</div>
          <div className="trust-item"><span>📱</span>Want to scan a label? <a href={APP_URL} target="_blank" rel="noopener noreferrer">Get the free PawGrade app →</a></div>
        </div>
      </section>

      <footer>
        <p className="links">
          <Link href="/answers">Safety directory</Link> · <Link href="/recommended">Trusted picks</Link> · <Link href="/blog">Browse articles</Link> · <Link href="/library">Health A–Z</Link> · <Link href="/scan">Ingredient checker</Link> · <a href={APP_URL} target="_blank" rel="noopener noreferrer">PawGrade app</a>
        </p>
        {/* ⚠️ LEGAL. Expanded 2026-09-08 at Kyle's request. The two clauses doing
            the real work are "does not diagnose, treat, cure or prevent" and
            "does not create a veterinarian-client-patient relationship" — the
            previous one-liner had neither. Don't trim those back out. */}
        <p className="disclaimer">
          <strong>For informational and educational purposes only.</strong> Common Sense Dog does not
          diagnose, treat, cure or prevent any disease or condition, and nothing here is veterinary
          advice or creates a veterinarian-client-patient relationship. Content reflects general and
          holistic pet-nutrition research and is provided as information, not as a treatment plan for
          your individual animal. Always consult a licensed veterinarian before changing your pet&apos;s
          diet or starting any supplement or protocol, and seek immediate veterinary care in an
          emergency.
        </p>
        <p>
          © Common Sense Dog · Educational only — not veterinary advice.
        </p>
      </footer>
    </>
  )
}
