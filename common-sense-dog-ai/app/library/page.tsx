'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { getAllEntries, getEntriesByLetter, getActiveLetters } from '@/lib/library'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Library() {
  const [q, setQ] = useState('')
  const all = useMemo(() => getAllEntries(), [])
  const active = useMemo(() => getActiveLetters(), [])
  const grouped = useMemo(() => getEntriesByLetter(), [])

  const query = q.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!query) return grouped
    const match = all.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.summary.toLowerCase().includes(query) ||
        e.tag.toLowerCase().includes(query),
    )
    const map = new Map<string, typeof all>()
    for (const e of match) {
      if (!map.has(e.letter)) map.set(e.letter, [])
      map.get(e.letter)!.push(e)
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([letter, entries]) => ({ letter, entries }))
  }, [query, grouped, all])

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
        <p>Everything we know about keeping your dog healthy, in plain English. Search a topic, or browse the alphabet below.</p>
        <div className="search">
          <input
            type="text"
            placeholder="Search — e.g. fleas, omega-3, lipomas, kibble…"
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
        {filtered.length === 0 && (
          <div className="empty">
            <p>No topics match “{q}”.</p>
            <Link className="ask-cta" href={`/chat?q=${encodeURIComponent(q)}`}>Ask the assistant about it →</Link>
          </div>
        )}
        {filtered.map((group) => (
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
        ))}
      </div>
    </>
  )
}
