import { serviceClient } from '@/lib/supabase'
import Link from 'next/link'

// Reads live data — render on demand, never prerender at build.
export const dynamic = 'force-dynamic'

// Simple index: lists the experts that exist. Each expert's public assistant
// lives at /<slug>. This is the template's "front door"; in production each
// expert would more likely embed their own assistant on their own site.
export default async function Home() {
  let experts: { name: string; slug: string }[] = []
  try {
    const sb = serviceClient()
    const { data } = await sb.from('experts').select('name, slug').order('name')
    experts = data ?? []
  } catch {
    // env not configured yet — show nothing rather than crash
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-serif text-3xl font-bold text-emerald-900">Expert Assistants</h1>
      <p className="mt-2 text-neutral-500">
        AI assistants that answer in an expert’s own voice, from their own published work.
      </p>
      <ul className="mt-8 space-y-3">
        {experts.map((e) => (
          <li key={e.slug}>
            <Link
              href={`/${e.slug}`}
              className="block rounded-xl border border-neutral-200 bg-white px-4 py-3 font-medium text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              Ask {e.name} →
            </Link>
          </li>
        ))}
        {experts.length === 0 && (
          <li className="text-sm text-neutral-400">No experts configured yet.</li>
        )}
      </ul>
    </main>
  )
}
