'use client'

import React, { useEffect, useState } from 'react'
import { Rocket, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react'

interface WelcomeViewProps {
  fullName: string
  onGetStarted: () => void
}

export default function WelcomeView({ fullName, onGetStarted }: WelcomeViewProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-bg-base relative flex min-h-screen items-center justify-center overflow-hidden p-6 font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-950 opacity-50 blur-[120px]" />
      <div className="bg-primary-tint-2/5 absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full opacity-30 blur-[120px]" />

      <div
        className={`w-full max-w-xl transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
      >
        <div className="group relative">
          {/* Main Glass Card */}
          <div className="bg-bg-surface/40 border-border-low rounded-modal relative z-10 overflow-hidden border p-12 shadow-2xl backdrop-blur-3xl">
            {/* Success Icon Animation */}
            <div className="mb-10 flex justify-center">
              <div className="relative">
                <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-2xl" />
                <div className="btn-primary-gradient relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-110">
                  <ShieldCheck size={44} className="text-text-on-primary" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <span className="text-primary bg-primary/10 rounded-pill border-primary/20 border px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] uppercase">
                  Account Created
                </span>
                <h1 className="text-text-primary font-display pt-4 text-4xl font-normal tracking-tighter md:text-5xl">
                  Welcome,{' '}
                  <span className="from-text-primary via-text-primary to-text-primary/40 bg-gradient-to-r bg-clip-text text-transparent">
                    {fullName.split(' ')[0]}
                  </span>
                </h1>
              </div>

              <p className="text-text-muted mx-auto max-w-sm text-lg leading-relaxed italic">
                Your professional creative environment is being provisioned. Ready to build the
                future?
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 py-6">
                {[
                  { icon: <Zap size={14} />, text: 'AI Powered' },
                  { icon: <Globe size={14} />, text: 'Cloud Edge' },
                  { icon: <Rocket size={14} />, text: 'Auto Deploy' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-bg-sunken border-border-low rounded-pill text-text-muted flex items-center gap-2 border px-4 py-2 text-xs font-semibold"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={onGetStarted}
                className="btn-primary-gradient text-text-on-primary rounded-pill group/btn flex w-full items-center justify-center gap-3 py-5 text-base font-bold shadow-[0_20px_50px_rgba(var(--color-primary),0.1)] transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <span>Enter Workspace</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Decorative Gradient Overlay */}
            <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-white/10 to-transparent blur-3xl" />
          </div>

          {/* Card Glow Effect */}
          <div className="from-primary/20 via-primary-tint-2/20 rounded-modal absolute -inset-1 bg-gradient-to-tr to-indigo-500/20 opacity-30 blur transition duration-1000 group-hover:opacity-60" />
        </div>

        <p className="text-text-muted mt-12 text-center text-[10px] font-medium tracking-[0.2em] uppercase">
          Powered by Designwave 2026 Engine
        </p>
      </div>
    </div>
  )
}
