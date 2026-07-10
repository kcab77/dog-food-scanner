// Builds the unified "Dog Health A-Z" from two sources:
//   - libraryTopics  (synced Obsidian notes -> /library/<slug> reader pages)
//   - blogPosts      (existing articles    -> /blog/<slug>)
import { libraryTopics, type LibraryTopic } from './library-data'
import { blogPosts } from './blog-data'

export interface AZEntry {
  slug: string
  title: string
  summary: string
  letter: string
  emoji: string
  tag: string
  href: string
}

function firstLetter(title: string): string {
  const t = title.replace(/^(the|a|an)\s+/i, '').trim()
  const c = t.charAt(0).toUpperCase()
  return /[A-Z]/.test(c) ? c : '#'
}

export function getAllEntries(): AZEntry[] {
  const notes: AZEntry[] = libraryTopics.map((t) => ({
    slug: t.slug,
    title: t.title,
    summary: t.summary,
    letter: t.letter,
    emoji: t.emoji,
    tag: t.tag,
    href: `/library/${t.slug}`,
  }))
  const blogs: AZEntry[] = blogPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.description,
    letter: firstLetter(p.title),
    emoji: p.emoji,
    tag: p.tag,
    href: `/blog/${p.slug}`,
  }))
  return [...notes, ...blogs].sort((a, b) => a.title.localeCompare(b.title))
}

export function getEntriesByLetter(): { letter: string; entries: AZEntry[] }[] {
  const map = new Map<string, AZEntry[]>()
  for (const e of getAllEntries()) {
    if (!map.has(e.letter)) map.set(e.letter, [])
    map.get(e.letter)!.push(e)
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([letter, entries]) => ({ letter, entries }))
}

export function getActiveLetters(): Set<string> {
  return new Set(getAllEntries().map((e) => e.letter))
}

export function getTopic(slug: string): LibraryTopic | undefined {
  return libraryTopics.find((t) => t.slug === slug)
}

export function getTopicSlugs(): string[] {
  return libraryTopics.map((t) => t.slug)
}
