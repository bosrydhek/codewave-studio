import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Layers, 
  DollarSign 
} from 'lucide-react'

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-text-primary selection:bg-primary/30 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-950 opacity-40 blur-[130px]" />
        <div className="absolute -bottom-[15%] -right-[15%] h-[50%] w-[50%] rounded-full bg-primary-tint-2 opacity-10 blur-[130px]" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 mx-auto max-w-7xl w-full flex items-center justify-between px-6 py-6 border-b border-border-low/40">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-sm p-1.5 text-primary">
            <Cpu size={18} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">designwave</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link 
            to="/operator" 
            className="text-xs text-text-muted hover:text-text-primary font-bold uppercase tracking-wide transition-colors"
          >
            Operator Panel
          </Link>
          <Link 
            to="/dashboard" 
            className="text-xs text-text-muted hover:text-text-primary font-bold uppercase tracking-wide transition-colors"
          >
            Client Dashboard
          </Link>
          <Link 
            to="/intake" 
            className="bg-primary hover:bg-primary/95 text-text-on-primary font-bold px-4 py-2 rounded-pill text-xs shadow-md active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-20 px-6">
        <div className="mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-pill bg-primary/10 px-4 py-2 border border-primary/20 text-xs font-bold text-primary shadow-sm">
            <Sparkles size={14} className="animate-spin-slow" />
            <span>Zero-Human-in-the-Loop MVP Launch</span>
          </div>

          <h1 className="font-display mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl leading-[1.08] text-text-primary">
            AI-Native Premium Web <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-tint-1 to-primary-tint-2 italic font-normal">
              Synthesis in Hours.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-text-intro leading-relaxed">
            Turn structured briefs into production-grade, deployable Payload CMS website layouts autonomously. Dynamic pricing locked directly to your expected return.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
            <Link 
              to="/intake"
              className="w-full sm:w-auto btn-primary-gradient text-text-on-primary hover:scale-105 rounded-pill px-8 py-4 text-base font-bold transition-all shadow-xl flex items-center justify-center gap-2"
            >
              Lock Value Price & Start
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/dashboard"
              className="w-full sm:w-auto border border-border-low/60 hover:bg-bg-elevated text-text-primary rounded-pill px-8 py-4 text-base font-bold transition-all"
            >
              Track Active Portals
            </Link>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="relative z-10 py-12 px-6">
        <div className="mx-auto max-w-7xl bg-bg-sunken/30 border border-border-low/40 rounded-card p-8 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border-low/30">
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-text-primary block font-mono">0 mins</span>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1 block">Sales Calls Needed</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-text-primary block font-mono">£1,500</span>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1 block">Minimum Project Escrow</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-text-primary block font-mono">3 Cycles</span>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1 block">Standard 1-Shot Revisions</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-text-primary block font-mono">100%</span>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1 block">Escrow Release Safety</span>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Serve Pipeline Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Engineered for Complete <span className="text-primary italic">Autonomy.</span>
            </h2>
            <p className="text-text-muted mx-auto max-w-2xl text-sm leading-relaxed">
              No human back-and-forth. High-performance generation pipelines running at edge speed.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Stripe Escrow Value-Pricing',
                description: 'Price scales dynamically between £1,500 and £5,000 based on expected project ROI, held securely in Stripe escrow.',
                icon: DollarSign
              },
              {
                title: 'Claude AI Dynamic Coworker',
                description: 'Our automated clarification loop queries specifications directly if brief ambiguities exist before syntheses.',
                icon: Cpu
              },
              {
                title: 'Draft Canvas Review & Revise',
                description: 'Inspect layout deliverables on the interactive live Canvas. Approve immediately or request 1-shot revision feedback.',
                icon: Layers
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div 
                  key={i} 
                  className="bg-bg-sunken/20 border border-border-low/40 group rounded-card border p-8 transition-all hover:border-primary/30 hover:shadow-2xl flex flex-col justify-between h-64"
                >
                  <div className="bg-primary/5 border border-primary/10 rounded-sm p-2 text-primary w-10 h-10 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-text-primary font-display mb-2 text-lg font-bold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-text-muted text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
