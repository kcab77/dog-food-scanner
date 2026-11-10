import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CONCERNS, getConcern } from '@/lib/concerns'
import { getTopic } from '@/lib/library'
import { partners, AFFILIATE_DISCLOSURE } from '@/lib/partners'

export function generateStaticParams() {
  return CONCERNS.map((c) => ({ concern: c.id }))
}

export async function generateMetadata({ params }: { params: { concern: string } }): Promise<Metadata> {
  const c = getConcern(params.concern)
  if (!c) return {}
  return {
    title: `${c.label} — Gentle Fixes for Dogs | Common Sense Dog`,
    description: `${c.blurb} What to try from the kitchen first, the research behind it, and what's worth buying.`,
  }
}

/**
 * One concern, one page, single column.
 *
 * The previous version stacked pantry boxes, product cards and link rows three
 * deep and repeated that six times on one screen. Here the page does one thing,
 * in the order the house position actually argues for: the cheap kitchen fix
 * first, then why, and only then something to buy. A remedies page that opens
 * with a product is an ad.
 */
export default function ConcernPage({ params }: { params: { concern: string } }) {
  const c = getConcern(params.concern)
  if (!c) notFound()
  const byId = Object.fromEntries(partners.map((p) => [p.id, p]))
  const topics = c.topics.map((s) => ({ slug: s, t: getTopic(s) })).filter((x) => x.t)
  const picks = c.products.map((id) => byId[id]).filter(Boolean)
  const others = CONCERNS.filter((x) => x.id !== c.id)

  return (
    <>
      <style>{`
        .cx { max-width: 680px; margin: 0 auto; padding: 44px 24px 80px; }
        .cx-back { display: inline-block; font-size: 13.5px; font-weight: 600; color: var(--leaf);
          text-decoration: none; margin-bottom: 26px; }
        .cx-back:hover { text-decoration: underline; }
        .cx-em { font-size: 42px; line-height: 1; display: block; }
        .cx h1 { font-family: Georgia, serif; font-size: clamp(32px, 6vw, 44px); line-height: 1.04;
          margin: 14px 0 0; letter-spacing: -.02em; }
        .cx-lede { font-size: 17px; color: var(--text-muted); line-height: 1.6; margin: 11px 0 0; }

        .cx-sec { margin-top: 46px; }
        .cx-sec > h2 { font-family: Georgia, serif; font-size: 23px; margin: 0 0 4px;
          letter-spacing: -.01em; }
        .cx-sec > .why { font-size: 14px; color: var(--text-faint); margin: 0 0 20px; line-height: 1.55; }

        /* one treatment, repeated — not three competing ones */
        .cx-list { list-style: none; margin: 0; padding: 0; }
        .cx-list li { padding: 17px 0; border-top: 1px solid var(--border-soft); }
        .cx-list li:first-child { border-top: 0; padding-top: 4px; }
        .cx-list b { font-size: 16px; display: block; }
        .cx-list span { font-size: 14.5px; color: var(--text-muted); line-height: 1.6;
          display: block; margin-top: 4px; }

        .cx-list a.read { display: flex; align-items: baseline; gap: 10px; text-decoration: none;
          color: inherit; }
        .cx-list a.read:hover b { color: var(--leaf); }
        .cx-list a.read b { transition: color .15s; }
        .cx-list .e { font-size: 17px; flex: none; }

        .cx-buy { margin-top: 18px; padding: 20px 22px; border: 1px solid var(--border);
          border-radius: 16px; background: var(--paper-2); }
        .cx-buy + .cx-buy { margin-top: 10px; }
        .cx-buy b { font-size: 16px; }
        .cx-buy p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin: 4px 0 0; }
        .cx-buy a { display: inline-block; margin-top: 13px; background: var(--amber); color: #fff;
          font-size: 13.5px; font-weight: 800; padding: 9px 17px; border-radius: 999px;
          text-decoration: none; }
        .cx-buy a:hover { filter: brightness(1.07); }

        .cx-app { margin-top: 48px; padding-top: 26px; border-top: 2px solid var(--text); }
        .cx-app h3 { font-family: Georgia, serif; font-size: 20px; margin: 0 0 6px; }
        .cx-app p { font-size: 15px; color: var(--text-muted); line-height: 1.6; margin: 0 0 15px; }
        .cx-app a { display: inline-flex; gap: 7px; background: var(--leaf); color: #fff;
          font-size: 15px; font-weight: 800; padding: 12px 22px; border-radius: 999px;
          text-decoration: none; }

        .cx-more { margin-top: 44px; }
        .cx-more h3 { font-size: 12px; font-weight: 800; letter-spacing: 1.2px;
          text-transform: uppercase; color: var(--text-faint); margin: 0 0 12px; }
        .cx-more div { display: flex; gap: 8px; flex-wrap: wrap; }
        .cx-more a { display: inline-flex; align-items: center; gap: 7px; padding: 8px 15px;
          border-radius: 999px; border: 1px solid var(--border); font-size: 14px; font-weight: 600;
          text-decoration: none; color: var(--text); }
        .cx-more a:hover { border-color: var(--leaf-bright); background: var(--leaf-wash); }

        .cx-disc { font-size: 11.5px; color: var(--text-faint); line-height: 1.6; margin-top: 30px; }
      `}</style>

      <div className="cx">
        <Link href="/remedies" className="cx-back">← All concerns</Link>

        <span className="cx-em" aria-hidden="true">{c.emoji}</span>
        <h1>{c.label}</h1>
        <p className="cx-lede">{c.blurb}</p>

        <section className="cx-sec">
          <h2>Try this first</h2>
          <p className="why">Cheapest move, and usually already in the house.</p>
          <ul className="cx-list">
            {c.pantry.map((p) => (
              <li key={p.item}><b>{p.item}</b><span>{p.why}</span></li>
            ))}
          </ul>
        </section>

        <section className="cx-sec">
          <h2>Why, and when it isn&rsquo;t enough</h2>
          <p className="why">The research behind each of these.</p>
          <ul className="cx-list">
            {topics.map(({ slug, t }) => (
              <li key={slug}>
                <Link href={`/library/${slug}`} className="read">
                  <span className="e" aria-hidden="true">{t!.emoji}</span>
                  <span style={{ flex: 1 }}>
                    <b>{t!.title}</b>
                    <span>{t!.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {picks.length > 0 && (
          <section className="cx-sec">
            <h2>If you want to buy something</h2>
            <p className="why">Last, not first — and only what this page argues for.</p>
            {picks.map((p) => (
              <div className="cx-buy" key={p.id}>
                <b>{p.emoji} {p.name}</b>
                <p>{p.blurb}</p>
                {p.howToUse && <p><strong>How to use it:</strong> {p.howToUse}</p>}
                <a href={p.url} target="_blank" rel="nofollow sponsored noopener">View on Amazon →</a>
              </div>
            ))}
            <p className="cx-disc">{AFFILIATE_DISCLOSURE}</p>
          </section>
        )}

        <div className="cx-app">
          <h3>Half of this starts in the bowl</h3>
          <p>Before changing supplements, check what you&rsquo;re already feeding. PawGrade scores
            a dog food 0–100 from its ingredient list and tells you what to add.</p>
          <a href="https://apps.apple.com/app/id6760376540">Get PawGrade — free <span aria-hidden="true">→</span></a>
        </div>

        <div className="cx-more">
          <h3>Something else going on?</h3>
          <div>
            {others.map((o) => (
              <Link key={o.id} href={`/remedies/${o.id}`}>
                <span aria-hidden="true">{o.emoji}</span>{o.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="cx-disc">
          <strong>Educational only — not veterinary advice.</strong> Blood in the stool, sustained
          weight loss, a hard swollen belly, or a dog genuinely off food needs a vet now, not a
          longer supplement list.
        </p>
      </div>
    </>
  )
}
