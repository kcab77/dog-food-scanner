import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts, getPostBySlug } from '@/lib/blog-data'

export function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — Common Sense Dog`,
    description: post.description,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const otherPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: /^\d{4}$/.test(post.date) ? `${post.date}-01-01` : post.date,
    author: { '@type': 'Organization', name: 'Common Sense Dog' },
    publisher: { '@type': 'Organization', name: 'Common Sense Dog' },
    mainEntityOfPage: `https://commonsensedog.com/blog/${post.slug}`,
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
        .hero { background: linear-gradient(135deg, #2A5C2E, #1E4422); padding: 56px 24px; text-align: center; }
        .hero-tag { display: inline-block; background: rgba(255,255,255,0.15); color: #A8D5AB; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 20px; margin-bottom: 18px; }
        .hero h1 { font-family: Georgia, serif; font-size: clamp(24px, 4vw, 44px); color: white; line-height: 1.2; max-width: 800px; margin: 0 auto 16px; }
        .hero p { font-size: 16px; color: rgba(255,255,255,0.7); max-width: 620px; margin: 0 auto; line-height: 1.6; }
        .hero-emoji { font-size: 52px; margin-bottom: 20px; display: block; }
        .article-wrap { max-width: 740px; margin: 0 auto; padding: 60px 24px; }
        .article-content { font-size: 16px; color: #333; line-height: 1.85; }
        .article-content h2 { font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: var(--text); margin: 40px 0 16px; line-height: 1.25; }
        .article-content h3 { font-size: 19px; font-weight: 700; color: var(--text); margin: 28px 0 10px; }
        .article-content p { margin-bottom: 18px; }
        .article-content ul, .article-content ol { margin: 0 0 18px 22px; }
        .article-content li { margin-bottom: 8px; line-height: 1.7; }
        .article-content strong { color: var(--text); }
        .article-content a { color: var(--green); text-decoration: underline; }
        .article-content a:hover { color: #3D7A42; }
        .article-content hr { border: none; border-top: 1px solid var(--border); margin: 36px 0; }
        .article-content em { color: var(--text-muted); font-style: italic; }
        .article-content em strong { color: var(--text); }
        .back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--green); font-size: 14px; font-weight: 600; text-decoration: none; margin-bottom: 36px; }
        .back-link:hover { text-decoration: underline; }
        .app-cta { background: linear-gradient(135deg, #1A2E1B, #2A5C2E); border-radius: 20px; padding: 36px; text-align: center; margin: 48px 0; }
        .app-cta h3 { font-family: Georgia, serif; font-size: 24px; color: white; margin-bottom: 10px; }
        .app-cta p { font-size: 15px; color: rgba(255,255,255,0.7); margin-bottom: 24px; line-height: 1.6; }
        .app-cta a { display: inline-flex; align-items: center; gap: 10px; background: white; color: var(--text); padding: 12px 24px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 15px; }
        .related { border-top: 1px solid var(--border); padding-top: 48px; margin-top: 48px; }
        .related h2 { font-family: Georgia, serif; font-size: 24px; margin-bottom: 24px; }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .related-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 18px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .related-card:hover { border-color: #C8DFC9; transform: translateY(-2px); }
        .related-card .emoji { font-size: 28px; margin-bottom: 10px; display: block; }
        .related-card .rtag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--green); margin-bottom: 6px; }
        .related-card h3 { font-size: 14px; font-weight: 700; line-height: 1.4; color: var(--text); }
        footer { background: var(--text); color: rgba(255,255,255,0.5); padding: 40px 24px; text-align: center; font-size: 13px; line-height: 1.8; }
        footer a { color: rgba(255,255,255,0.7); text-decoration: none; }
        @media (max-width: 600px) { .nav-links { display: none; } }
      `}</style>

      <nav>
        <Link href="/" className="nav-logo">
          <span style={{fontSize:22}}>🐾</span>
          <div>
            <div className="nav-logo-text">Common Sense Dog</div>
            <div className="nav-logo-sub">Real dog health from a real dog owner</div>
          </div>
        </Link>
        <div className="nav-links">
          <Link href="/#story">Our Story</Link>
          <Link href="/library">📖 A–Z</Link>
          <Link href="/blog" style={{color:'#2A5C2E', fontWeight:700}}>Articles</Link>
          <Link href="/chat">Ask AI</Link>
          <Link href="/scan">Scanner</Link>
        </div>
      </nav>

      <section className="hero">
        <span className="hero-emoji">{post.emoji}</span>
        <div className="hero-tag">{post.tag}</div>
        <h1>{post.title}</h1>
        <p>{post.description}</p>
      </section>

      <div className="article-wrap">
        <Link href="/blog" className="back-link">← All Articles</Link>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="app-cta">
          <h3>🐾 Try PawGrade</h3>
          <p>Scan any dog food barcode and get an instant AI-powered breakdown of every ingredient. Free on the App Store.</p>
          <a href="https://apps.apple.com/app/id6760376540" target="_blank" rel="noopener noreferrer">
            <span>🍎</span> Download Free on App Store
          </a>
        </div>

        {otherPosts.length > 0 && (
          <div className="related">
            <h2>More Articles</h2>
            <div className="related-grid">
              {otherPosts.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="related-card">
                  <span className="emoji">{p.emoji}</span>
                  <div className="rtag">{p.tag}</div>
                  <h3>{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer>
        <p>
          <strong style={{color:'rgba(255,255,255,0.8)'}}>Common Sense Dog</strong><br/>
          <Link href="/">Home</Link> · <Link href="/blog">Articles</Link> · <Link href="/chat">Ask AI</Link> · <Link href="/scan">Scanner</Link><br/><br/>
          Not veterinary advice. Always consult your vet for medical decisions.
        </p>
      </footer>
    </>
  )
}
