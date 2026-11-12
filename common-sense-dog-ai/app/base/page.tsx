import type { Metadata } from 'next'
import Link from 'next/link'
import { BASE_SECTIONS, BASE_TOTAL_PAIRS } from '@/lib/base-data'

export const metadata: Metadata = {
  title: 'The Base — what we actually know, by section',
  description:
    'Every researched Q&A in the Common Sense Dog knowledge base, grouped by the problem an owner actually arrives with, with the evidence tier of each section shown honestly.',
  robots: { index: false, follow: false },
}

const GROUPS = ['Organ', 'Input', 'Exposure', 'Real'] as const
const GROUP_NOTE: Record<string, string> = {
  Organ: 'What is wrong with the dog.',
  Input: 'What goes in on purpose.',
  Exposure: 'What goes in whether you meant it to or not.',
  Real: 'One dog, tracked over time.',
}
const TIER_META: [string, string, string][] = [
  ['🟢', 'Strong', 'var(--leaf)'],
  ['🟡', 'Moderate', 'var(--amber)'],
  ['🟠', 'Emerging', 'var(--score-below)'],
  ['⚪', 'Anecdotal', 'var(--text-faint)'],
]

/**
 * The Base, as a map rather than a list.
 *
 * Every number on this page is counted from the pack files by
 * scripts/build-base.mjs — nothing is asserted that the files don't contain.
 * The tier bar is the point: it shows at a glance which sections rest on
 * strong evidence and which are mostly mechanism and practice, which is the
 * thing the whole genre leaves out.
 */
export default function BasePage() {
  const totalPacks = BASE_SECTIONS.reduce((n, s) => n + s.packs.length, 0)
  const tierTotals = TIER_META.map(([e]) =>
    BASE_SECTIONS.reduce((n, s) => n + (s.tiers[e] ?? 0), 0))
  const tiered = tierTotals.reduce((a, b) => a + b, 0)

  return (
    <>
      <style>{`
        .bs { max-width: 1020px; margin: 0 auto; padding: 44px 24px 80px; }
        .bs-kicker { font-size: 11.5px; font-weight: 800; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--leaf); }
        .bs h1 { font-family: Georgia, serif; font-size: clamp(34px, 6vw, 52px); line-height: 1.02;
          margin: 8px 0 0; letter-spacing: -.025em; }
        .bs-lede { font-size: 17px; color: var(--text-muted); line-height: 1.62; margin: 13px 0 0; max-width: 60ch; }

        .bs-stats { display: flex; gap: 26px; flex-wrap: wrap; margin-top: 26px;
          padding: 18px 0; border-top: 2px solid var(--text); border-bottom: 1px solid var(--border); }
        .bs-stat b { display: block; font-size: 29px; font-weight: 800; letter-spacing: -.02em;
          font-variant-numeric: tabular-nums; line-height: 1; }
        .bs-stat span { font-size: 12px; color: var(--text-faint); text-transform: uppercase;
          letter-spacing: .9px; font-weight: 700; }

        .bs-legend { display: flex; gap: 15px; flex-wrap: wrap; margin-top: 14px;
          font-size: 12.5px; color: var(--text-muted); }
        .bs-legend b { color: var(--text); font-weight: 700; }

        .bs-group { margin-top: 44px; }
        .bs-group > h2 { font-family: Georgia, serif; font-size: 25px; margin: 0 0 2px; }
        .bs-group > p { font-size: 14px; color: var(--text-faint); margin: 0 0 18px; }

        .bs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 12px; }
        .bs-card { display: block; background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 18px 19px; text-decoration: none; color: inherit;
          transition: border-color .18s, transform .18s, box-shadow .18s; }
        .bs-card:hover { border-color: var(--leaf-bright); transform: translateY(-2px); box-shadow: var(--shadow); }
        .bs-top { display: flex; align-items: baseline; gap: 10px; }
        .bs-em { font-size: 22px; line-height: 1; }
        .bs-card h3 { font-size: 16.5px; font-weight: 800; margin: 0; flex: 1; letter-spacing: -.01em; }
        .bs-n { font-family: ui-monospace, Menlo, monospace; font-size: 15px; font-weight: 800;
          font-variant-numeric: tabular-nums; color: var(--leaf); }
        .bs-ask { font-size: 13.5px; color: var(--text-muted); line-height: 1.55; margin: 8px 0 0; }

        .bs-bar { display: flex; height: 7px; border-radius: 4px; overflow: hidden;
          margin-top: 13px; background: var(--paper-2); gap: 1px; }
        .bs-bar i { display: block; }
        .bs-untiered { font-size: 11.5px; color: var(--text-faint); margin-top: 7px; }

        .bs-topics { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 11px; }
        .bs-topics span { font-family: ui-monospace, Menlo, monospace; font-size: 10.5px;
          padding: 2px 7px; border-radius: 4px; background: var(--leaf-wash); color: var(--leaf-deep); }

        .bs-foot { margin-top: 48px; padding-top: 22px; border-top: 2px solid var(--text);
          font-size: 14px; color: var(--text-muted); line-height: 1.65; }
        .bs-foot strong { color: var(--text); }
        .bs-foot code { font-family: ui-monospace, monospace; font-size: 12.5px;
          background: var(--paper-2); border: 1px solid var(--border); padding: 1px 5px; border-radius: 3px; }
      `}</style>

      <div className="bs">
        <div className="bs-kicker">The Base</div>
        <h1>Everything we know, by what&rsquo;s wrong.</h1>
        <p className="bs-lede">
          The books aren&rsquo;t organised the way an owner arrives — with one dog and one problem.
          This is. Every pack grouped into the section you&rsquo;d actually reach for, with the
          evidence behind each one shown rather than implied.
        </p>

        <div className="bs-stats">
          <div className="bs-stat"><b>{BASE_SECTIONS.length}</b><span>sections</span></div>
          <div className="bs-stat"><b>{BASE_TOTAL_PAIRS.toLocaleString()}</b><span>researched answers</span></div>
          <div className="bs-stat"><b>{totalPacks}</b><span>source packs</span></div>
          <div className="bs-stat"><b>{tiered}</b><span>carry a tier</span></div>
        </div>

        <div className="bs-legend">
          {TIER_META.map(([e, label, col], i) => (
            <span key={e}>
              <i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3,
                background: col, verticalAlign: -1, marginRight: 6 }} />
              <b>{label}</b> {tierTotals[i]}
            </span>
          ))}
        </div>

        {GROUPS.map((g) => {
          const items = BASE_SECTIONS.filter((s) => s.group === g)
          if (!items.length) return null
          return (
            <section className="bs-group" key={g}>
              <h2>{g === 'Real' ? 'The real dog' : g + 's'}</h2>
              <p>{GROUP_NOTE[g]}</p>
              <div className="bs-grid">
                {items.map((s) => {
                  const tsum = TIER_META.reduce((n, [e]) => n + (s.tiers[e] ?? 0), 0)
                  return (
                    <Link className="bs-card" key={s.id} href={`/base/${s.id}`}>
                      <div className="bs-top">
                        <span className="bs-em" aria-hidden="true">{s.emoji}</span>
                        <h3>{s.label}</h3>
                        <span className="bs-n">{s.pairs}</span>
                      </div>
                      <p className="bs-ask">{s.ask}</p>

                      {tsum > 0 ? (
                        <>
                          <div className="bs-bar" role="img"
                               aria-label={TIER_META.map(([e, l]) => `${l} ${s.tiers[e] ?? 0}`).join(', ')}>
                            {TIER_META.map(([e, , col]) => {
                              const n = s.tiers[e] ?? 0
                              return n ? <i key={e} style={{ width: `${(n / tsum) * 100}%`, background: col }} /> : null
                            })}
                          </div>
                          <p className="bs-untiered">
                            {tsum} of {s.pairs} tiered · {s.packs.length} pack{s.packs.length === 1 ? '' : 's'}
                          </p>
                        </>
                      ) : (
                        <p className="bs-untiered">
                          ⚠ none tiered yet · {s.packs.length} pack{s.packs.length === 1 ? '' : 's'}
                        </p>
                      )}

                      <div className="bs-topics">
                        {s.topics.slice(0, 4).map((t) => <span key={t.t}>{t.t} {t.n}</span>)}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}

        <div className="bs-foot">
          <p>
            <strong>Every number here is counted from the files</strong>, not typed in —
            <code>scripts/build-base.mjs</code> reads the packs and regenerates this. Add a pack,
            re-run it, the map updates. Nothing is claimed that the corpus doesn&rsquo;t contain.
          </p>
          <p>
            <strong>The tier bar is the point.</strong> A section that is mostly ⚪ isn&rsquo;t
            worthless — it&rsquo;s practice and mechanism without controlled data, and saying so
            is the thing this whole genre leaves out. Sections showing <em>none tiered yet</em>
            are the honest backlog.
          </p>
        </div>
      </div>
    </>
  )
}
