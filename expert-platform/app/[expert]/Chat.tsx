'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Citation = { source_id: string; title: string; url: string | null; type: string; image: string | null }
type Product = { name: string; url: string | null }
type Msg = {
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  products?: Product[]
  emergency?: boolean
  refused?: boolean
}

const DISCLAIMER =
  'Educational information from published content — not veterinary advice. For anything specific to your pet, consult your veterinarian.'

// Titles arrive with the site's own suffix and HTML entities baked in
// ("Cystitis in Dogs &ndash; Dr. Judy Morgan&#39;s Naturally Healthy Pets").
// Strip both so a citation card reads like a headline, not a browser tab.
function cleanTitle(raw: string): string {
  const el = typeof document !== 'undefined' ? document.createElement('textarea') : null
  let t = raw
  if (el) { el.innerHTML = raw; t = el.value }
  return t
    .replace(/\s*[–—|·-]\s*(Dr\.?\s*Judy Morgan|Veterinary Secrets).*$/i, '')
    .replace(/\s*&ndash;.*$/i, '')
    .trim()
}

const TYPE_LABEL: Record<string, string> = {
  post: 'Article', video: 'Video', book: 'Book', wiki: 'Summary', studio: 'Note',
}

export default function Chat({
  expertSlug,
  expertName,
  storeUrl,
  starters = [],
}: {
  expertSlug: string
  expertName: string
  storeUrl: string | null
  starters?: string[]
}) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: trimmed }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expert: expertSlug, message: trimmed, conversationId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      if (data.conversationId) setConversationId(data.conversationId)
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.answer,
          citations: data.citations ?? [],
          products: data.products ?? [],
          emergency: data.emergency,
          refused: data.refused,
        },
      ])
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: `Sorry — ${(e as Error).message}. Please try again.` },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <style jsx global>{`
        :root {
          --paper: #f7f4ee;
          --card: #ffffff;
          --ink: #22271f;
          --ink-2: #55604f;
          --muted: #8a927f;
          --line: #e4e0d6;
          --brand: #2f5d3a;
          --brand-soft: #e8f0e7;
          --accent: #b4712c;
          --accent-soft: #fbf1e3;
          --danger: #a8352a;
          --danger-soft: #fbeae7;
        }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: var(--paper); }
        body {
          color: var(--ink);
          font-family: ui-rounded, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>

      <style jsx>{`
        .page { min-height: 100vh; display: flex; flex-direction: column; }

        /* soft banded background so it doesn't read as a blank white page */
        .page::before {
          content: ''; position: fixed; inset: 0 0 auto 0; height: 340px; z-index: 0;
          background: linear-gradient(180deg, var(--brand-soft) 0%, rgba(232,240,231,0) 100%);
          pointer-events: none;
        }

        .shell { position: relative; z-index: 1; width: 100%; max-width: 720px; margin: 0 auto;
                 padding: 0 18px; display: flex; flex-direction: column; flex: 1; }

        header { padding: 34px 0 18px; text-align: center; }
        .badge { width: 60px; height: 60px; border-radius: 50%; background: var(--card);
                 border: 1px solid var(--line); display: inline-grid; place-items: center;
                 font-size: 27px; box-shadow: 0 4px 14px rgba(34,39,31,.07); }
        h1 { margin: 13px 0 5px; font-size: 25px; letter-spacing: -.02em; color: var(--brand); }
        .tagline { margin: 0; font-size: 14.5px; color: var(--ink-2); }
        .trust { margin-top: 15px; display: flex; flex-wrap: wrap; gap: 7px; justify-content: center; }
        .trust span { font-size: 11.5px; color: var(--ink-2); background: var(--card);
                      border: 1px solid var(--line); border-radius: 20px; padding: 4px 11px; }

        .stream { flex: 1; overflow-y: auto; padding: 8px 0 12px; display: flex;
                  flex-direction: column; gap: 16px; }

        .starters { display: flex; flex-direction: column; gap: 9px; padding-top: 10px; }
        .starters .lbl { font-size: 12px; text-transform: uppercase; letter-spacing: .08em;
                         color: var(--muted); text-align: center; margin-bottom: 3px; }
        .starter { width: 100%; text-align: left; background: var(--card); border: 1px solid var(--line);
                   border-radius: 13px; padding: 13px 15px; font-size: 15px; color: var(--ink);
                   cursor: pointer; font-family: inherit; display: flex; gap: 10px; align-items: center;
                   transition: border-color .14s, transform .14s, box-shadow .14s; }
        .starter:hover { border-color: var(--brand); transform: translateY(-1px);
                         box-shadow: 0 6px 16px rgba(47,93,58,.09); }
        .starter .arrow { margin-left: auto; color: var(--brand); flex: none; }

        .row { display: flex; }
        .row.me { justify-content: flex-end; }
        .bubble-me { max-width: 84%; background: var(--brand); color: #fff; border-radius: 17px 17px 5px 17px;
                     padding: 11px 15px; font-size: 15.5px; line-height: 1.5; }

        .answer { width: 100%; background: var(--card); border: 1px solid var(--line);
                  border-radius: 17px 17px 17px 5px; padding: 17px 19px;
                  box-shadow: 0 3px 16px rgba(34,39,31,.05); }
        .answer.alarm { background: var(--danger-soft); border-color: #f0cdc7; }

        /* rendered markdown — the model writes it, so it must LOOK like it */
        .md { font-size: 15.5px; line-height: 1.68; color: var(--ink); }
        .md :global(p) { margin: 0 0 11px; }
        .md :global(p:last-child) { margin-bottom: 0; }
        .md :global(strong) { font-weight: 700; color: var(--brand); }
        .md :global(ul), .md :global(ol) { margin: 0 0 12px; padding-left: 20px; }
        .md :global(li) { margin-bottom: 6px; }
        .md :global(li::marker) { color: var(--brand); }
        .md :global(h1), .md :global(h2), .md :global(h3) {
          font-size: 16px; margin: 16px 0 7px; color: var(--brand); letter-spacing: -.01em; }
        .md :global(a) { color: var(--brand); }
        .md :global(blockquote) { margin: 0 0 12px; padding-left: 13px;
          border-left: 3px solid var(--brand-soft); color: var(--ink-2); }
        .md :global(code) { background: var(--brand-soft); padding: 1px 5px; border-radius: 4px; font-size: .9em; }
        .md :global(table) { width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 12px; }
        .md :global(th), .md :global(td) { text-align: left; padding: 7px 9px; border-bottom: 1px solid var(--line); }

        .srcs { margin-top: 15px; padding-top: 13px; border-top: 1px solid var(--line); }
        .srcs .lbl { font-size: 11px; text-transform: uppercase; letter-spacing: .09em;
                     color: var(--muted); margin-bottom: 9px; }
        .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 9px; }
        .src { display: flex; gap: 10px; align-items: center; text-decoration: none; color: inherit;
               border: 1px solid var(--line); border-radius: 11px; padding: 8px; background: var(--paper);
               transition: border-color .14s, transform .14s; }
        .src:hover { border-color: var(--brand); transform: translateY(-1px); }
        .thumb { width: 46px; height: 46px; border-radius: 8px; object-fit: cover; flex: none;
                 background: var(--brand-soft); }
        .thumb-fallback { width: 46px; height: 46px; border-radius: 8px; flex: none;
                          background: var(--brand-soft); display: grid; place-items: center; font-size: 18px; }
        .src-meta { min-width: 0; }
        .src-t { font-size: 13px; font-weight: 600; line-height: 1.3; display: -webkit-box;
                 -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .src-k { font-size: 10.5px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin-top: 2px; }

        .shop { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; }
        .shop a { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; font-weight: 600;
                  text-decoration: none; color: #7a4a17; background: var(--accent-soft);
                  border: 1px solid #eeddc4; border-radius: 20px; padding: 7px 13px; }
        .shop a:hover { border-color: var(--accent); }

        .typing { display: inline-flex; gap: 5px; }
        .typing i { width: 7px; height: 7px; border-radius: 50%; background: var(--muted);
                    animation: b 1.2s infinite; }
        .typing i:nth-child(2) { animation-delay: .15s; }
        .typing i:nth-child(3) { animation-delay: .3s; }
        @keyframes b { 0%,60%,100% { opacity:.3; transform: translateY(0) } 30% { opacity:1; transform: translateY(-3px) } }

        .composer { position: sticky; bottom: 0; background: linear-gradient(180deg, rgba(247,244,238,0) 0%, var(--paper) 22%);
                    padding: 12px 0 16px; }
        .bar { display: flex; gap: 9px; align-items: flex-end; background: var(--card);
               border: 1px solid var(--line); border-radius: 22px; padding: 6px 6px 6px 16px;
               box-shadow: 0 4px 18px rgba(34,39,31,.07); }
        textarea { flex: 1; border: none; outline: none; resize: none; background: transparent;
                   font-family: inherit; font-size: 15.5px; color: var(--ink); padding: 9px 0; max-height: 132px; }
        .send { flex: none; border: none; background: var(--brand); color: #fff; width: 40px; height: 40px;
                border-radius: 50%; cursor: pointer; font-size: 17px; display: grid; place-items: center; }
        .send:disabled { opacity: .35; cursor: default; }
        .fine { margin: 9px 0 0; text-align: center; font-size: 11px; color: var(--muted); line-height: 1.5; }

        :global(:focus-visible) { outline: 2px solid var(--brand); outline-offset: 2px; border-radius: 8px; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="shell">
        <header>
          <div className="badge">🐾</div>
          <h1>Ask {expertName}</h1>
          <p className="tagline">Answers from {expertName}’s own published work.</p>
          <div className="trust">
            <span>Only their work — never generic AI</span>
            <span>Sources on every answer</span>
            <span>Says “I don’t know” instead of guessing</span>
          </div>
        </header>

        <div className="stream" ref={scrollRef}>
          {messages.length === 0 && starters.length > 0 && (
            <div className="starters">
              <div className="lbl">Try asking</div>
              {starters.map((s) => (
                <button key={s} className="starter" onClick={() => send(s)}>
                  <span>{s}</span>
                  <span className="arrow">→</span>
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div className="row me" key={i}><div className="bubble-me">{m.content}</div></div>
            ) : (
              <div className="row" key={i}>
                <div className={`answer${m.emergency ? ' alarm' : ''}`}>
                  <div className="md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  </div>

                  {!m.emergency && (m.citations?.length ?? 0) > 0 && (
                    <div className="srcs">
                      <div className="lbl">
                        From {m.citations!.length} of {expertName}’s {m.citations!.length === 1 ? 'pieces' : 'pieces'}
                      </div>
                      <div className="cards">
                        {m.citations!.map((c) => {
                          const Tag = c.url ? 'a' : 'div'
                          return (
                            <Tag
                              key={c.source_id}
                              {...(c.url ? { href: c.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                              className="src"
                            >
                              {c.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  className="thumb" src={c.image} alt="" loading="lazy"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                                />
                              ) : (
                                <div className="thumb-fallback">{c.type === 'video' ? '▶' : '📄'}</div>
                              )}
                              <div className="src-meta">
                                <div className="src-t">{cleanTitle(c.title)}</div>
                                <div className="src-k">{TYPE_LABEL[c.type] ?? 'Source'}</div>
                              </div>
                            </Tag>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {(m.products?.length ?? 0) > 0 && (
                    <div className="shop">
                      {m.products!.map((p) => (
                        <a key={p.name} href={p.url ?? storeUrl ?? '#'} target="_blank" rel="noopener noreferrer">
                          <span aria-hidden="true">🛒</span> {p.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ),
          )}

          {loading && (
            <div className="row">
              <div className="answer">
                <span className="typing" aria-label="Thinking"><i /><i /><i /></span>
              </div>
            </div>
          )}
        </div>

        <div className="composer">
          <form className="bar" onSubmit={(e) => { e.preventDefault(); send(input) }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
              }}
              rows={1}
              placeholder={`Ask ${expertName} anything…`}
              aria-label={`Ask ${expertName} a question`}
            />
            <button className="send" type="submit" disabled={loading || !input.trim()} aria-label="Send">↑</button>
          </form>
          <p className="fine">{DISCLAIMER}</p>
        </div>
      </div>
    </div>
  )
}
