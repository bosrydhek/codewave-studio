import { Sparkles } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="animate-in fade-in slide-in-from-top-4 mb-6 inline-flex items-center gap-2 rounded-pill bg-primary/10 px-4 py-2 text-sm font-bold text-primary duration-1000">
            <Sparkles size={16} />
            <span>Design the future of the web</span>
          </div>
          <h1 className="text-text-primary font-display animate-in fade-in slide-in-from-top-6 mx-auto mb-8 max-w-4xl text-5xl font-normal tracking-tight duration-1000 delay-100 sm:text-7xl">
            AI-Native Web <span className="italic opacity-80">Orchestration.</span>
          </h1>
          <p className="text-text-intro animate-in fade-in slide-in-from-top-8 mx-auto mb-12 max-w-2xl text-xl leading-relaxed duration-1000 delay-200">
            Designwave combines the power of a headless CMS with cutting-edge AI to help you build,
            deploy, and scale premium web experiences in record time.
          </p>
          <div className="animate-in fade-in slide-in-from-top-10 duration-1000 delay-300">
            <Link 
              to="/dashboard"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-8 py-4 text-lg font-medium transition-colors shadow-lg"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="text-text-primary font-display mb-4 text-4xl font-normal tracking-tight sm:text-5xl">
              Engineered for <span className="text-primary italic">Excellence.</span>
            </h2>
            <p className="text-text-muted mx-auto max-w-2xl text-lg">
              Every detail is optimized for speed, accessibility, and professional-grade performance.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'AI Orchestration',
                description: 'Leverage the latest LLMs to generate content, structure, and code patterns seamlessly.',
              },
              {
                title: 'Headless CMS Core',
                description: 'Built on top of Payload 3.0 for robust data management and enterprise-grade security.',
              },
              {
                title: 'Edge Performance',
                description: 'Deployed globally on Vercel with optimized caching and minimal latency.',
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-bg-base border-border-low group rounded-modal border p-8 transition-all hover:border-primary/30 hover:shadow-2xl"
              >
                <h3 className="text-text-primary font-display mb-4 text-xl font-bold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
