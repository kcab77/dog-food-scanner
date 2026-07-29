'use client'

import { useEffect, useRef, useState } from 'react'

type Citation = { source_id: string; title: string; url: string | null; type: string }
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
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4">
      {/* Header */}
      <header className="pt-8 pb-4 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
          🐾
        </div>
        <h1 className="font-serif text-2xl font-bold text-emerald-900">Ask {expertName}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Answers in {expertName}’s own words, from {expertName}’s published work.
        </p>
        <div className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-neutral-400">
          <span className="inline-flex items-center gap-1">
            <span className="text-emerald-600">✓</span> Only {expertName}’s own work — never generic AI knowledge
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="text-emerald-600">✓</span> Cites the source every time
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="text-emerald-600">✓</span> Says “I don’t know” instead of guessing
          </span>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto py-4">
        {messages.length === 0 && starters.length > 0 && (
          <div className="space-y-3 pt-6">
            <p className="text-center text-sm text-neutral-400">Try asking…</p>
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="block w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left text-[15px] text-neutral-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={
                m.role === 'user'
                  ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-700 px-4 py-2.5 text-[15px] text-white'
                  : `max-w-[90%] rounded-2xl rounded-bl-sm px-4 py-3 text-[15px] leading-relaxed ${
                      m.emergency
                        ? 'border border-red-200 bg-red-50 text-red-900'
                        : 'border border-neutral-200 bg-white text-neutral-800'
                    }`
              }
            >
              <p className="whitespace-pre-wrap">{m.content}</p>

              {m.role === 'assistant' && !m.emergency && (m.citations?.length ?? 0) > 0 && (
                <div className="mt-3 border-t border-neutral-100 pt-2">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                    Source{(m.citations?.length ?? 0) > 1 ? 's' : ''}
                  </p>
                  <ul className="space-y-1">
                    {m.citations!.map((c) => (
                      <li key={c.source_id} className="text-[13px]">
                        {c.url ? (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 underline decoration-emerald-200 underline-offset-2 hover:decoration-emerald-500"
                          >
                            {c.title}
                          </a>
                        ) : (
                          <span className="text-neutral-600">{c.title}</span>
                        )}
                        <span className="ml-1 text-[11px] uppercase text-neutral-400">· {c.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {m.role === 'assistant' && (m.products?.length ?? 0) > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.products!.map((p) => (
                    <a
                      key={p.name}
                      href={p.url ?? storeUrl ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-amber-50 px-3 py-1 text-[13px] font-medium text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
                    >
                      🛒 {p.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-neutral-200 bg-white px-4 py-3">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 bg-[var(--paper)] pb-5 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            rows={1}
            placeholder={`Ask ${expertName} anything…`}
            className="max-h-32 flex-1 resize-none rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-[15px] outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-2xl bg-emerald-700 px-5 py-3 text-[15px] font-semibold text-white transition disabled:opacity-40"
          >
            Ask
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] leading-snug text-neutral-400">{DISCLAIMER}</p>
      </div>
    </div>
  )
}
