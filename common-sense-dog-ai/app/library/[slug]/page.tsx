import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTopic, getTopicSlugs } from '@/lib/library'
import { libraryTopics } from '@/lib/library-data'
import AskBox from '../AskBox'

export function generateStaticParams() {
  return getTopicSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const topic = getTopic(params.slug)
  if (!topic) return {}
  return { title: `${topic.title} — Common Sense Dog`, description: topic.summary }
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopic(params.slug)
  if (!topic) notFound()

  /**
   * Related topics, matched by shared tag.
   *
   * This used to be `libraryTopics.filter(not-me).slice(0, 3)` — which returned
   * the same first three topics on every single page in the library, regardless
   * of subject. A yeast article recommended AAFCO profiles. That's not a related
   * link, it's a dead end with a thumbnail.
   *
   * Now: same tag first, then fill from the rest so the block is never short.
   * Interlinking is what turns 40 separate pages into something a reader browses
   * instead of bouncing from, and it's how search engines understand that the
   * pages belong to one another.
   */
  const sameTag = libraryTopics.filter(
    (t) => t.slug !== topic.slug && t.tag === topic.tag,
  )
  const filler = libraryTopics.filter(
    (t) => t.slug !== topic.slug && t.tag !== topic.tag,
  )
  const others = [...sameTag, ...filler].slice(0, 3)
  const hasSameTag = sameTag.length > 0

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title,
    description: topic.summary,
    author: { '@type': 'Organization', name: 'Common Sense Dog' },
    publisher: { '@type': 'Organization', name: 'Common Sense Dog' },
    mainEntityOfPage: `https://commonsensedog.com/library/${topic.slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --green: #2A5C2E; --green-pale: #EDF4EE; --cream: #FDFAF5; --cream-dark: #F5EFE4; --text: #1A1A1A; --text-muted: #6B6B6B; --border: #E2D9CA; --white: #FFFFFF; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--cream); }
        nav { background: var(--white); border-bottom: 1px solid var(--border); padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-text { font-size: 17px; font-weight: 700; color: var(--green); }
        .nav-logo-sub { font-size: 11px; color: var(--text-muted); }
        .nav-links { display: flex; align-items: center; gap: 24px; }
        .nav-links a { text-decoration: none; color: var(--text-muted); font-size: 14px; font-weight: 500; }
        .nav-links a:hover { color: var(--green); }
        .hero { background: linear-gradient(135deg, #2A5C2E, #1E4422); padding: 52px 24px; text-align: center; }
        .hero-emoji { font-size: 52px; margin-bottom: 16px; display: block; }
        .hero-tag { display: inline-block; background: rgba(255,255,255,0.15); color: #A8D5AB; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; }
        .hero h1 { font-family: Georgia, serif; font-size: clamp(24px, 4vw, 42px); color: white; line-height: 1.2; max-width: 800px; margin: 0 auto 14px; }
        .hero p { font-size: 16px; color: rgba(255,255,255,0.72); max-width: 620px; margin: 0 auto; line-height: 1.6; }
        .article-wrap { max-width: 740px; margin: 0 auto; padding: 50px 24px 70px; }
        .back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--green); font-size: 14px; font-weight: 600; text-decoration: none; margin-bottom: 30px; }
        .back-link:hover { text-decoration: underline; }
        .article-content { font-size: 16px; color: #333; line-height: 1.85; }
        .article-content h1, .article-content h2 { font-family: Georgia, serif; font-size: 25px; font-weight: 700; color: var(--text); margin: 38px 0 14px; line-height: 1.25; }
        .article-content h3 { font-size: 19px; font-weight: 700; color: var(--text); margin: 26px 0 10px; }
        .article-content p { margin-bottom: 16px; }
        .article-content ul, .article-content ol { margin: 0 0 16px 22px; }
        .article-content li { margin-bottom: 7px; line-height: 1.7; }
        .article-content strong { color: var(--text); }
        .article-content a { color: var(--green); text-decoration: underline; }
        .article-content hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
        .article-content blockquote { border-left: 3px solid #C8DFC9; margin: 0 0 16px; padding: 4px 0 4px 16px; color: var(--text-muted); }
        .article-content code { background: var(--cream-dark); padding: 2px 6px; border-radius: 5px; font-size: 14px; }
        .article-content table { width: 100%; border-collapse: collapse; margin: 0 0 18px; font-size: 14px; }
        .article-content th, .article-content td { border: 1px solid var(--border); padding: 8px 10px; text-align: left; }
        .article-content th { background: var(--green-pale); }
        .source { font-size: 12px; color: var(--text-muted); margin-top: 28px; font-style: italic; }
        .related { border-top: 1px solid var(--border); padding-top: 40px; margin-top: 16px; }
        .related h2 { font-family: Georgia, serif; font-size: 22px; margin-bottom: 18px; }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
        .related-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 16px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .related-card:hover { border-color: #C8DFC9; transform: translateY(-2px); }
        .related-card .emoji { font-size: 26px; margin-bottom: 8px; display: block; }
        .related-card h3 { font-size: 14px; font-weight: 700; line-height: 1.4; color: var(--text); }
        .related-card .related-summary { font-size: 12.5px; line-height: 1.5; color: var(--muted, #6b7280); margin-top: 6px; }
        footer { background: var(--text); color: rgba(255,255,255,0.5); padding: 36px 24px; text-align: center; font-size: 13px; line-height: 1.8; }
        footer a { color: rgba(255,255,255,0.7); text-decoration: none; }
        @media (max-width: 600px) { .nav-links { display: none; } }
      `}</style>

      <nav>
        <Link href="/" className="nav-logo">
          <span style={{ fontSize: 22 }}>🐾</span>
          <div>
            <div className="nav-logo-text">Common Sense Dog</div>
            <div className="nav-logo-sub">Real dog health from a real dog owner</div>
          </div>
        </Link>
        <div className="nav-links">
          <Link href="/#story">Our Story</Link>
          <Link href="/library" style={{ color: '#2A5C2E', fontWeight: 700 }}>A–Z</Link>
          <Link href="/blog">Articles</Link>
          <Link href="/chat">Ask AI</Link>
          <Link href="/scan">Scanner</Link>
        </div>
      </nav>

      <section className="hero">
        <span className="hero-emoji">{topic.emoji}</span>
        <div className="hero-tag">{topic.tag}</div>
        <h1>{topic.title}</h1>
        <p>{topic.summary}</p>
      </section>

      <div className="article-wrap">
        <Link href="/library" className="back-link">← All topics (A–Z)</Link>

        <div className="article-content" dangerouslySetInnerHTML={{ __html: topic.contentHtml }} />

        <p className="source">Sourced from Kyle's notes. Educational only — not veterinary advice.</p>

        <AskBox topic={topic.title} />

        {others.length > 0 && (
          <div className="related">
            <h2>{hasSameTag ? `More on ${topic.tag.toLowerCase()}` : 'More topics'}</h2>
            <div className="related-grid">
              {others.map((t) => (
                <Link key={t.slug} href={`/library/${t.slug}`} className="related-card">
                  <span className="emoji">{t.emoji}</span>
                  <h3>{t.title}</h3>
                  <p className="related-summary">{t.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer>
        <p>
          <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Common Sense Dog</strong><br />
          <Link href="/">Home</Link> · <Link href="/library">A–Z</Link> · <Link href="/blog">Articles</Link> · <Link href="/chat">Ask AI</Link> · <Link href="/scan">Scanner</Link><br /><br />
          Not veterinary advice. Always consult your vet for medical decisions.
        </p>
      </footer>
    </>
  )
}
