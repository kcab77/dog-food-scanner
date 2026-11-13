import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BASE_SECTIONS } from '@/lib/base-data'
import HersheyNote from '../../HersheyNote'
import { hersheyNoteFor } from '@/lib/hershey'

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
 * One section of The Base.
 *
 * Kyle's note on the first version: "too much info to absorb at once and very
 * unorganized." It was 60 answers in a single flat list. So the answers now sit
 * inside compartments, closed, with only the first one open — the page opens as
 * a short contents list you choose from, not a wall you scroll.
 *
 * Within a compartment, tiered answers lead: the checked material is read first
 * and the untiered backlog sits visibly at the bottom rather than mixed in where
 * it would read as equally settled.
 */
export default function BaseSectionPage({ params }: { params: { section: string } }) {
  const s = BASE_SECTIONS.find((x) => x.id === params.section)
  if (!s) notFound()
  const others = BASE_SECTIONS.filter((x) => x.id !== s.id).slice(0, 8)
  const tsum = Object.values(s.tiers).reduce((a, b) => a + b, 0)
  const compartmentalised = s.subs.length > 1

  return (
    <>
      <style>{`
        .sx { max-width: 740px; margin: 0 auto; padding: 42px 24px 80px; }
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

        /* ── the contents list: what the page opens as ── */
        .toc { margin-top: 34px; }
        .toc h2 { font-family: Georgia, serif; font-size: 20px; margin: 0 0 3px; }
        .toc p.lede { font-size: 13.5px; color: var(--text-faint); margin: 0 0 14px; }
        .toc ol { list-style: none; counter-reset: c; margin: 0; padding: 0;
          display: grid; grid-template-columns: repeat(auto-fill, minmax(218px, 1fr)); gap: 7px; }
        .toc li { counter-increment: c; }
        .toc a { display: flex; align-items: baseline; gap: 9px; padding: 10px 13px;
          border: 1px solid var(--border); border-radius: 10px; text-decoration: none;
          color: var(--text); font-size: 14px; font-weight: 600; line-height: 1.35; height: 100%; }
        .toc a:hover { border-color: var(--leaf-bright); background: var(--leaf-wash); }
        .toc a::before { content: counter(c); flex: none; font-size: 11px; font-weight: 800;
          color: var(--text-faint); font-variant-numeric: tabular-nums; min-width: 13px; }
        .toc a i { font-style: normal; flex: none; }
        .toc a b { font-weight: 600; flex: 1; }
        .toc a u { text-decoration: none; flex: none; font-size: 12px; font-weight: 700;
          color: var(--text-faint); font-variant-numeric: tabular-nums; }

        /* ── a compartment ── */
        .cmp { border: 1px solid var(--border); border-radius: 13px; margin-top: 11px;
          background: var(--surface); overflow: hidden; scroll-margin-top: 16px; }
        .cmp > summary { cursor: pointer; list-style: none; padding: 15px 17px;
          display: flex; align-items: baseline; gap: 11px; }
        .cmp > summary::-webkit-details-marker { display: none; }
        .cmp > summary:hover { background: var(--leaf-wash); }
        .cmp[open] > summary { border-bottom: 1px solid var(--border-soft); }
        .cmp-em { flex: none; font-size: 19px; line-height: 1; }
        .cmp-h { flex: 1; min-width: 0; }
        .cmp-h b { display: block; font-family: Georgia, serif; font-size: 18.5px; font-weight: 400;
          line-height: 1.25; }
        .cmp-h span { display: block; font-size: 13px; color: var(--text-muted); line-height: 1.5;
          margin-top: 3px; }
        .cmp-n { flex: none; font-size: 12px; font-weight: 700; color: var(--text-faint);
          font-variant-numeric: tabular-nums; }
        .cmp-dots { display: flex; gap: 2px; margin-top: 6px; }
        .cmp-dots i { display: block; width: 13px; height: 4px; border-radius: 2px; }
        .cmp-body { padding: 4px 17px 8px; }

        /* ── one question ── */
        .qa details { border-bottom: 1px solid var(--border-soft); padding: 13px 0; }
        .qa details:last-child { border-bottom: 0; }
        .qa summary { cursor: pointer; display: flex; gap: 10px; align-items: baseline;
          list-style: none; font-size: 15px; font-weight: 600; line-height: 1.45; }
        .qa summary::-webkit-details-marker { display: none; }
        .qa summary:hover { color: var(--leaf); }
        .qa .tier { flex: none; font-size: 12px; width: 17px; }
        .qa .ans { font-size: 14.5px; color: var(--text-muted); line-height: 1.68;
          margin: 11px 0 0; padding-left: 27px; white-space: pre-wrap; }
        .qa .src { font-size: 11.5px; color: var(--text-faint); margin: 9px 0 0; padding-left: 27px;
          font-family: ui-monospace, Menlo, monospace; }

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

        {/* Kyle's own dog first, the corpus second. See lib/hershey.ts. */}
        <div style={{ marginTop: 24 }}>
          <HersheyNote note={hersheyNoteFor('base', s.id)} />
        </div>

        <div className="sx-meta">
          <div><b>{s.pairs}</b><span>answers</span></div>
          {compartmentalised && <div><b>{s.subs.length}</b><span>parts</span></div>}
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

        {compartmentalised && (
          <nav className="toc">
            <h2>What&rsquo;s in here</h2>
            <p className="lede">Roughly the order you&rsquo;d work through it. Pick one — you don&rsquo;t read a section.</p>
            <ol>
              {s.subs.map((sub) => (
                <li key={sub.id}>
                  <a href={`#${sub.id}`}>
                    <i aria-hidden="true">{sub.emoji}</i>
                    <b>{sub.label}</b>
                    <u>{sub.qa.length}</u>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div style={{ marginTop: 26 }}>
          {s.subs.map((sub, si) => {
            const st = Object.values(sub.tiers).reduce((a, b) => a + b, 0)
            return (
              <details className="cmp" id={sub.id} key={sub.id} open={si === 0}>
                <summary>
                  <span className="cmp-em" aria-hidden="true">{sub.emoji}</span>
                  <span className="cmp-h">
                    <b>{sub.label}</b>
                    <span>{sub.blurb}</span>
                    {st > 0 && (
                      <span className="cmp-dots" aria-hidden="true">
                        {Object.entries(sub.tiers).map(([e, n]) =>
                          n ? <i key={e} style={{ width: 13 * n, background: TIER_META[e].col }} /> : null)}
                      </span>
                    )}
                  </span>
                  <span className="cmp-n">{sub.qa.length}</span>
                </summary>
                <div className="cmp-body qa">
                  {sub.qa.map((p, i) => (
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
              </details>
            )
          })}
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
