import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Articles — Common Sense Dog',
  description: 'Research-backed articles on dog nutrition, supplements, and holistic health.',
}

export default function BlogPage() {
  return (
    <>
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
        .hero { background: linear-gradient(135deg, #2A5C2E, #1E4422); padding: 60px 24px; text-align: center; }
        .hero h1 { font-family: Georgia, serif; font-size: clamp(28px, 5vw, 48px); color: white; margin-bottom: 14px; }
        .hero p { font-size: 17px; color: rgba(255,255,255,0.7); max-width: 560px; margin: 0 auto; }
        .content { max-width: 1100px; margin: 0 auto; padding: 60px 24px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .card { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; text-decoration: none; color: inherit; transition: all 0.2s; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); border-color: #C8DFC9; }
        .card-image { background: var(--green-pale); height: 140px; display: flex; align-items: center; justify-content: center; font-size: 52px; }
        .card-body { padding: 22px; flex: 1; display: flex; flex-direction: column; }
        .tag { display: inline-block; background: var(--green-pale); color: var(--green); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 20px; margin-bottom: 12px; }
        .card h2 { font-size: 17px; font-weight: 700; line-height: 1.35; margin-bottom: 10px; color: var(--text); }
        .card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; flex: 1; }
        .card-footer { padding: 14px 22px; border-top: 1px solid var(--border); }
        .read-more { font-size: 13px; font-weight: 600; color: var(--green); }
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
          <Link href="/blog" style={{color:'#2A5C2E', fontWeight:700}}>Articles</Link>
          <Link href="/chat">Ask AI</Link>
          <Link href="/scan">Scanner</Link>
        </div>
      </nav>

      <section className="hero">
        <h1>Articles & Research</h1>
        <p>Everything I&apos;ve learned over 7 years studying holistic dog health — backed by real studies, not just opinions.</p>
      </section>

      <div className="content">
        <div className="grid">
          {blogPosts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card">
              <div className="card-image">{post.emoji}</div>
              <div className="card-body">
                <span className="tag">{post.tag}</span>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
              </div>
              <div className="card-footer">
                <span className="read-more">Read article →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer>
        <p>
          <strong style={{color:'rgba(255,255,255,0.8)'}}>Common Sense Dog</strong><br/>
          <Link href="/">Home</Link> · <Link href="/blog">Articles</Link> · <Link href="/chat">Ask AI</Link> · <Link href="/scan">Scanner</Link> · <Link href="/#pawgrade">PawGrade App</Link><br/><br/>
          Not veterinary advice. Always consult your vet for medical decisions.
        </p>
      </footer>
    </>
  )
}
