import type { Metadata } from 'next'
import Link from 'next/link'
import { getAnswersByCategory, answerPages } from '@/lib/answers-data'

const BASE = 'https://commonsensedog.com'

export const metadata: Metadata = {
  title: 'Dog Safety & Health Directory — Common Sense Dog',
  description:
    "Look up any food, ingredient, household product, or health question — is it safe for your dog? A browsable, honest directory covering food, home products, supplements, conditions, and parasites.",
  alternates: { canonical: `${BASE}/answers` },
}

const APP_URL = 'https://apps.apple.com/app/id6760376540'

export default function AnswersDirectory() {
  const categories = getAnswersByCategory()
  const total = answerPages.length

  // CollectionPage structured data so Google understands this as a directory hub.
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Dog Safety & Health Directory',
    url: `${BASE}/answers`,
    description:
      'A browsable directory of dog-safety and health answers — food, household products, supplements, conditions, and parasites.',
    hasPart: answerPages.map((p) => ({
      '@type': 'WebPage',
      name: p.title,
      url: `${BASE}/answers/${p.slug}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
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

        .hero { max-width: 760px; margin: 0 auto; padding: 46px 20px 22px; text-align: center; }
        .hero h1 { font-family: Georgia, serif; font-size: clamp(30px, 5.5vw, 46px); font-weight: 700; color: var(--green); letter-spacing: -1px; line-height: 1.12; margin-bottom: 14px; text-wrap: balance; }
        .hero p { font-size: 17px; color: var(--text-muted); line-height: 1.55; max-width: 560px; margin: 0 auto; }
        .hero .count { display: inline-block; margin-top: 16px; font-size: 13px; font-weight: 700; color: var(--green); background: var(--green-pale); border: 1px solid #D4E6D5; padding: 5px 14px; border-radius: 20px; }

        /* Quick jump chips to each category */
        .jump { max-width: 900px; margin: 0 auto; padding: 8px 20px 4px; display: flex; flex-wrap: wrap; gap: 9px; justify-content: center; }
        .jump a { text-decoration: none; font-size: 13.5px; font-weight: 700; color: var(--green); background: var(--white); border: 1px solid var(--border); padding: 8px 15px; border-radius: 20px; }
        .jump a:hover { background: var(--green); color: #fff; border-color: var(--green); }

        .wrap { max-width: 900px; margin: 0 auto; padding: 20px 20px 70px; }
        .cat { margin-top: 40px; scroll-margin-top: 74px; }
        .cat-head { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 2px solid var(--green); margin-bottom: 20px; }
        .cat-emoji { font-size: 30px; }
        .cat-titles h2 { font-family: Georgia, serif; font-size: 23px; color: var(--green); line-height: 1.1; }
        .cat-titles p { font-size: 13.5px; color: var(--text-muted); margin-top: 3px; }
        .cat-count { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--text-muted); white-space: nowrap; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; }
        .card { display: flex; align-items: center; gap: 12px; background: var(--white); border: 1px solid var(--border); border-radius: 13px; padding: 14px 15px; text-decoration: none; transition: border-color .12s, transform .12s, box-shadow .12s; }
        .card:hover { border-color: var(--green); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(42,92,46,0.08); }
        .card .c-emoji { font-size: 22px; flex: none; }
        .card .c-title { font-size: 14.5px; font-weight: 600; line-height: 1.3; color: var(--text); }

        .ask { margin-top: 48px; background: linear-gradient(135deg, #2A5C2E, #1E4422); border-radius: 20px; padding: 34px 26px; text-align: center; }
        .ask h2 { font-family: Georgia, serif; color: #fff; font-size: 24px; margin-bottom: 10px; }
        .ask p { color: rgba(255,255,255,0.78); font-size: 15px; line-height: 1.6; max-width: 460px; margin: 0 auto 20px; }
        .ask-row { display: flex; gap: 11px; justify-content: center; flex-wrap: wrap; }
        .btn { display: inline-block; text-decoration: none; font-weight: 700; font-size: 15px; border-radius: 11px; padding: 13px 24px; }
        .btn-primary { background: #fff; color: var(--green); }
        .btn-ghost { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.3); }

        footer { background: var(--text); color: rgba(255,255,255,0.55); padding: 34px 24px; text-align: center; font-size: 13px; line-height: 1.9; margin-top: 10px; }
        footer a { color: rgba(255,255,255,0.75); text-decoration: none; }
        footer .links { margin-bottom: 10px; }

        @media (max-width: 640px) { .nav-links a:not(.nav-cta) { display: none; } }
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

      <section className="hero">
        <h1>Is it safe for my dog?</h1>
        <p>
          One honest place to look it up — food, household products, supplements, conditions, and
          parasites. Browse below, or just ask the assistant your exact question.
        </p>
        <span className="count">{total} answers and growing</span>
      </section>

      <div className="jump">
        {categories.map((c) => (
          <a key={c.key} href={`#${c.key}`}>
            {c.emoji} {c.label}
          </a>
        ))}
      </div>

      <div className="wrap">
        {categories.map((c) => (
          <section className="cat" id={c.key} key={c.key}>
            <div className="cat-head">
              <span className="cat-emoji">{c.emoji}</span>
              <div className="cat-titles">
                <h2>{c.label}</h2>
                <p>{c.blurb}</p>
              </div>
              <span className="cat-count">{c.pages.length} {c.pages.length === 1 ? 'topic' : 'topics'}</span>
            </div>
            <div className="grid">
              {c.pages.map((p) => (
                <Link key={p.slug} href={`/answers/${p.slug}`} className="card">
                  <span className="c-emoji">{p.emoji}</span>
                  <span className="c-title">{p.title}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="ask">
          <h2>Can&apos;t find it? Just ask.</h2>
          <p>
            The AI assistant answers any dog question for your dog&apos;s exact situation — or scan a
            food label in seconds with the free app.
          </p>
          <div className="ask-row">
            <Link href="/chat" className="btn btn-primary">Ask the assistant →</Link>
            <Link href="/scan" className="btn btn-ghost">Scan a dog food</Link>
          </div>
        </section>
      </div>

      <footer>
        <p className="links">
          <Link href="/answers">Directory</Link> · <Link href="/recommended">Trusted picks</Link> · <Link href="/library">Health A–Z</Link> · <Link href="/blog">Articles</Link> · <Link href="/scan">Ingredient checker</Link>
        </p>
        <p>© Common Sense Dog · Educational only — not veterinary advice. Always consult your vet for medical decisions.</p>
      </footer>
    </>
  )
}
