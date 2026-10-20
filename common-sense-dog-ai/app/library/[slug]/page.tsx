import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTopic, getTopicSlugs } from '@/lib/library'
import { libraryTopics } from '@/lib/library-data'
import AskBox from '../AskBox'
import LearnMore from './LearnMore'

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
        .nav-links a:hover { color: var(--green); }
        .hero { background: linear-gradient(135deg, var(--leaf), var(--leaf-deep)); padding: 52px 24px; text-align: center; }
        .hero-emoji { font-size: 52px; margin-bottom: 16px; display: block; }
        .hero-tag { display: inline-block; background: rgba(255,255,255,0.15); color: var(--leaf-wash); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 20px; margin-bottom: 16px; }
        .hero h1 { font-family: Georgia, serif; font-size: clamp(24px, 4vw, 42px); color: white; line-height: 1.2; max-width: 800px; margin: 0 auto 14px; }
        .hero p { font-size: 16px; color: rgba(255,255,255,0.72); max-width: 620px; margin: 0 auto; line-height: 1.6; }
        .article-wrap { max-width: 740px; margin: 0 auto; padding: 50px 24px 70px; }
        .back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--green); font-size: 14px; font-weight: 600; text-decoration: none; margin-bottom: 30px; }
        .back-link:hover { text-decoration: underline; }
        .article-content { font-size: 16px; color: var(--text); line-height: 1.85; }
        .article-content h1, .article-content h2 { font-family: Georgia, serif; font-size: 25px; font-weight: 700; color: var(--text); margin: 38px 0 14px; line-height: 1.25; }
        .article-content h3 { font-size: 19px; font-weight: 700; color: var(--text); margin: 26px 0 10px; }
        .article-content p { margin-bottom: 16px; }
        .article-content ul, .article-content ol { margin: 0 0 16px 22px; }
        .article-content li { margin-bottom: 7px; line-height: 1.7; }
        .article-content strong { color: var(--text); }
        .article-content a { color: var(--green); text-decoration: underline; }
        .article-content hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
        .article-content blockquote { border-left: 3px solid var(--leaf-wash); margin: 0 0 16px; padding: 4px 0 4px 16px; color: var(--text-muted); }
        .article-content code { background: var(--cream-dark); padding: 2px 6px; border-radius: 5px; font-size: 14px; }
        .article-content table { width: 100%; border-collapse: collapse; margin: 0 0 18px; font-size: 14px; }
        .article-content th, .article-content td { border: 1px solid var(--border); padding: 8px 10px; text-align: left; }
        .article-content th { background: var(--green-pale); }
        .source { font-size: 12px; color: var(--text-muted); margin-top: 28px; font-style: italic; }
        .related { border-top: 1px solid var(--border); padding-top: 40px; margin-top: 16px; }
        .related h2 { font-family: Georgia, serif; font-size: 22px; margin-bottom: 18px; }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
        .related-card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 16px; text-decoration: none; color: inherit; transition: all 0.2s; }
        .related-card:hover { border-color: var(--leaf-wash); transform: translateY(-2px); }
        .related-card .emoji { font-size: 26px; margin-bottom: 8px; display: block; }
        .related-card h3 { font-size: 14px; font-weight: 700; line-height: 1.4; color: var(--text); }
        .related-card .related-summary { font-size: 12.5px; line-height: 1.5; color: var(--muted, var(--text-muted)); margin-top: 6px; }
        footer a { color: rgba(255,255,255,0.7); text-decoration: none; }

        /* ── Picks + pathway ──────────────────────────────────────────────
           Deliberately the most saturated thing on the page. Everything above
           is a reference article in near-black on near-white; these two blocks
           are where the reader is meant to DO something, so they get the fill,
           the shadow and the one amber button. If the whole page looked like
           this, none of it would stand out. */
        .picks, .pathway { margin-top: 44px; }
        .picks-head { margin-bottom: 18px; }
        .picks-kicker {
          display: inline-block; background: var(--amber-wash); color: var(--amber);
          font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px;
          padding: 5px 12px; border-radius: var(--radius-pill); margin-bottom: 10px;
        }
        .picks-head h2 { font-family: var(--display); font-size: 24px; line-height: 1.2; margin: 0; color: var(--text); }
        .picks-sub { font-size: 14px; color: var(--text-muted); margin: 7px 0 0; line-height: 1.6; }

        .pick-grid { display: grid; gap: 14px; }
        .pick {
          display: flex; gap: 15px; align-items: flex-start;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 18px;
          box-shadow: var(--shadow-sm); transition: box-shadow .2s, transform .2s, border-color .2s;
        }
        .pick:hover { box-shadow: var(--shadow); transform: translateY(-2px); border-color: var(--leaf-bright); }
        .pick-bubble {
          flex: none; width: 50px; height: 50px; border-radius: 50%;
          background: var(--leaf-wash); display: grid; place-items: center;
          font-size: 25px; line-height: 1;
        }
        .pick-body { min-width: 0; }
        .pick-body h3 { font-size: 16.5px; font-weight: 800; color: var(--text); margin: 2px 0 5px; }
        .pick-blurb { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin: 0; }
        .pick-how {
          font-size: 13px; color: var(--text); line-height: 1.6; margin: 9px 0 0;
          background: var(--leaf-tint); border-left: 3px solid var(--leaf-bright);
          padding: 8px 11px; border-radius: 0 8px 8px 0;
        }
        .pick-how strong { font-weight: 800; }
        .pick-cta {
          display: inline-flex; align-items: center; gap: 7px; margin-top: 13px;
          background: var(--amber); color: #fff; font-size: 14px; font-weight: 800;
          padding: 10px 18px; border-radius: var(--radius-pill); text-decoration: none;
          transition: filter .15s, transform .15s;
        }
        .pick-cta:hover { filter: brightness(1.07); transform: translateX(2px); }
        .disclose { font-size: 12px; color: var(--text-faint); line-height: 1.6; margin: 14px 0 0; }

        .path-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
        .path-item {
          display: flex; align-items: center; gap: 14px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 14px 16px;
          text-decoration: none; color: inherit;
          transition: border-color .2s, transform .2s, box-shadow .2s;
        }
        .path-item:hover { border-color: var(--leaf-bright); transform: translateX(3px); box-shadow: var(--shadow-sm); }
        .path-num {
          flex: none; width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, var(--leaf-bright), var(--leaf));
          color: #fff; font-size: 14px; font-weight: 800;
          display: grid; place-items: center;
        }
        .path-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
        .path-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: var(--text); }
        .path-emoji { font-size: 17px; }
        .path-summary { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
        .path-arrow { flex: none; color: var(--leaf); font-weight: 800; }
        .path-all {
          display: inline-flex; align-items: center; gap: 7px; margin-top: 16px;
          font-size: 14px; font-weight: 700; color: var(--leaf);
          text-decoration: none; border-bottom: 2px solid var(--leaf-wash); padding-bottom: 2px;
        }
        .path-all:hover { border-bottom-color: var(--leaf); }

        @media (min-width: 620px) { .pick-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .nav-links { display: none; } }
      `}</style>

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

        <LearnMore
          topic={topic}
          path={others}
          pathLabel={hasSameTag ? `More on ${topic.tag.toLowerCase()}` : 'More topics'}
        />
      </div>
    </>
  )
}
