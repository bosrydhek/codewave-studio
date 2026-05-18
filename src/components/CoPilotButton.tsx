'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { CoPilotDrawer } from './CoPilotDrawer'

export const CoPilotButton = ({ userId }: { userId?: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-12 right-8 z-[60] w-14 h-14 rounded-full bg-primary-gradient flex items-center justify-center shadow-2xl shadow-primary/40 group"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping group-hover:animate-none" />
        <Zap className="text-text-on-primary fill-current" size={24} />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 px-3 py-1.5 bg-bg-base border border-border-low rounded-pill shadow-xl text-[10px] font-bold uppercase tracking-widest text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Ask Fred
        </div>
      </motion.button>

      <CoPilotDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        userId={userId}
      />
    </>
  )
}
