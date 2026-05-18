import React from 'react'

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl py-32 px-6">
      <h1 className="text-text-primary font-display mb-12 text-5xl font-normal tracking-tight">Terms of Service</h1>
      <div className="prose prose-invert prose-lg text-text-muted">
        <p>By using Designwave, you agree to these terms.</p>
        <h2 className="text-text-primary mt-12 text-2xl font-bold">1. Usage Rights</h2>
        <p>You maintain ownership of all content created on the platform.</p>
        <h2 className="text-text-primary mt-12 text-2xl font-bold">2. Limitations</h2>
        <p>The service is provided &quot;as is&quot; without warranties.</p>
      </div>
    </div>
  )
}
