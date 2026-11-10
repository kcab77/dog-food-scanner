import type { Metadata } from 'next'
import Link from 'next/link'
import BodyMap from './BodyMap'
import { REGIONS } from '@/lib/anatomy'
import { getTopic } from '@/lib/library'

export const metadata: Metadata = {
  title: 'Where It Shows Up — A Dog Health Map | Common Sense Dog',
  description:
    "Click the part of your dog that's bothering you — ears, gut, hips, skin — and get the holistic research on what causes it and what to do. 15 regions, 44 researched topics.",
}

export default function BodyPage() {
  // Real summaries for the cards, so the page carries text a crawler can read.
  const detailed = REGIONS.map((r) => ({ r, topic: getTopic(r.slug) })).filter((x) => x.topic)

  return (
    <>
      <style>{`
        .bm-wrap { max-width: 860px; margin: 0 auto; padding: 46px 22px 70px; }
        .bm-kicker { font-size: 12px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase;
          color: var(--leaf); }
        .bm-wrap h1 { font-family: Georgia, serif; font-size: clamp(30px, 5.4vw, 46px); line-height: 1.04;
          margin: 8px 0 0; letter-spacing: -.02em; }
        .bm-lede { font-size: 17px; color: var(--text-muted); line-height: 1.6; margin: 12px 0 0; max-width: 60ch; }

        /* the plate */
        .bm-stage { margin-top: 30px; background: var(--surface); border: 1px solid var(--border);
          border-radius: 18px; padding: 20px 20px 0; box-shadow: var(--shadow-sm); }
        .bm-svg { display: block; width: 100%; height: auto; overflow: visible; }
        .bm-body { fill: var(--leaf-wash); stroke: var(--leaf-deep); stroke-width: 1.7;
          stroke-linejoin: round; }
        .bm-ear { fill: var(--leaf-bright); opacity: .5; stroke: var(--leaf-deep); stroke-width: 1.3; }
        .bm-detail { fill: none; stroke: var(--leaf-deep); stroke-width: 1; opacity: .34; }
        .bm-eye { fill: var(--leaf-deep); }
        .bm-rule { stroke: var(--border); stroke-width: 1; }
        .bm-fig { font-family: ui-monospace, Menlo, monospace; font-size: 9px; letter-spacing: 1.6px;
          fill: var(--text-faint); }

        .bm-hit { cursor: pointer; }
        .bm-dot { fill: var(--surface); stroke: var(--leaf); stroke-width: 1.8;
          transition: r .16s, fill .16s, stroke-width .16s; }
        .bm-hit:hover .bm-dot, .bm-dot.on { fill: var(--amber); stroke: var(--amber); stroke-width: 2.4; }
        .bm-num { font-family: ui-monospace, Menlo, monospace; font-size: 9.5px; font-weight: 700;
          fill: var(--leaf-deep); pointer-events: none; transition: fill .16s; }
        .bm-hit:hover .bm-num, .bm-dot.on + .bm-num { fill: #fff; }
        .bm-hit:focus-visible { outline: none; }
        .bm-hit:focus-visible .bm-dot { stroke: var(--amber); stroke-width: 3; }

        .bm-read { border-top: 1px solid var(--border); margin-top: 6px; padding: 14px 2px;
          min-height: 58px; display: flex; flex-direction: column; gap: 2px; }
        .bm-part { font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;
          color: var(--leaf); }
        .bm-read strong { font-size: 17px; font-weight: 700; }
        .bm-hint { font-size: 14px; color: var(--text-faint); line-height: 1.5; }

        /* the list — the real, crawlable version of the same thing */
        .bm-list { list-style: none; margin: 26px 0 0; padding: 0;
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        @media (max-width: 680px) { .bm-list { grid-template-columns: 1fr; } }
        .bm-list a { display: flex; align-items: center; gap: 12px; padding: 12px 14px;
          background: var(--surface); border: 1px solid var(--border); border-radius: 13px;
          text-decoration: none; color: inherit; transition: border-color .18s, transform .18s; }
        .bm-list a:hover { border-color: var(--leaf-bright); transform: translateX(3px); }
        .bm-n { flex: none; width: 25px; height: 25px; border-radius: 50%; background: var(--leaf-wash);
          color: var(--leaf-deep); font-family: ui-monospace, monospace; font-size: 12px; font-weight: 700;
          display: grid; place-items: center; }
        .bm-txt { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .bm-sym { font-size: 14.5px; font-weight: 600; line-height: 1.35; }
        .bm-pt { font-size: 11.5px; color: var(--text-faint); text-transform: uppercase;
          letter-spacing: .7px; margin-top: 1px; }
        .bm-arr { color: var(--leaf); font-weight: 800; flex: none; }

        .bm-cards { margin-top: 44px; border-top: 2px solid var(--text); padding-top: 22px; }
        .bm-cards h2 { font-family: Georgia, serif; font-size: 25px; margin: 0 0 4px; }
        .bm-cards p.sub { font-size: 14px; color: var(--text-muted); margin: 0 0 18px; }
        .bm-card { display: block; padding: 15px 0; border-bottom: 1px solid var(--border-soft);
          text-decoration: none; color: inherit; }
        .bm-card:hover h3 { color: var(--leaf); }
        .bm-card h3 { font-size: 16px; font-weight: 700; margin: 0 0 3px; transition: color .15s; }
        .bm-card p { font-size: 13.5px; color: var(--text-muted); margin: 0; line-height: 1.55; }

        .bm-foot { margin-top: 34px; padding: 20px 22px; background: var(--leaf-wash);
          border: 1px solid var(--leaf-bright); border-radius: 16px; }
        .bm-foot h3 { font-family: Georgia, serif; font-size: 19px; margin: 0 0 5px; }
        .bm-foot p { font-size: 14px; color: var(--text-muted); margin: 0 0 13px; line-height: 1.6; }
        .bm-foot a { display: inline-flex; align-items: center; gap: 7px; background: var(--leaf);
          color: #fff; font-size: 14.5px; font-weight: 800; padding: 11px 20px; border-radius: 999px;
          text-decoration: none; }
        .bm-disc { font-size: 12px; color: var(--text-faint); margin-top: 26px; line-height: 1.55; }
      `}</style>

      <div className="bm-wrap">
        <div className="bm-kicker">The body map</div>
        <h1>Point at what&rsquo;s wrong.</h1>
        <p className="bm-lede">
          Most health libraries make you know the name of the thing first. You don&rsquo;t — you
          know his ears smell, or he&rsquo;s slow getting up. So this one is labelled by what you
          actually notice.
        </p>

        <BodyMap />

        <div className="bm-cards">
          <h2>What each one covers</h2>
          <p className="sub">The same fifteen, with what you&rsquo;ll find inside.</p>
          {detailed.map(({ r, topic }) => (
            <Link key={r.id} href={`/library/${r.slug}`} className="bm-card">
              <h3>{topic!.emoji} {topic!.title}</h3>
              <p>{topic!.summary}</p>
            </Link>
          ))}
        </div>

        <div className="bm-foot">
          <h3>Not sure which one it is?</h3>
          <p>
            Plenty of this starts in the bowl. Scan your dog&rsquo;s food and PawGrade scores the
            ingredient list 0–100, flags what&rsquo;s in it, and tells you what to add.
          </p>
          <a href="https://apps.apple.com/app/id6760376540">Get PawGrade — free <span aria-hidden="true">→</span></a>
        </div>

        <p className="bm-disc">
          <strong>Educational only — not veterinary advice.</strong> A body map is a place to start
          reading, not a diagnosis. Blood in the stool, sustained weight loss, a hard swollen belly,
          or a dog genuinely off food needs a vet now, not a longer supplement list.
        </p>
      </div>
    </>
  )
}
