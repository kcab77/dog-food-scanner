import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { foods, getFood } from '@/lib/foods-data'
import { explainersFor } from '@/lib/explainers'

export function generateStaticParams() {
  return foods.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const f = getFood(slug)
  if (!f) return { title: 'Food not found' }
  // "[brand] [product] review" is the search people actually type.
  return {
    title: `${f.brand} ${f.name} Review — ${f.score}/100 | Common Sense Dog`,
    description: `${f.brand} ${f.name} scores ${f.score}/100. See the full ingredient breakdown — what earns points, what costs them, and every flagged ingredient with the reason.`,
  }
}

const band = (s: number) =>
  s >= 85 ? { label: 'Excellent', cls: 'excellent' }
  : s >= 70 ? { label: 'Good', cls: 'good' }
  : s >= 50 ? { label: 'Fair', cls: 'fair' }
  : s >= 30 ? { label: 'Below Average', cls: 'below' }
  : { label: 'Low Quality', cls: 'low' }

export default async function FoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const f = getFood(slug)
  if (!f) notFound()

  const b = band(f.score)
  const similar = foods.filter((x) => x.brand === f.brand && x.slug !== f.slug).slice(0, 4)
  /**
   * Topics that explain this food's own breakdown. Before this, a food page
   * could say "Poor omega ratio (est. ~12:1)" with nowhere to click, and 38%
   * of them (single-product brands) had no outbound link at all — dead ends on
   * the exact pages search traffic lands on.
   */
  const explainers = explainersFor(f.breakdown)

  return (
    <>
      <style>{`
        .wrap { max-width: 760px; margin: 0 auto; padding: 40px 20px 70px; }
        .crumb a:hover { color: var(--green); }
        .hero { display: flex; align-items: center; gap: 20px; margin-bottom: 8px; }
        .big { flex: none; width: 92px; height: 92px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--surface); }
        .big b { font-size: 34px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
        .big span { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; opacity: .9; margin-top: 3px; }
        .excellent { background: var(--score-excellent); } .good { background: var(--score-good); } .fair { background: var(--score-fair); }
        .below { background: var(--score-below); } .low { background: var(--score-low); }
        .brand { font-size: 12.5px; font-weight: 700; color: var(--green); text-transform: uppercase; letter-spacing: 0.5px; }
        .fmt { font-size: 14px; color: var(--text-muted); }
        .row { display: flex; justify-content: space-between; gap: 14px; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 14.5px; }
        .row:last-child { border-bottom: none; }
        .row .v { font-weight: 700; font-variant-numeric: tabular-nums; flex: none; }
        .plus { color: var(--score-excellent); } .minus { color: var(--score-low); }
        .flagcard { background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--score-low); border-radius: 10px; padding: 12px 14px; margin-bottom: 9px; }
        .flagcard .n { font-size: 14.5px; font-weight: 700; }
        .flagcard .s { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--score-low); letter-spacing: .4px; }
        .flagcard .r { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; margin-top: 5px; }
        .pill.bad { border-color: color-mix(in srgb, var(--score-low) 35%, var(--border)); color: var(--score-low); background: color-mix(in srgb, var(--score-low) 7%, var(--surface)); }
        .pill.great { border-color: color-mix(in srgb, var(--score-excellent) 35%, var(--border)); color: var(--score-excellent); background: var(--green-pale); }
        .also { display: grid; gap: 8px; }
        .also a { display: flex; align-items: center; gap: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 11px; padding: 10px 13px; font-size: 14px; }
        .also .sc { flex: none; width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: var(--surface); font-weight: 800; font-size: 15px; }
        .learn { margin-top: 30px; border-top: 2px solid var(--text); padding-top: 18px; }
        .learn h2 { margin-top: 0; }
        .learn p.sub { font-size: 13.5px; color: var(--text-muted); margin: 0 0 14px; line-height: 1.6; }
        .learn ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 9px; }
        .learn a { display: flex; align-items: center; gap: 13px; background: var(--surface);
          border: 1px solid var(--border); border-radius: 14px; padding: 13px 15px;
          text-decoration: none; color: inherit; transition: border-color .2s, transform .2s; }
        .learn a:hover { border-color: var(--leaf-bright); transform: translateX(3px); }
        .learn .n { flex: none; width: 27px; height: 27px; border-radius: 50%;
          background: linear-gradient(135deg, var(--leaf-bright), var(--leaf));
          color: #fff; font-size: 13px; font-weight: 800; display: grid; place-items: center; }
        .learn .t { font-size: 14.5px; font-weight: 700; flex: 1; line-height: 1.4; }
        .learn .arr { color: var(--leaf); font-weight: 800; flex: none; }
        .appcta { margin-top: 26px; background: var(--leaf-wash); border: 1px solid var(--leaf-bright);
          border-radius: 16px; padding: 20px 22px; }
        .appcta h3 { font-family: Georgia, serif; font-size: 20px; margin: 0 0 6px; line-height: 1.25; }
        .appcta p { font-size: 14px; color: var(--text-muted); margin: 0 0 14px; line-height: 1.6; max-width: 56ch; }
        .appcta a { display: inline-flex; align-items: center; gap: 8px; background: var(--leaf);
          color: #fff; font-size: 15px; font-weight: 800; padding: 12px 22px; border-radius: 999px;
          text-decoration: none; }
        .appcta a:hover { filter: brightness(1.08); }
        .appcta .free { display: block; font-size: 12px; color: var(--text-faint); margin-top: 9px; }
        .disc { margin-top: 34px; padding: 15px 17px; background: var(--cream-dark); border: 1px solid var(--border); border-radius: 12px; font-size: 12.5px; line-height: 1.75; color: var(--text-muted); }
      `}</style>

      <div className="wrap">
        <p className="crumb">
          <Link href="/">Common Sense Dog</Link> · <Link href="/foods">Food database</Link> · {f.brand}
        </p>

        <div className="hero">
          <div className={`big ${b.cls}`}><b>{f.score}</b><span>{b.label}</span></div>
          <div>
            <div className="brand">{f.brand}</div>
            <h1>{f.name}</h1>
            <p className="fmt">{f.format}</p>
          </div>
        </div>

        <h2>Why this score</h2>
        <div>
          {f.breakdown.map((line, i) => (
            <div className="row" key={i}>
              <span>{line.label}</span>
              <span className={`v ${line.value > 0 ? 'plus' : 'minus'}`}>
                {line.value > 0 ? '+' : ''}{line.value}
              </span>
            </div>
          ))}
        </div>

        {f.flagged.length > 0 && (
          <>
            <h2>Ingredients to watch ({f.flagged.length})</h2>
            {f.flagged.map((x, i) => (
              <div className="flagcard" key={i}>
                <div className="n">{x.name} <span className="s">{x.severity}</span></div>
                {x.reason && <p className="r">{x.reason}</p>}
              </div>
            ))}
          </>
        )}

        {(f.organs.length > 0 || f.produce.length > 0) && (
          <>
            <h2>What it does well</h2>
            <div className="pills">
              {f.organs.map((o) => <span className="pill great" key={o}>🫀 {o}</span>)}
              {f.produce.map((p) => <span className="pill great" key={p}>🥦 {p}</span>)}
            </div>
          </>
        )}

        <h2>Full ingredient list</h2>
        <div className="pills">
          {f.ingredients.map((ing, i) => {
            const bad = f.flagged.some((x) => ing.toLowerCase().includes(x.name.toLowerCase()))
            const good = [...f.organs, ...f.produce].some((g) => ing.toLowerCase().includes(g.toLowerCase()))
            return (
              <span className={`pill${bad ? ' bad' : good ? ' great' : ''}`} key={i}>
                {i + 1}. {ing}
              </span>
            )
          })}
        </div>

        {similar.length > 0 && (
          <>
            <h2>More from {f.brand}</h2>
            <div className="also">
              {similar.map((s) => (
                <Link href={`/foods/${s.slug}`} key={s.slug}>
                  <span className={`sc ${band(s.score).cls}`}>{s.score}</span>
                  <span>{s.name}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        {explainers.length > 0 && (
          <div className="learn">
            <h2>Why this food scored the way it did</h2>
            <p className="sub">
              Each of these explains one line of the breakdown above — what it means, and what
              to do about it.
            </p>
            <ol>
              {explainers.map((e, i) => (
                <li key={e.slug}>
                  <Link href={`/library/${e.slug}`}>
                    <span className="n">{i + 1}</span>
                    <span className="t">{e.label}</span>
                    <span className="arr" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="appcta">
          <h3>Now check the bag you actually own</h3>
          <p>
            This page covers one food. PawGrade scores whatever is in your cupboard — point it at
            the ingredient panel and it reads the label, scores it the same way, and tells you
            what to add to the bowl.
          </p>
          <a href="https://apps.apple.com/app/id6760376540">Get PawGrade — free <span aria-hidden="true">→</span></a>
          <span className="free">Free, no account needed to scan.</span>
        </div>

        <p className="disc">
          <strong>For informational and educational purposes only.</strong> This score reflects
          general and holistic pet-nutrition research applied to the published ingredient list. It
          does not diagnose, treat, cure or prevent any disease or condition, is not veterinary
          advice, and creates no veterinarian-client-patient relationship. Ingredient lists change
          without notice — always check the bag. Always consult a licensed veterinarian before
          changing your dog&apos;s diet.
        </p>
      </div>
    </>
  )
}
