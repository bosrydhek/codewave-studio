import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl py-32 px-6">
      <h1 className="text-text-primary font-display mb-12 text-5xl font-normal tracking-tight">Privacy Policy</h1>
      <div className="prose prose-invert prose-lg text-text-muted">
        <p>Your privacy is important to us. This policy outlines how we handle your data.</p>
        <h2 className="text-text-primary mt-12 text-2xl font-bold">1. Data Collection</h2>
        <p>We collect minimal data required to provide our services, primarily email for authentication.</p>
        <h2 className="text-text-primary mt-12 text-2xl font-bold">2. Data Usage</h2>
        <p>Your data is used solely for service provision and improvement.</p>
      </div>
    </div>
  )
}
