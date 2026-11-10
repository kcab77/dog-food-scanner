import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CONCERNS } from '@/lib/concerns'
import { getTopic } from '@/lib/library'
import { partners, AFFILIATE_DISCLOSURE } from '@/lib/partners'

export const metadata: Metadata = {
  title: 'Gentle Fixes, by What’s Wrong | Common Sense Dog',
  description:
    'Pick what’s actually bothering your dog — tummy, skin, joints, calm, teeth, immunity — and get what to try from the kitchen first, then the research behind it.',
}

export default function RemediesPage() {
  const byId = Object.fromEntries(partners.map((p) => [p.id, p]))

  return (
    <>
      <style>{`
        .rm-hero { position: relative; margin-bottom: 8px; }
        .rm-hero-img { position: relative; height: 290px; overflow: hidden; }
        .rm-hero-img img { object-fit: cover; }
        .rm-hero-img::after { content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(16,40,26,.18) 0%, rgba(16,40,26,.72) 100%); }
        .rm-hero-txt { position: absolute; left: 0; right: 0; bottom: 0; padding: 0 24px 26px;
          max-width: 980px; margin: 0 auto; }
        .rm-kicker { font-size: 11.5px; font-weight: 800; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--leaf-wash); opacity: .92; }
        .rm-hero h1 { font-family: Georgia, serif; font-size: clamp(30px, 5.6vw, 46px);
          line-height: 1.04; color: #fff; margin: 7px 0 0; letter-spacing: -.02em; }
        .rm-hero p { color: rgba(255,255,255,.86); font-size: 16px; margin: 9px 0 0;
          max-width: 56ch; line-height: 1.55; }

        .rm-wrap { max-width: 980px; margin: 0 auto; padding: 30px 24px 70px; }
        .rm-jump { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 34px; }
        .rm-jump a { display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px;
          border-radius: 999px; border: 1px solid var(--border); background: var(--surface);
          font-size: 14.5px; font-weight: 700; text-decoration: none; color: var(--text);
          transition: border-color .16s, background .16s; }
        .rm-jump a:hover { border-color: var(--leaf-bright); background: var(--leaf-wash); }

        .concern { scroll-margin-top: 80px; padding-top: 10px; margin-bottom: 44px; }
        .concern-head { display: flex; align-items: baseline; gap: 11px; flex-wrap: wrap;
          border-bottom: 2px solid var(--text); padding-bottom: 9px; }
        .concern-head h2 { font-family: Georgia, serif; font-size: 27px; margin: 0; letter-spacing: -.01em; }
        .concern-head .em { font-size: 24px; }
        .concern-blurb { font-size: 15px; color: var(--text-muted); margin: 11px 0 0; line-height: 1.6; max-width: 62ch; }

        .rm-cols { display: grid; grid-template-columns: 1.15fr 1fr; gap: 26px; margin-top: 18px; }
        @media (max-width: 760px) { .rm-cols { grid-template-columns: 1fr; gap: 20px; } }
        .rm-sub { font-size: 11.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;
          color: var(--leaf); margin: 0 0 10px; }

        .pantry { list-style: none; margin: 0; padding: 0; display: grid; gap: 9px; }
        .pantry li { background: var(--leaf-tint); border-left: 3px solid var(--leaf-bright);
          border-radius: 0 10px 10px 0; padding: 11px 14px; }
        .pantry b { font-size: 14.5px; display: block; }
        .pantry span { font-size: 13px; color: var(--text-muted); line-height: 1.5; display: block; margin-top: 2px; }

        .reads { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; }
        .reads a { display: flex; align-items: center; gap: 10px; padding: 10px 13px;
          background: var(--surface); border: 1px solid var(--border); border-radius: 11px;
          text-decoration: none; color: inherit; transition: border-color .16s, transform .16s; }
        .reads a:hover { border-color: var(--leaf-bright); transform: translateX(3px); }
        .reads .e { font-size: 17px; flex: none; }
        .reads .t { font-size: 14px; font-weight: 600; flex: 1; line-height: 1.35; }
        .reads .arr { color: var(--leaf); font-weight: 800; }

        .picks { margin-top: 16px; display: grid; gap: 10px; }
        .pick { display: flex; gap: 12px; align-items: flex-start; background: var(--surface);
          border: 1px solid var(--border); border-radius: 13px; padding: 13px 15px; }
        .pick .bub { flex: none; width: 40px; height: 40px; border-radius: 50%;
          background: var(--leaf-wash); display: grid; place-items: center; font-size: 20px; }
        .pick b { font-size: 14.5px; }
        .pick p { font-size: 12.5px; color: var(--text-muted); margin: 2px 0 0; line-height: 1.5; }
        .pick a { display: inline-block; margin-top: 8px; background: var(--amber); color: #fff;
          font-size: 13px; font-weight: 800; padding: 7px 14px; border-radius: 999px; text-decoration: none; }

        .rm-foot { margin-top: 30px; padding: 20px 22px; background: var(--leaf-wash);
          border: 1px solid var(--leaf-bright); border-radius: 16px; }
        .rm-foot h3 { font-family: Georgia, serif; font-size: 19px; margin: 0 0 5px; }
        .rm-foot p { font-size: 14px; color: var(--text-muted); margin: 0 0 13px; line-height: 1.6; }
        .rm-foot a.cta { display: inline-flex; gap: 7px; background: var(--leaf); color: #fff;
          font-size: 14.5px; font-weight: 800; padding: 11px 20px; border-radius: 999px; text-decoration: none; }
        .disclose { font-size: 11.5px; color: var(--text-faint); line-height: 1.55; margin-top: 18px; }
      `}</style>

      <div className="rm-hero">
        <div className="rm-hero-img">
          <Image src="/lovable/remedies-flatlay.jpg" alt="Pumpkin, turmeric, coconut oil, kefir, ginger and chamomile on a wooden board"
                 fill priority sizes="100vw" />
        </div>
        <div className="rm-hero-txt">
          <div className="rm-kicker">Gentle fixes</div>
          <h1>Start with what&rsquo;s already in the kitchen.</h1>
          <p>Pick what&rsquo;s actually bothering your dog. You&rsquo;ll get the cheap thing to try
            first, then the research behind it — and only then something to buy.</p>
        </div>
      </div>

      <div className="rm-wrap">
        <nav className="rm-jump" aria-label="Jump to a concern">
          {CONCERNS.map((c) => (
            <a key={c.id} href={`#${c.id}`}><span aria-hidden="true">{c.emoji}</span>{c.label}</a>
          ))}
        </nav>

        {CONCERNS.map((c) => {
          const topics = c.topics.map((s) => ({ slug: s, t: getTopic(s) })).filter((x) => x.t)
          const picks = c.products.map((id) => byId[id]).filter(Boolean)
          return (
            <section className="concern" id={c.id} key={c.id}>
              <div className="concern-head">
                <span className="em" aria-hidden="true">{c.emoji}</span>
                <h2>{c.label}</h2>
              </div>
              <p className="concern-blurb">{c.blurb}</p>

              <div className="rm-cols">
                <div>
                  <p className="rm-sub">Try this first</p>
                  <ul className="pantry">
                    {c.pantry.map((p) => (
                      <li key={p.item}><b>{p.item}</b><span>{p.why}</span></li>
                    ))}
                  </ul>
                  {picks.length > 0 && (
                    <>
                      <p className="rm-sub" style={{ marginTop: 20 }}>If you want to buy something</p>
                      <div className="picks">
                        {picks.map((p) => (
                          <div className="pick" key={p.id}>
                            <span className="bub" aria-hidden="true">{p.emoji}</span>
                            <div>
                              <b>{p.name}</b>
                              <p>{p.blurb}</p>
                              <a href={p.url} target="_blank" rel="nofollow sponsored noopener">View on Amazon →</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <p className="rm-sub">Read the research</p>
                  <ul className="reads">
                    {topics.map(({ slug, t }) => (
                      <li key={slug}>
                        <Link href={`/library/${slug}`}>
                          <span className="e" aria-hidden="true">{t!.emoji}</span>
                          <span className="t">{t!.title}</span>
                          <span className="arr" aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )
        })}

        <div className="rm-foot">
          <h3>Half of this starts in the bowl</h3>
          <p>
            Before changing supplements, check what you&rsquo;re already feeding. PawGrade scores a
            dog food 0–100 from its ingredient list and tells you what to add.
          </p>
          <a className="cta" href="https://apps.apple.com/app/id6760376540">Get PawGrade — free <span aria-hidden="true">→</span></a>
        </div>

        <p className="disclose">{AFFILIATE_DISCLOSURE}</p>
        <p className="disclose">
          <strong>Educational only — not veterinary advice.</strong> Blood in the stool, sustained
          weight loss, a hard swollen belly, or a dog genuinely off food needs a vet now, not a
          longer supplement list.
        </p>
      </div>
    </>
  )
}
