'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Rocket, 
  ShieldCheck, 
  FileJson, 
  Archive,
  Palette,
  Layout,
  Search,
  Settings
} from 'lucide-react'

const COMMANDS = [
  { id: 'deploy', label: 'Deploy to Netlify', icon: Rocket, category: 'Project' },
  { id: 'qa', label: 'Run QA Audit', icon: ShieldCheck, category: 'Project' },
  { id: 'export', label: 'Export Report', icon: FileJson, category: 'Project' },
  { id: 'archive', label: 'Archive Project', icon: Archive, category: 'Project' },
  { id: 'design', label: 'Design System', icon: Palette, category: 'Design' },
  { id: 'layout', label: 'Change Layout', icon: Layout, category: 'Design' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'Workspace' },
]

export const SlashCommandMenu = ({ onSelect }: { onSelect: (cmd: string) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute bottom-full left-0 right-0 mb-4 bg-bg-base border border-border-low rounded-modal shadow-2xl overflow-hidden z-50 max-h-[300px] overflow-y-auto"
    >
      <div className="p-3 border-b border-border-low bg-bg-sunken/50 flex items-center gap-2">
        <Search size={14} className="text-text-muted" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Slash Commands</span>
      </div>
      
      <div className="p-2">
        {['Project', 'Design', 'Workspace'].map((category) => (
          <div key={category} className="mb-2 last:mb-0">
            <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-primary/60">
              {category}
            </div>
            {COMMANDS.filter(c => c.category === category).map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => onSelect(cmd.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-pill transition-colors group text-left"
              >
                <cmd.icon size={16} className="text-text-muted group-hover:text-primary transition-colors" />
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  {cmd.label}
                </span>
                <span className="ml-auto text-[10px] font-mono text-text-muted opacity-0 group-hover:opacity-100">
                  /{cmd.id}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
