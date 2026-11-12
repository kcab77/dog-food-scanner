import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BASE_SECTIONS } from '@/lib/base-data'

export function generateStaticParams() {
  return BASE_SECTIONS.map((s) => ({ section: s.id }))
}

export async function generateMetadata({ params }: { params: { section: string } }): Promise<Metadata> {
  const s = BASE_SECTIONS.find((x) => x.id === params.section)
  if (!s) return {}
  return { title: `${s.label} — The Base`, robots: { index: false, follow: false } }
}

const TIER_META: Record<string, { label: string; col: string }> = {
  '🟢': { label: 'Strong', col: 'var(--leaf)' },
  '🟡': { label: 'Moderate', col: 'var(--amber)' },
  '🟠': { label: 'Emerging', col: 'var(--score-below)' },
  '⚪': { label: 'Anecdotal', col: 'var(--text-faint)' },
  '': { label: 'Untiered', col: 'var(--border)' },
}

/**
 * One section of The Base, with the actual answers rather than a count of them.
 *
 * Sorted so tiered pairs come first — the honest material leads, and the
 * untiered backlog is visible at the bottom instead of mixed in where it reads
 * as equally settled.
 */
export default function BaseSectionPage({ params }: { params: { section: string } }) {
  const s = BASE_SECTIONS.find((x) => x.id === params.section)
  if (!s) notFound()
  const others = BASE_SECTIONS.filter((x) => x.id !== s.id).slice(0, 8)
  const tsum = Object.values(s.tiers).reduce((a, b) => a + b, 0)
  const shown = s.qa.length

  return (
    <>
      <style>{`
        .sx { max-width: 760px; margin: 0 auto; padding: 42px 24px 80px; }
        .sx-back { display: inline-block; font-size: 13.5px; font-weight: 600; color: var(--leaf);
          text-decoration: none; margin-bottom: 24px; }
        .sx-back:hover { text-decoration: underline; }
        .sx-em { font-size: 40px; line-height: 1; display: block; }
        .sx h1 { font-family: Georgia, serif; font-size: clamp(31px, 5.6vw, 42px); line-height: 1.04;
          margin: 13px 0 0; letter-spacing: -.02em; }
        .sx-ask { font-size: 16.5px; color: var(--text-muted); line-height: 1.6; margin: 10px 0 0; }

        .sx-meta { display: flex; gap: 22px; flex-wrap: wrap; margin-top: 22px; padding: 15px 0;
          border-top: 2px solid var(--text); border-bottom: 1px solid var(--border); }
        .sx-meta div b { display: block; font-size: 23px; font-weight: 800; line-height: 1;
          font-variant-numeric: tabular-nums; }
        .sx-meta div span { font-size: 11.5px; color: var(--text-faint); text-transform: uppercase;
          letter-spacing: .8px; font-weight: 700; }
        .sx-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; gap: 1px;
          margin-top: 14px; background: var(--paper-2); }
        .sx-bar i { display: block; }
        .sx-key { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 9px; font-size: 12px;
          color: var(--text-muted); }

        .qa { margin-top: 12px; }
        .qa details { border-bottom: 1px solid var(--border-soft); padding: 15px 0; }
        .qa summary { cursor: pointer; display: flex; gap: 10px; align-items: baseline;
          list-style: none; font-size: 15.5px; font-weight: 600; line-height: 1.45; }
        .qa summary::-webkit-details-marker { display: none; }
        .qa summary:hover { color: var(--leaf); }
        .qa .tier { flex: none; font-size: 13px; width: 18px; }
        .qa .ans { font-size: 14.5px; color: var(--text-muted); line-height: 1.68;
          margin: 11px 0 0; padding-left: 28px; white-space: pre-wrap; }
        .qa .src { font-size: 11.5px; color: var(--text-faint); margin: 9px 0 0; padding-left: 28px;
          font-family: ui-monospace, Menlo, monospace; }
        .sx-h2 { font-family: Georgia, serif; font-size: 22px; margin: 36px 0 2px; }
        .sx-sub { font-size: 13.5px; color: var(--text-faint); margin: 0 0 6px; }

        .sx-more { margin-top: 44px; padding-top: 22px; border-top: 2px solid var(--text); }
        .sx-more h3 { font-size: 12px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;
          color: var(--text-faint); margin: 0 0 12px; }
        .sx-more div { display: flex; gap: 8px; flex-wrap: wrap; }
        .sx-more a { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px;
          border-radius: 999px; border: 1px solid var(--border); font-size: 13.5px; font-weight: 600;
          text-decoration: none; color: var(--text); }
        .sx-more a:hover { border-color: var(--leaf-bright); background: var(--leaf-wash); }
      `}</style>

      <div className="sx">
        <Link href="/base" className="sx-back">← The Base</Link>
        <span className="sx-em" aria-hidden="true">{s.emoji}</span>
        <h1>{s.label}</h1>
        <p className="sx-ask">{s.ask}</p>

        <div className="sx-meta">
          <div><b>{s.pairs}</b><span>answers</span></div>
          <div><b>{s.packs.length}</b><span>packs</span></div>
          <div><b>{tsum}</b><span>tiered</span></div>
        </div>

        {tsum > 0 && (
          <>
            <div className="sx-bar">
              {Object.entries(s.tiers).map(([e, n]) =>
                n ? <i key={e} style={{ width: `${(n / tsum) * 100}%`, background: TIER_META[e].col }} /> : null)}
            </div>
            <div className="sx-key">
              {Object.entries(s.tiers).filter(([, n]) => n).map(([e, n]) => (
                <span key={e}>{e} {TIER_META[e].label} {n}</span>
              ))}
            </div>
          </>
        )}

        <h2 className="sx-h2">The answers</h2>
        <p className="sx-sub">
          {shown < s.pairs
            ? `Showing ${shown} of ${s.pairs} — tiered first.`
            : `All ${s.pairs}, tiered first.`}
        </p>
        <div className="qa">
          {s.qa.map((p, i) => (
            <details key={i}>
              <summary>
                <span className="tier" aria-hidden="true">{p.tier || '·'}</span>
                <span>{p.q}</span>
              </summary>
              <p className="ans">{p.a}</p>
              {p.source && <p className="src">{p.source}</p>}
            </details>
          ))}
        </div>

        <div className="sx-more">
          <h3>Other sections</h3>
          <div>
            {others.map((o) => (
              <Link key={o.id} href={`/base/${o.id}`}>
                <span aria-hidden="true">{o.emoji}</span>{o.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
