'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { foods } from '@/lib/foods-data'

/**
 * The food directory — every scored product, searchable.
 *
 * Scores come from PawGrade's REAL scorer (lib/scoring.generated.ts, lifted
 * from app/index.tsx), never a second implementation. If the app and this page
 * ever disagree, the generated file is stale — regenerate, don't patch here.
 */
const band = (s: number) =>
  s >= 85 ? { label: 'Excellent', cls: 'excellent' }
  : s >= 70 ? { label: 'Good', cls: 'good' }
  : s >= 50 ? { label: 'Fair', cls: 'fair' }
  : s >= 30 ? { label: 'Below Average', cls: 'below' }
  : { label: 'Low Quality', cls: 'low' }

const BANDS = ['All', 'Excellent', 'Good', 'Fair', 'Below Average', 'Low Quality']

export default function Foods() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')

  const shown = useMemo(() => {
    const query = q.trim().toLowerCase()
    return foods.filter((f) => {
      if (filter !== 'All' && band(f.score).label !== filter) return false
      if (!query) return true
      // Search the ingredient list too — "is there menadione in X" is a real
      // question, and the answer isn't in the product name.
      return (
        `${f.brand} ${f.name} ${f.format}`.toLowerCase().includes(query) ||
        f.ingredients.some((i) => i.toLowerCase().includes(query))
      )
    })
  }, [q, filter])

  return (
    <>
      <style>{`
        .wrap { max-width: 940px; margin: 0 auto; padding: 40px 20px 70px; }
        .crumb a:hover { color: var(--green); }
        .sub { font-size: 16px; color: var(--text-muted); line-height: 1.6; max-width: 620px; margin-bottom: 26px; }
        .search { width: 100%; padding: 14px 18px; font-size: 16px; border: 1px solid var(--border); border-radius: 30px; background: #fff; font-family: inherit; }
        .search:focus { outline: none; border-color: var(--green); }
        .chip.on { background: var(--green); color: #fff; border-color: var(--green); }
        .count { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; }
        .card:hover { border-color: var(--green); }
        .excellent { background: #2A7D3F; } .good { background: #5A9A4A; } .fair { background: #C8912B; }
        .below { background: #C4682B; } .low { background: #A83A32; }
        .meta { min-width: 0; }
        .brand { font-size: 12px; font-weight: 700; color: var(--green); text-transform: uppercase; letter-spacing: 0.4px; }
        .name { font-size: 15.5px; font-weight: 600; line-height: 1.35; margin: 2px 0 4px; }
        .tags { font-size: 12.5px; color: var(--text-muted); }
        .flag { color: #A83A32; font-weight: 600; }
        .empty { text-align: center; padding: 50px 20px; color: var(--text-muted); }
      `}</style>

      <div className="wrap">
        <p className="crumb"><Link href="/">Common Sense Dog</Link> · Food database</p>
        <h1>Dog food, scored</h1>
        <p className="sub">
          Every food run through the same scoring PawGrade uses — ingredients first,
          then processing, then what&apos;s actually in the vitamin and mineral pack.
          Search a brand, or search an ingredient you&apos;re worried about.
        </p>

        <input
          className="search"
          placeholder="Try a brand — or an ingredient like menadione, peas, BHA…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="chips">
          {BANDS.map((b) => (
            <button key={b} className={`chip${filter === b ? ' on' : ''}`} onClick={() => setFilter(b)}>
              {b}
              {b !== 'All' && ` (${foods.filter((f) => band(f.score).label === b).length})`}
            </button>
          ))}
        </div>

        <p className="count">
          {shown.length} of {foods.length} foods
          {q.trim() && ` matching “${q.trim()}”`}
        </p>

        <div className="grid">
          {shown.map((f) => {
            const b = band(f.score)
            return (
              <Link key={f.slug} href={`/foods/${f.slug}`} className="card">
                <div className={`score ${b.cls}`}>{f.score}</div>
                <div className="meta">
                  <div className="brand">{f.brand}</div>
                  <div className="name">{f.name}</div>
                  <div className="tags">
                    {f.format}
                    {f.flagged.length > 0 && <> · <span className="flag">{f.flagged.length} flagged</span></>}
                    {f.organs.length > 0 && <> · {f.organs.length} organ meat</>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {shown.length === 0 && (
          <p className="empty">Nothing matches that. Try a brand name, or an ingredient.</p>
        )}

        <p className="note">
          <strong>How to read a score.</strong> It starts at 60 and moves on what&apos;s actually
          in the bag — named whole meat and organ meat earn, fillers and flagged ingredients cost,
          and a gentler format earns a bonus on top. A low score isn&apos;t a judgement of you;
          it&apos;s a starting point. Educational only, not veterinary advice.
        </p>
      </div>
    </>
  )
}
