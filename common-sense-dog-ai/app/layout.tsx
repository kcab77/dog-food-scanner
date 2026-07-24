import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const BASE = 'https://commonsensedog.com'
const TITLE = 'Common Sense Dog — Ask the Holistic Dog Nutrition Assistant'
const DESC =
  'Stop searching. Just ask. A holistic dog nutrition AI assistant built from years of research — get honest answers on food, ingredients, supplements, and health instead of digging through articles.'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: TITLE,
  description: DESC,
  applicationName: 'Common Sense Dog',
  keywords: [
    'holistic dog nutrition',
    'dog food ingredients',
    'is grain free safe',
    'dog food checker',
    'best dog food',
    'dog supplements',
    'holistic vet advice',
  ],
  alternates: { canonical: BASE },
  verification: { google: 'Ekjt05OYu1JsiVxnQ1RNO6EoNWp0n5iam3dJCwgCI60' },
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><text y='32' font-size='32'>🐾</text></svg>" },
  openGraph: {
    type: 'website',
    siteName: 'Common Sense Dog',
    url: BASE,
    title: TITLE,
    description: DESC,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
  },
  robots: { index: true, follow: true },
}

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Common Sense Dog',
  url: BASE,
  description: 'Holistic dog nutrition and health — an AI assistant, ingredient checker, and research library.',
}

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Common Sense Dog',
  url: BASE,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/library?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
        <Analytics />
      </body>
    </html>
  )
}
