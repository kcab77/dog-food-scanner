'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { getAllEntries, getEntriesByLetter, getActiveLetters } from '@/lib/library'
import { libraryTopics } from '@/lib/library-data'
import { blogPosts } from '@/lib/blog-data'
import { answerPages } from '@/lib/answers-data'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Library() {
  const [q, setQ] = useState('')
  const all = useMemo(() => getAllEntries(), [])
  const active = useMemo(() => getActiveLetters(), [])
  const grouped = useMemo(() => getEntriesByLetter(), [])

  const query = q.trim().toLowerCase()

  /**
   * The search index — built once, covers every page on the site.
   *
   * The old search only looked at title, summary and tag, so searching
   * "xylitol" or "corn chip" or "menadione" returned nothing at all: those
   * words live in the article bodies, not the headlines. Every real question
   * an owner types is a body-text question.
   *
   * Now it searches the full text of all 40 library topics, 11 blog posts and
   * 55 answer pages including their FAQs — 106 pages. The A-Z browse below
   * still shows only the 51 curated topics, so browsing stays simple while
   * search reaches everything. That's deliberate: the answer pages exist for
   * people arriving from Google, and putting them all in the nav would be the
   * wall this site is meant not to have.
   */
  const index = useMemo(() => {
    const strip = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
    return [
      ...libraryTopics.map((t) => ({
        href: `/library/${t.slug}`, title: t.title, emoji: t.emoji, tag: t.tag,
        summary: t.summary, kind: 'Topic', body: strip(t.contentHtml).toLowerCase(),
      })),
      ...blogPosts.map((p) => ({
        href: `/blog/${p.slug}`, title: p.title, emoji: p.emoji, tag: p.tag,
        summary: p.description, kind: 'Article', body: strip(p.content).toLowerCase(),
      })),
      ...answerPages.map((a) => ({
        href: `/answers/${a.slug}`, title: a.title, emoji: a.emoji, tag: a.tag,
        summary: a.lead, kind: 'Answer',
        body: (a.lead + ' ' + a.faqs.map((f) => f.q + ' ' + f.a).join(' ')).toLowerCase(),
      })),
    ]
  }, [])

  /**
   * Every term must appear somewhere, so "corn chip smell" narrows rather than
   * widens. Ranked by WHERE it matched — a title hit beats a body mention —
   * and each result carries the sentence it matched on, so you can see why it
   * came back without opening it.
   */
  const results = useMemo(() => {
    if (!query) return []
    const terms = query.split(/\s+/).filter(Boolean)
    return index
      .map((e) => {
        const title = e.title.toLowerCase()
        const summary = e.summary.toLowerCase()
        const tag = e.tag.toLowerCase()
        let score = 0
        for (const t of terms) {
          if (title.includes(t)) score += 10
          else if (tag.includes(t)) score += 5
          else if (summary.includes(t)) score += 4
          else if (e.body.includes(t)) score += 1
          else return null
        }
        let snippet = e.summary
        const first = terms.find((t) => !title.includes(t) && e.body.includes(t))
        if (first) {
          const i = e.body.indexOf(first)
          snippet = '…' + e.body.slice(Math.max(0, i - 90), i + 130).trim() + '…'
        }
        return { ...e, score, snippet }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.score - a.score || a.title.length - b.title.length)
      .slice(0, 30)
  }, [query, index])

  return (
    <>
      <style jsx global>{`
        :root { --cream: #FDFAF5; --cream-dark: #F5EFE4; --green: #2A5C2E; --green-light: #3D7A42; --green-pale: #EAF3EB; --border: #E7E0D4; --text: #2B2A26; --text-muted: #7A746B; --white: #FFFFFF; }
        * { box-sizing: border-box; }
        body { margin: 0; background: var(--cream); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        a { color: inherit; }
      `}</style>
      <style jsx>{`
        nav { background: var(--white); border-bottom: 1px solid var(--border); padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .nav-logo { display: flex; flex-direction: column; text-decoration: none; }
        .nav-logo-text { font-size: 17px; font-weight: 700; color: var(--green); letter-spacing: -0.3px; }
        .nav-logo-sub { font-size: 11px; color: var(--text-muted); }
        .nav-links { display: flex; gap: 24px; align-items: center; }
        .nav-links a { text-decoration: none; color: var(--text-muted); font-size: 14px; font-weight: 500; }
        .nav-links a:hover { color: var(--green); }
        .hero { text-align: center; padding: 56px 24px 28px; max-width: 760px; margin: 0 auto; }
        .hero h1 { font-size: 42px; margin: 0 0 10px; color: var(--green); letter-spacing: -1px; }
        .hero p { font-size: 18px; color: var(--text-muted); margin: 0 0 26px; line-height: 1.5; }
        .search { width: 100%; max-width: 560px; margin: 0 auto; display: flex; gap: 10px; }
        .search input { flex: 1; padding: 15px 20px; border-radius: 30px; border: 1.5px solid var(--border); font-size: 16px; outline: none; background: var(--white); }
        .search input:focus { border-color: var(--green); }
        .ask-cta { background: var(--green); color: #fff; border-radius: 30px; padding: 15px 22px; font-weight: 600; text-decoration: none; white-space: nowrap; font-size: 15px; display: flex; align-items: center; }
        .azbar { max-width: 1000px; margin: 0 auto 8px; padding: 8px 24px; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
        .azbar a, .azbar span { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; text-decoration: none; }
        .azbar a { background: var(--green-pale); color: var(--green); }
        .azbar a:hover { background: var(--green); color: #fff; }
        .azbar span { color: #CFC8BB; }
        .content { max-width: 1000px; margin: 0 auto; padding: 16px 24px 80px; }
        .result-count { text-align: center; color: var(--muted, #6b7280); font-size: 14px; margin: 26px 0 4px; }
        .results { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
        .result { display: flex; gap: 13px; align-items: flex-start; background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; text-decoration: none; color: inherit; transition: all 0.15s; }
        .result:hover { border-color: var(--green); transform: translateY(-1px); }
        .result-emoji { font-size: 22px; line-height: 1.2; flex-shrink: 0; }
        .result-body { min-width: 0; flex: 1; }
        .result-head { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; }
        .result-title { font-size: 15.5px; font-weight: 700; color: var(--text); }
        .result-kind { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--green); background: var(--green-pale); padding: 2px 7px; border-radius: 20px; }
        .result-snippet { font-size: 13px; line-height: 1.55; color: var(--muted, #6b7280); margin: 5px 0 0; }
        .letter-group { margin-top: 34px; scroll-margin-top: 80px; }
        .letter-head { font-size: 26px; font-weight: 800; color: var(--green); border-bottom: 2px solid var(--green-pale); padding-bottom: 6px; margin-bottom: 16px; }
        .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
        .card { background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 18px; text-decoration: none; color: var(--text); transition: transform .12s, box-shadow .12s, border-color .12s; display: block; }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(42,92,46,.10); border-color: var(--green); }
        .card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .card-emoji { font-size: 26px; }
        .card-title { font-size: 16px; font-weight: 700; line-height: 1.25; }
        .card-tag { display: inline-block; background: var(--green-pale); color: var(--green); font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 12px; margin-bottom: 8px; }
        .card-summary { font-size: 13.5px; color: var(--text-muted); line-height: 1.5; margin: 0; }
        .empty { text-align: center; color: var(--text-muted); padding: 60px 20px; }
        @media (max-width: 640px) { .nav-links { display: none; } .hero h1 { font-size: 32px; } .search { flex-direction: column; } }
      `}</style>

      <nav>
        <Link href="/" className="nav-logo">
          <span className="nav-logo-text">Common Sense Dog</span>
          <span className="nav-logo-sub">Real dog health from a real dog owner</span>
        </Link>
        <div className="nav-links">
          <Link href="/#story">Our Story</Link>
          <Link href="/library" style={{ color: '#2A5C2E', fontWeight: 700 }}>A–Z</Link>
          <Link href="/blog">Articles</Link>
          <Link href="/chat">Ask AI</Link>
          <Link href="/scan">Scanner</Link>
        </div>
      </nav>

      <div className="hero">
        <h1>Dog Health A–Z</h1>
        <p>Everything we know about keeping your dog healthy, in plain English. Search across every page, or browse the alphabet below.</p>
        <div className="search">
          <input
            type="text"
            placeholder="Search everything — xylitol, corn chip smell, zinc oxide…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search topics"
          />
          <Link className="ask-cta" href={query ? `/chat?q=${encodeURIComponent(q)}` : '/chat'}>Ask the AI →</Link>
        </div>
      </div>

      {!query && (
        <div className="azbar">
          {ALPHABET.map((L) =>
            active.has(L) ? (
              <a key={L} href={`#letter-${L}`}>{L}</a>
            ) : (
              <span key={L}>{L}</span>
            ),
          )}
        </div>
      )}

      <div className="content">
        {/* Searching: one ranked list across everything, with the matched line.
            Browsing: the A-Z, untouched. Two modes, no extra furniture. */}
        {query ? (
          results.length === 0 ? (
            <div className="empty">
              <p>Nothing here matches “{q}”.</p>
              <Link className="ask-cta" href={`/chat?q=${encodeURIComponent(q)}`}>Ask the assistant about it →</Link>
            </div>
          ) : (
            <>
              <p className="result-count">
                {results.length} {results.length === 1 ? 'result' : 'results'} for “{q}”
              </p>
              <div className="results">
                {results.map((r) => (
                  <Link key={r.href} href={r.href} className="result">
                    <span className="result-emoji">{r.emoji}</span>
                    <div className="result-body">
                      <div className="result-head">
                        <span className="result-title">{r.title}</span>
                        <span className="result-kind">{r.kind}</span>
                      </div>
                      <p className="result-snippet">{r.snippet}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="empty" style={{ marginTop: 26 }}>
                <p>Not what you meant?</p>
                <Link className="ask-cta" href={`/chat?q=${encodeURIComponent(q)}`}>Ask the assistant instead →</Link>
              </div>
            </>
          )
        ) : (
          grouped.map((group) => (
            <section key={group.letter} id={`letter-${group.letter}`} className="letter-group">
              <div className="letter-head">{group.letter}</div>
              <div className="cards">
                {group.entries.map((e) => (
                  <Link key={e.href} href={e.href} className="card">
                    <div className="card-top">
                      <span className="card-emoji">{e.emoji}</span>
                      <span className="card-title">{e.title}</span>
                    </div>
                    <span className="card-tag">{e.tag}</span>
                    <p className="card-summary">{e.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  )
}
