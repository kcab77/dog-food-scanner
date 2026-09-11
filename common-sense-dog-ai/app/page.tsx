import type { Metadata } from 'next'
import Link from 'next/link'
import HomeChat from './HomeChat'

export const metadata: Metadata = {
  title: 'Common Sense Dog — Ask the Holistic Dog Nutrition Assistant',
  description:
    'Stop searching. Just ask. One holistic dog nutrition AI assistant, built from years of research — ask it anything instead of digging through articles.',
}

const APP_URL = 'https://apps.apple.com/app/id6760376540'

export default function Home() {
  return (
    <>
      <style>{`

        .nav-links a:hover { color: var(--green); }

        .top { max-width: 760px; margin: 0 auto; padding: 44px 20px 60px; text-align: center; }
        .avatar { width: 64px; height: 64px; border-radius: 50%; background: var(--green-pale); border: 2px solid #D4E6D5; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 18px; }
        .sub { font-size: 17px; color: var(--text-muted); line-height: 1.55; max-width: 540px; margin: 0 auto 30px; }

        .trust { background: var(--cream-dark); border-top: 1px solid var(--border); padding: 28px 20px; }
        .trust-inner { max-width: 880px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .trust-item { text-align: center; font-size: 14px; color: var(--text); line-height: 1.5; }
        .trust-item span { display: block; font-size: 22px; margin-bottom: 6px; }
        .trust-item a { color: var(--green); font-weight: 700; text-decoration: none; }

        footer a { color: rgba(255,255,255,0.75); text-decoration: none; }
        footer .links { margin-bottom: 10px; }
        footer .disclaimer { max-width: 760px; margin: 0 auto 16px; font-size: 12px; line-height: 1.8; color: rgba(255,255,255,0.5); text-align: left; }
        footer .disclaimer strong { color: rgba(255,255,255,0.78); }

        @media (max-width: 640px) { .nav-links a:not(.nav-cta) { display: none; } .trust-inner { grid-template-columns: 1fr; gap: 14px; } }
      `}</style>

      <section className="top">
        <div className="avatar">🐾</div>
        <h1>Stop searching. Just ask.</h1>
        <p className="sub">One holistic dog nutrition assistant, built from years of research — ask it anything instead of digging through articles.</p>
        <HomeChat />
      </section>

      <section className="trust">
        <div className="trust-inner">
          <div className="trust-item"><span>📚</span>Backed by holistic vet sources — Dr. Judy Morgan & Dr. Karen Becker–style, research-cited.</div>
          <div className="trust-item"><span>🧠</span>Years of holistic dog-nutrition research, distilled into one assistant.</div>
          <div className="trust-item"><span>📱</span>Want to scan a label? <a href={APP_URL} target="_blank" rel="noopener noreferrer">Get the free PawGrade app →</a></div>
        </div>
      </section>
    </>
  )
}
