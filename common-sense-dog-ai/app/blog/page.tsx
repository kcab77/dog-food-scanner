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
        .nav-links a:hover { color: var(--green); }
        .hero { background: linear-gradient(135deg, var(--leaf), var(--leaf-deep)); padding: 60px 24px; text-align: center; }
        .hero h1 { font-family: Georgia, serif; font-size: clamp(28px, 5vw, 48px); color: white; margin-bottom: 14px; }
        .hero p { font-size: 17px; color: rgba(255,255,255,0.7); max-width: 560px; margin: 0 auto; }
        .content { max-width: 1100px; margin: 0 auto; padding: 60px 24px; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); border-color: var(--leaf-wash); }
        .tag { display: inline-block; background: var(--green-pale); color: var(--green); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 20px; margin-bottom: 12px; }
        .read-more { font-size: 13px; font-weight: 600; color: var(--green); }
        footer a { color: rgba(255,255,255,0.7); text-decoration: none; }
        @media (max-width: 600px) { .nav-links { display: none; } }
      `}</style>

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
    </>
  )
}
