'use client'

import { useState } from 'react'
import Link from 'next/link'
import { REGIONS, DOG_PATHS, type Region } from '@/lib/anatomy'

/**
 * Interactive, but the links underneath are real markup either way.
 *
 * The SVG is a convenience layer, never the only route in: a search engine
 * can't read a hotspot, and neither can a screen reader that doesn't do
 * pointer events. The full list below the drawing is the same 15 destinations
 * as plain anchors, so nothing here depends on JavaScript to be findable.
 */
export default function BodyMap() {
  const [active, setActive] = useState<Region | null>(null)

  return (
    <>
      <div className="bm-stage">
        <svg viewBox="0 0 420 280" className="bm-svg" role="img"
             aria-label="A dog, with fifteen clickable regions linking to health topics">
          {/* plate rule, like a field guide figure */}
          <line x1="16" y1="262" x2="404" y2="262" className="bm-rule" />
          <text x="16" y="276" className="bm-fig">FIG. 1 — WHERE IT SHOWS UP</text>

          <path d={DOG_PATHS.body} className="bm-body" />
          <path d={DOG_PATHS.detail} className="bm-detail" />
          <path d={DOG_PATHS.ear} className="bm-ear" />
          <path d={DOG_PATHS.eye} className="bm-eye" />

          {REGIONS.map((r, i) => {
            const on = active?.id === r.id
            return (
              <Link key={r.id} href={`/library/${r.slug}`} className="bm-hit"
                    onMouseEnter={() => setActive(r)} onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(r)} onBlur={() => setActive(null)}
                    aria-label={`${r.part}: ${r.symptom}`}>
                {/* generous invisible target — the visible dot is small on purpose */}
                <circle cx={r.x} cy={r.y} r="17" fill="transparent" />
                <circle cx={r.x} cy={r.y} r={on ? 11 : 8} className={`bm-dot${on ? ' on' : ''}`} />
                <text x={r.x} y={r.y + 3.6} textAnchor="middle" className="bm-num">{i + 1}</text>
              </Link>
            )
          })}
        </svg>

        <div className="bm-read" aria-live="polite">
          {active ? (
            <>
              <span className="bm-part">{active.part}</span>
              <strong>{active.symptom}</strong>
            </>
          ) : (
            <span className="bm-hint">Hover or tap a number — labelled by what you&rsquo;d notice, not what it&rsquo;s called.</span>
          )}
        </div>
      </div>

      <ol className="bm-list">
        {REGIONS.map((r, i) => (
          <li key={r.id}>
            <Link href={`/library/${r.slug}`}
                  onMouseEnter={() => setActive(r)} onMouseLeave={() => setActive(null)}>
              <span className="bm-n">{i + 1}</span>
              <span className="bm-txt">
                <span className="bm-sym">{r.symptom}</span>
                <span className="bm-pt">{r.part}</span>
              </span>
              <span className="bm-arr" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  )
}
