import React from 'react'
import { Mail } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl py-32 px-6">
      <h1 className="text-text-primary font-display mb-12 text-5xl font-normal tracking-tight">Contact Us</h1>
      <div className="prose prose-invert prose-lg">
        <p className="text-text-intro text-xl leading-relaxed">
          Have questions or feedback? We&apos;d love to hear from you.
        </p>
        <div className="mt-12 flex items-center gap-4 text-text-primary">
          <Mail className="text-primary" size={24} />
          <a href="mailto:hello@designwave-nine.vercel.app" className="hover:underline">
            hello@designwave-nine.vercel.app
          </a>
        </div>
      </div>
    </div>
  )
}
