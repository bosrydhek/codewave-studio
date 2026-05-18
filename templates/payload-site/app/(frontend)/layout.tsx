/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Providers } from '@/components/Providers'
import '@/index.css'

import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://designwave-nine.vercel.app'),
  description: 'Designwave is an AI-native website builder powered by Payload 3.0 and Next.js. Create stunning, high-performance web experiences effortlessly.',
  title: {
    default: 'Designwave | AI Website Builder',
    template: '%s | Designwave',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Designwave | AI Website Builder',
    description: 'Designwave is an AI-native website builder powered by Payload 3.0 and Next.js. Create stunning, high-performance web experiences effortlessly.',
    url: 'https://designwave-nine.vercel.app',
    siteName: 'Designwave',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Designwave AI Website Builder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Designwave | AI Website Builder',
    description: 'Designwave is an AI-native website builder powered by Payload 3.0 and Next.js. Create stunning, high-performance web experiences effortlessly.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex min-h-screen flex-col antialiased bg-bg-base text-text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-pill focus:bg-primary focus:px-6 focus:py-3 focus:text-text-on-primary focus:font-bold focus:shadow-xl focus:outline-none"
        >
          Skip to content
        </a>
        <Providers>
          <div className="sr-only" aria-hidden="true">
            <span>Designwave</span>
          </div>
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <footer className="border-border-low mt-auto border-t py-12 px-6">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
                <div className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
                  <span className="bg-text-primary text-bg-base flex h-8 w-8 items-center justify-center rounded-sm">
                    D
                  </span>
                  Designwave
                </div>
                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-text-muted">
                  <a href="/about" className="hover:text-text-primary transition-colors">
                    About
                  </a>
                  <a href="/privacy" className="hover:text-text-primary transition-colors">
                    Privacy
                  </a>
                  <a href="/terms" className="hover:text-text-primary transition-colors">
                    Terms
                  </a>
                  <a href="/contact" className="hover:text-text-primary transition-colors">
                    Contact
                  </a>
                </nav>
              </div>
              <div className="mt-8 pt-8 border-t border-border-low flex flex-col items-center justify-between gap-4 text-xs text-text-muted sm:flex-row">
                <p>&copy; {new Date().getFullYear()} Designwave AI. Built with Payload & Next.js.</p>
                <div className="flex items-center gap-6">
                  <a href="https://twitter.com/designwave" className="hover:text-text-primary transition-colors">
                    Twitter
                  </a>
                  <a href="https://github.com/designwave" className="hover:text-text-primary transition-colors">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
