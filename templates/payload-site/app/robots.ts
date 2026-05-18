import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app/', '/admin/'],
    },
    sitemap: 'https://designwave-nine.vercel.app/sitemap.xml',
  }
}
