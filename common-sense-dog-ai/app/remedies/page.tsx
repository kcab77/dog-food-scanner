import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CONCERNS } from '@/lib/concerns'

export const metadata: Metadata = {
  title: 'Gentle Fixes — Start With What’s Wrong | Common Sense Dog',
  description:
    'Pick what’s bothering your dog — tummy, skin, joints, calm, teeth, immunity. You’ll get what to try from the kitchen first, then the research behind it.',
}

/**
 * Deliberately almost empty.
 *
 * The first version put all six concerns, fully expanded, on one page — pantry
 * boxes, product cards and link rows stacked three deep, six times over. It
 * read as a wall. The job of this page is to ask one question and get out of
 * the way; everything else moved to /remedies/[concern], which also gives each
 * one a page that can rank on its own.
 */
export default function RemediesIndex() {
  return (
    <>
      <style>{`
        .rx-hero { position: relative; height: 260px; overflow: hidden; }
        .rx-hero img { object-fit: cover; }
        .rx-hero::after { content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(16,40,26,.14) 0%, rgba(16,40,26,.74) 100%); }
        .rx-hero-txt { position: absolute; left: 0; right: 0; bottom: 0; padding: 0 24px 26px;
          max-width: 760px; margin: 0 auto; }
        .rx-kicker { font-size: 11.5px; font-weight: 800; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--leaf-wash); opacity: .9; }
        .rx-hero h1 { font-family: Georgia, serif; font-size: clamp(29px, 5.4vw, 42px);
          line-height: 1.05; color: #fff; margin: 7px 0 0; letter-spacing: -.02em; }

        .rx-wrap { max-width: 760px; margin: 0 auto; padding: 40px 24px 80px; }
        .rx-ask { font-size: 18px; color: var(--text-muted); line-height: 1.6; margin: 0 0 30px;
          max-width: 52ch; }
        .rx-ask b { color: var(--text); font-weight: 700; }

        .rx-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 620px) { .rx-grid { grid-template-columns: 1fr; } }
        .rx-card { display: block; padding: 22px 22px 20px; background: var(--surface);
          border: 1px solid var(--border); border-radius: 18px; text-decoration: none;
          color: inherit; transition: border-color .18s, transform .18s, box-shadow .18s; }
        .rx-card:hover { border-color: var(--leaf-bright); transform: translateY(-2px);
          box-shadow: var(--shadow); }
        .rx-em { font-size: 30px; display: block; line-height: 1; }
        .rx-card h2 { font-family: Georgia, serif; font-size: 22px; margin: 13px 0 5px;
          letter-spacing: -.01em; }
        .rx-card p { font-size: 14px; color: var(--text-muted); line-height: 1.55; margin: 0; }

        .rx-note { margin-top: 36px; font-size: 14px; color: var(--text-muted); line-height: 1.65; }
        .rx-note a { color: var(--leaf); font-weight: 700; }
      `}</style>

      <div className="rx-hero">
        <Image src="/lovable/remedies-flatlay.jpg" alt="Pumpkin, turmeric, coconut oil, kefir, ginger and chamomile on a wooden board"
               fill priority sizes="100vw" />
        <div className="rx-hero-txt">
          <div className="rx-kicker">Gentle fixes</div>
          <h1>Start with what&rsquo;s already in the kitchen.</h1>
        </div>
      </div>

      <div className="rx-wrap">
        <p className="rx-ask">
          <b>What&rsquo;s actually bothering your dog?</b> Pick one and you&rsquo;ll get the cheap
          thing to try first, then the research behind it — and only then something to buy.
        </p>

        <div className="rx-grid">
          {CONCERNS.map((c) => (
            <Link key={c.id} href={`/remedies/${c.id}`} className="rx-card">
              <span className="rx-em" aria-hidden="true">{c.emoji}</span>
              <h2>{c.label}</h2>
              <p>{c.blurb}</p>
            </Link>
          ))}
        </div>

        <p className="rx-note">
          Not sure which? Plenty of it starts in the bowl — <Link href="/foods">check what
          you&rsquo;re feeding</Link>, or browse the full <Link href="/library">Health A–Z</Link>.
        </p>
      </div>
    </>
  )
}
