import { createClient } from '@supabase/supabase-js'

// Server-only client using the SERVICE ROLE key. Never import this into a
// client component — the service role bypasses RLS. Every public request is
// mediated by our own server routes, which hard-scope queries to one expert.
export function serviceClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key, { auth: { persistSession: false } })
}

export type Expert = {
  id: string
  name: string
  slug: string
  persona_prompt: string
  store_base_url: string | null
}

export async function getExpertBySlug(slug: string): Promise<Expert | null> {
  const sb = serviceClient()
  const { data } = await sb
    .from('experts')
    .select('id, name, slug, persona_prompt, store_base_url')
    .eq('slug', slug)
    .maybeSingle()
  return data
}
