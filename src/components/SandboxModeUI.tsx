'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FlaskConical, X } from 'lucide-react'

interface SandboxModeUIProps {
  children: React.ReactNode
  isActive: boolean
  onExit?: () => void
}

export const SandboxModeUI = ({ children, isActive, onExit }: SandboxModeUIProps) => {
  if (!isActive) return <>{children}</>

  return (
    <div className="relative min-h-screen">
      {/* Sandbox Visual Indicator */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-[100] h-12 bg-amber-500 flex items-center justify-center gap-4 shadow-lg pointer-events-none"
      >
        <div className="flex items-center gap-2">
          <FlaskConical size={18} className="text-bg-base animate-pulse" />
          <span className="text-bg-base font-bold tracking-[0.2em] uppercase text-xs">
            SANDBOX MODE — Synthetic Simulation Active
          </span>
        </div>
        <div className="pointer-events-auto">
          <button 
            onClick={onExit}
            className="flex items-center gap-1 bg-bg-base/20 hover:bg-bg-base/40 text-bg-base px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all"
          >
            Exit Sandbox
            <X size={12} />
          </button>
        </div>
      </motion.div>

      {/* Background Tint */}
      <div className="absolute inset-0 bg-amber-500/5 pointer-events-none z-10" />

      {/* Content */}
      <div className="pt-12">
        {children}
      </div>

      {/* Floating Corner Badge */}
      <div className="fixed bottom-8 right-8 z-[100] pointer-events-none">
         <div className="bg-amber-500 text-bg-base px-4 py-2 rounded-card shadow-2xl flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-bg-base animate-ping" />
            <span className="text-xs font-black tracking-widest uppercase italic">Simulation Live</span>
         </div>
      </div>
    </div>
  )
}
