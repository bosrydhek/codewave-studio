import React from 'react'
import { Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl py-32 px-6">
      <div className="mb-12 flex items-center gap-2">
        <Sparkles className="text-primary" size={32} />
        <h1 className="text-text-primary font-display text-5xl font-normal tracking-tight">About Designwave</h1>
      </div>
      <div className="prose prose-invert prose-lg">
        <p className="text-text-intro text-xl leading-relaxed">
          Designwave is an AI-native website builder designed for the next generation of web orchestration.
          Built on top of Payload 3.0 and Next.js, we provide a premium, high-performance platform for
          creative professionals.
        </p>
        <p className="text-text-muted mt-8">
          Our mission is to simplify the complex while maintaining the highest standards of code quality,
          design aesthetics, and performance optimization.
        </p>
      </div>
    </div>
  )
}
