import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'
import { getTopicSlugs } from '@/lib/library'
import { getAnswerSlugs } from '@/lib/answers-data'
import { foods } from '@/lib/foods-data'

const BASE = 'https://commonsensedog.com'

// Dynamic sitemap — lists every public page so Google can discover them all.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/scan`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/answers`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/foods`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/library`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/recommended`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/chat`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const posts: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const topics: MetadataRoute.Sitemap = getTopicSlugs().map((slug) => ({
    url: `${BASE}/library/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const answers: MetadataRoute.Sitemap = getAnswerSlugs().map((slug) => ({
    url: `${BASE}/answers/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // The food pages are the highest-intent pages on the site — someone searching
  // "is <brand> good for dogs" has already decided to evaluate a bag. They were
  // live and returning 200 for weeks while being absent from here, which meant
  // Google had no way to find any of them. Priority sits at answers-level for
  // that reason.
  const foodPages: MetadataRoute.Sitemap = foods.map((f) => ({
    url: `${BASE}/foods/${f.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticPages, ...posts, ...topics, ...answers, ...foodPages]
}
