import type { Metadata } from 'next'
import Link from 'next/link'
import HomeChat from './HomeChat'
import { foods } from '@/lib/foods-data'
import { libraryTopics } from '@/lib/library-data'
import { answerPages } from '@/lib/answers-data'

export const metadata: Metadata = {
  title: 'Common Sense Dog — Ask the Holistic Dog Nutrition Assistant',
  description:
    'Ask anything about dog nutrition and get an honest answer. Plus scored dog foods, a health A–Z, and an ingredient checker — built from years of holistic research.',
}

const APP_URL = 'https://apps.apple.com/app/id6760376540'

const band = (s: number) =>
  s >= 85 ? 'excellent' : s >= 70 ? 'good' : s >= 50 ? 'fair' : s >= 30 ? 'below' : 'low'
const bandLabel = (s: number) =>
  s >= 85 ? 'Excellent' : s >= 70 ? 'Good' : s >= 50 ? 'Fair' : s >= 30 ? 'Below' : 'Low'

/**
 * The home page.
 *
 * It used to be an avatar, one headline, the chat box and three lines of text —
 * behind which sat 96 scored foods, 43 health topics and 50 answer pages that a
 * visitor had no way of knowing existed. A front door should show the building.
 *
 * So the counts below are LIVE, read from the data files at build time. They
 * can't overstate what's there and they can't go stale.
 */
export default function Home() {
  const best = foods.filter((f) => f.score >= 70).slice(0, 6)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container hero">
        <p className="eyebrow">Holistic dog nutrition</p>
        <h1>Stop searching. Just ask.</h1>
        <p className="lede">
          One assistant, built from years of holistic research and real primary sources —
          ask it anything instead of digging through forty articles that disagree.
        </p>

        <div style={{ marginTop: 28 }}>
          <HomeChat />
        </div>

        <div className="stats">
          <div className="stat">
            <b>{foods.length}</b>
            <span>foods scored</span>
          </div>
          <div className="stat">
            <b>{libraryTopics.length}</b>
            <span>health topics</span>
          </div>
          <div className="stat">
            <b>{answerPages.length}</b>
            <span>safety answers</span>
          </div>
          <div className="stat">
            <b>{new Set(foods.map((f) => f.brand)).size}</b>
            <span>brands covered</span>
          </div>
        </div>
      </section>

      {/* ── What's here ──────────────────────────────────────────────────── */}
      <section className="container" style={{ paddingBottom: 'var(--gap-xl)' }}>
        <h2 className="rule-amber">What&apos;s here</h2>
        <div className="tool-grid">
          <Link href="/foods" className="card tool">
            <span className="ico">🥣</span>
            <b>Food scores</b>
            <span>
              {foods.length} foods run through the same scoring the app uses. Search a brand — or
              search an ingredient you&apos;re worried about.
            </span>
          </Link>
          <Link href="/library" className="card tool">
            <span className="ico">📖</span>
            <b>Health A–Z</b>
            <span>
              {libraryTopics.length} topics, written plainly. Yeast, leaky gut, lymphoma, GOLPP,
              mineral forms — what to look for and what to do at home.
            </span>
          </Link>
          <Link href="/scan" className="card tool">
            <span className="ico">🔍</span>
            <b>Ingredient checker</b>
            <span>
              Paste any ingredient list and get it graded line by line — no app needed.
            </span>
          </Link>
          <Link href="/answers" className="card tool">
            <span className="ico">🛟</span>
            <b>Safety directory</b>
            <span>
              &ldquo;Can my dog eat…&rdquo; answered straight, with the real toxicology behind it.
            </span>
          </Link>
        </div>
      </section>

      {/* ── The proof: real foods, real scores ───────────────────────────── */}
      <section className="bleed-dark">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Scored by ingredients, not by marketing</p>
              <h2 style={{ marginTop: 6 }}>Foods that actually earn it</h2>
            </div>
            <Link href="/foods">See all {foods.length} →</Link>
          </div>

          <div className="grid">
            {best.map((f) => (
              <Link key={f.slug} href={`/foods/${f.slug}`} className="card card-row">
                <div className={`score s-${band(f.score)}`}>
                  <b>{f.score}</b>
                  <span>{bandLabel(f.score)}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="eyebrow">{f.brand}</div>
                  <div style={{ fontWeight: 600, fontSize: 15.5, lineHeight: 1.35, margin: '2px 0 3px' }}>
                    {f.name}
                  </div>
                  <div className="small muted">{f.format}</div>
                </div>
              </Link>
            ))}
          </div>

          <p className="small muted" style={{ marginTop: 'var(--gap-md)', maxWidth: '62ch' }}>
            A score starts at 60 and moves on what&apos;s actually in the bag — named whole meat and
            organ meat earn, fillers and flagged ingredients cost, and a gentler format earns a bonus
            on top. A low score isn&apos;t a judgement of you. I fed my own dog kibble for six years.
          </p>
        </div>
      </section>

      {/* ── Why trust it ─────────────────────────────────────────────────── */}
      <section className="container" style={{ padding: 'var(--gap-xl) 20px' }}>
        <h2 className="rule-amber">Why trust any of this</h2>
        <div className="tool-grid" style={{ marginTop: 'var(--gap-md)' }}>
          <div className="card tool">
            <span className="ico">📚</span>
            <b>Primary sources, not blog summaries</b>
            <span>
              Claims are checked against the original study — the methods, not the abstract. Where
              the evidence is thin, it says so instead of inventing certainty.
            </span>
          </div>
          <div className="card tool">
            <span className="ico">🌿</span>
            <b>Holistic, and honest about it</b>
            <span>
              Built on the work of vets like Dr. Judy Morgan and Dr. Karen Becker — with clinical
              experience labelled as clinical experience, never dressed up as a trial.
            </span>
          </div>
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="card tool">
            <span className="ico">📱</span>
            <b>Scan a label in the aisle</b>
            <span>
              PawGrade reads any bag and scores it on the spot. Free on the App Store →
            </span>
          </a>
        </div>
      </section>
    </>
  )
}
