import type { MetadataRoute } from 'next'

// Tells crawlers they're welcome and where the sitemap lives. API routes blocked.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: 'https://commonsensedog.com/sitemap.xml',
    host: 'https://commonsensedog.com',
  }
}
