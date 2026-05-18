'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldAlert } from 'lucide-react'

interface SandboxModeUIProps {
  isActive: boolean
  onExit: () => void
  children: React.ReactNode
}

export const SandboxModeUI: React.FC<SandboxModeUIProps> = ({ isActive, onExit, children }) => {
  return (
    <div className="relative flex flex-1 flex-col h-full overflow-hidden">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-primary/20 border-b border-primary/30 relative z-50 overflow-hidden backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 md:px-8">
              <div className="flex flex-1 items-center gap-3">
                <span className="bg-primary/20 border border-primary/40 rounded-pill p-1.5 flex items-center justify-center animate-pulse">
                  <ShieldAlert size={14} className="text-primary" />
                </span>
                <p className="text-xs text-text-primary md:text-sm font-medium">
                  <span className="font-bold text-primary">Simulation Active:</span> Running under virtual pricing rules. Values generated are simulated for audit purposes.
                </p>
              </div>
              <button
                onClick={onExit}
                className="text-text-muted hover:text-text-primary bg-white/5 hover:bg-white/10 rounded-sm p-1.5 transition-colors border border-border-low/40"
              >
                <X size={14} />
              </button>
            </div>
            <div className="bg-gradient-to-r from-transparent via-primary/50 to-transparent absolute bottom-0 left-0 right-0 h-[2px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </div>
    </div>
  )
}
