import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getExpertBySlug } from '@/lib/supabase'
import { getStarters } from '@/lib/starters'
import Chat from './Chat'

// Resolves the expert from the live DB per request — do not prerender.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { expert: string } }): Promise<Metadata> {
  const expert = await getExpertBySlug(params.expert)
  if (!expert) return { title: 'Not found' }
  return {
    title: `Ask ${expert.name}`,
    description: `An AI assistant that answers in ${expert.name}'s voice, from ${expert.name}'s own published work.`,
  }
}

export default async function ExpertAssistant({ params }: { params: { expert: string } }) {
  const expert = await getExpertBySlug(params.expert)
  if (!expert) notFound()

  return (
    <Chat
      expertSlug={expert.slug}
      expertName={expert.name}
      storeUrl={expert.store_base_url}
      starters={getStarters(expert.slug)}
    />
  )
}
