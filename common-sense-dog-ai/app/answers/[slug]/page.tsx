import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAnswer, getAnswerSlugs } from '@/lib/answers-data'

export function generateStaticParams() {
  return getAnswerSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = getAnswer(params.slug)
  if (!a) return {}
  return {
    title: `${a.title} — Common Sense Dog`,
    description: a.metaDescription,
    alternates: { canonical: `https://commonsensedog.com/answers/${a.slug}` },
  }
}

export default function AnswerPage({ params }: { params: { slug: string } }) {
  const a = getAnswer(params.slug)
  if (!a) notFound()

  // FAQPage structured data → eligible for Google FAQ rich results.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --green: #2A5C2E; --green-pale: #EDF4EE; --cream: #FDFAF5; --border: #E2D9CA; --text: #1A1A1A; --muted: #6B6B6B; --white: #fff; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--cream); color: var(--text); }
        .top { display: flex; justify-content: center; padding: 22px; }
        .brand { display: flex; align-items: center; gap: 9px; text-decoration: none; }
        .brand-name { font-size: 15px; font-weight: 700; color: var(--green); }
        .wrap { max-width: 680px; margin: 0 auto; padding: 8px 24px 64px; }
        .tag { display: inline-block; background: var(--green-pale); color: var(--green); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 5px 13px; border-radius: 20px; }
        .emoji { font-size: 46px; display: block; margin: 22px 0 12px; }
        h1 { font-family: Georgia, serif; font-size: clamp(26px, 4vw, 38px); line-height: 1.2; margin-bottom: 18px; }
        .lead { font-size: 18px; line-height: 1.7; color: #333; margin-bottom: 14px; }
        /* The prominent funnel into the AI — the whole point of the page */
        .cta { background: linear-gradient(135deg, #2A5C2E, #1E4422); border-radius: 18px; padding: 26px; text-align: center; margin: 34px 0; }
        .cta h2 { font-family: Georgia, serif; color: #fff; font-size: 21px; margin-bottom: 8px; }
        .cta p { color: rgba(255,255,255,0.75); font-size: 15px; margin-bottom: 18px; line-height: 1.6; }
        .cta-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .btn { display: inline-block; text-decoration: none; font-weight: 700; font-size: 15px; border-radius: 11px; padding: 13px 22px; }
        .btn-primary { background: #fff; color: var(--green); }
        .btn-ghost { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.3); }
        .faq { margin-top: 30px; }
        .faq h2 { font-family: Georgia, serif; font-size: 22px; margin-bottom: 6px; }
        .faq-sub { color: var(--muted); font-size: 14px; margin-bottom: 18px; }
        .qa { border-top: 1px solid var(--border); padding: 20px 0; }
        .qa h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
        .qa p { font-size: 15.5px; line-height: 1.75; color: #333; }
        .disclaimer { font-size: 12px; color: var(--muted); font-style: italic; margin-top: 34px; text-align: center; line-height: 1.7; }
        .disclaimer a { color: var(--green); }
      `}</style>

      {/* Minimal top — just the logo home. No nav, no browsing, no overwhelm. */}
      <div className="top">
        <Link href="/" className="brand">
          <span style={{ fontSize: 20 }}>🐾</span>
          <span className="brand-name">Common Sense Dog</span>
        </Link>
      </div>

      <div className="wrap">
        <span className="tag">{a.tag}</span>
        <span className="emoji">{a.emoji}</span>
        <h1>{a.title}</h1>
        <p className="lead">{a.lead}</p>

        <div className="cta">
          <h2>Ask about your own dog</h2>
          <p>Get a straight answer for your dog’s exact situation — or scan their food in seconds.</p>
          <div className="cta-row">
            <Link href="/chat" className="btn btn-primary">Ask the AI assistant →</Link>
            <Link href="/scan" className="btn btn-ghost">Scan a dog food</Link>
          </div>
        </div>

        <div className="faq">
          <h2>Quick answers</h2>
          <p className="faq-sub">The essentials. For anything specific to your dog, just ask the assistant above.</p>
          {a.faqs.map((f, i) => (
            <div className="qa" key={i}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>

        <p className="disclaimer">
          Educational only — not veterinary advice. Always work with your vet, especially if your dog is on medication.<br />
          <Link href="/chat">Ask the Common Sense Dog assistant →</Link>
        </p>
      </div>
    </>
  )
}
