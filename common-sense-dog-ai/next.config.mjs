/** @type {import('next').NextConfig} */
const nextConfig = {
  // 301-redirect old WordPress URLs to their new answer pages so Google
  // transfers the existing ranking instead of hitting a 404 (dead link).
  // Add a line here for every old ranking URL you want to recover.
  async redirects() {
    return [
      { source: '/milk-thistle', destination: '/answers/milk-thistle-for-dogs', permanent: true },
      { source: '/milk-thistle/', destination: '/answers/milk-thistle-for-dogs', permanent: true },
      { source: '/apples', destination: '/answers/can-dogs-eat-apples', permanent: true },
      { source: '/apples/', destination: '/answers/can-dogs-eat-apples', permanent: true },
      // Old WP category archive has no single equivalent page — send to the blog
      // index (the closest real "browse everything" hub) rather than 404.
      { source: '/category/disease-sickness-medicine', destination: '/blog', permanent: true },
      { source: '/category/disease-sickness-medicine/', destination: '/blog', permanent: true },
    ]
  },
}
export default nextConfig
