import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

/**
 * Resolve the signed-in user's dog profile from their auth token.
 *
 * The token is VERIFIED server-side and the profile is read from the database —
 * the client never sends profile data. Otherwise anyone could POST an arbitrary
 * "my dog has cancer" profile and steer the answer.
 *
 * Returns null for anonymous callers (no token, bad token, or no profile saved).
 * That path must keep working: app versions already on the App Store don't send a
 * token at all, and scanning without an account is a hard requirement.
 */

// The PawGrade app's Supabase project — where auth users and dog_profiles live.
// Deliberately NOT the NEXT_PUBLIC_SUPABASE_* pair: those point at the website's
// own (older) project, and validating an app-issued token against the wrong
// project's key fails silently, so profiles would never load and nobody would
// notice. Kept as its own env var to make that separation explicit.
const SUPABASE_URL = process.env.APP_SUPABASE_URL || 'https://dyzupdctgejwyuocqbtw.supabase.co'

export type DogProfile = {
  dog_name: string
  breed: string | null
  age: string | null
  weight: string | null
  diet: string | null
  supplements: string | null
  conditions: string | null
  goals: string | null
}

export async function getDogProfileFromRequest(req: NextRequest): Promise<DogProfile | null> {
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
  if (!token) return null

  const anonKey = process.env.APP_SUPABASE_ANON_KEY
  if (!anonKey) {
    console.warn('[dogProfile] APP_SUPABASE_ANON_KEY not set — profiles cannot load')
    return null
  }

  try {
    // Scope the client to the caller's token so RLS enforces "own rows only".
    const sb = createClient(SUPABASE_URL, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data: userData } = await sb.auth.getUser()
    if (!userData?.user) return null // invalid or expired token

    const { data } = await sb
      .from('dog_profiles')
      .select('dog_name, breed, age, weight, diet, supplements, conditions, goals')
      .maybeSingle()

    return (data as DogProfile) ?? null
  } catch {
    return null // never let a profile lookup break the answer
  }
}

/** Render the profile as a prompt block. Omits blank fields so the model isn't fed noise. */
export function profilePromptBlock(p: DogProfile): string {
  const lines: string[] = []
  const add = (label: string, v: string | null) => { if (v?.trim()) lines.push(`- ${label}: ${v.trim()}`) }
  add('Breed', p.breed)
  add('Age', p.age)
  add('Weight', p.weight)
  add('Current diet', p.diet)
  add('Supplements already given', p.supplements)
  add('Health issues', p.conditions)
  add('Owner’s goals', p.goals)

  return `\n\n---\nTHIS OWNER'S DOG — ${p.dog_name}
${lines.length ? lines.join('\n') : '(no further details saved yet)'}

Use this to make the answer specific to ${p.dog_name}: refer to them by name, account for their
health issues, and never suggest a supplement they are already giving. If something in this
profile makes a general recommendation inappropriate for ${p.dog_name}, say so explicitly.
Do not invent details that are not listed here.`
}
