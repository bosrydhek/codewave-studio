'use client'

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  User,
  Layers,
  Home,
  Activity,
  Sliders
} from 'lucide-react'
import { cn } from '../lib/utils'

interface SidebarProps {
  user: any
  onOpenSettings?: () => void
  onNewProject: () => void
  projectFiles?: string[]
  activeFile?: string
  activeFileContent?: string
  onViewChange?: (view: 'dashboard' | 'workbench' | 'billing-validation') => void
  currentView?: 'dashboard' | 'workbench' | 'welcome' | 'billing-validation'
}

export default function Sidebar({
  user,
  onNewProject,
  onViewChange,
  currentView,
}: Omit<SidebarProps, 'isOpen' | 'onClose'>) {
  const navigate = useNavigate()

  return (
    <div className="bg-bg-base border-border-low relative z-20 flex h-screen w-full flex-col border-r font-sans md:w-80 select-none">
      <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
        
        <div className="space-y-8">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <div className="bg-text-primary group-hover:btn-primary-gradient relative flex h-10 w-10 items-center justify-center rounded-sm shadow-2xl transition-all">
                <Plus
                  size={20}
                  className="text-bg-base relative z-10 transition-transform group-hover:rotate-90"
                />
              </div>
              <span className="text-text-primary font-display text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                designwave
              </span>
            </Link>
          </div>

          {/* Create New Brief Action */}
          <div className="pt-2">
            <button
              onClick={onNewProject}
              className="w-full btn-primary-gradient text-text-on-primary flex items-center justify-center gap-2 rounded-base py-3 px-4 font-bold tracking-wide uppercase shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all text-xs cursor-pointer"
            >
              <Plus size={16} />
              <span>Create New Site</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <span className="text-text-muted/80 pl-1 text-[10px] font-bold tracking-widest uppercase block mb-3">
              Navigation
            </span>
            
            <button
              onClick={() => onViewChange?.('dashboard')}
              className={cn(
                'group flex w-full items-center gap-4 rounded-base p-3 transition-all cursor-pointer',
                currentView === 'dashboard'
                  ? 'bg-primary/10 text-primary shadow-sm border border-primary/20'
                  : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
              )}
            >
              <Home size={18} className={cn(
                currentView === 'dashboard' ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
              )} />
              <span className="text-xs font-bold tracking-wide uppercase">Dashboard</span>
            </button>
            
            <button
              onClick={() => onViewChange?.('workbench')}
              className={cn(
                'group flex w-full items-center gap-4 rounded-base p-3 transition-all cursor-pointer',
                currentView === 'workbench'
                  ? 'bg-primary/10 text-primary shadow-sm border border-primary/20'
                  : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
              )}
            >
              <Layers size={18} className={cn(
                currentView === 'workbench' ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
              )} />
              <span className="text-xs font-bold tracking-wide uppercase">Active Build</span>
            </button>
            
            <button
              onClick={() => onViewChange?.('billing-validation')}
              className={cn(
                'group flex w-full items-center gap-4 rounded-base p-3 transition-all cursor-pointer',
                currentView === 'billing-validation'
                  ? 'bg-primary/10 text-primary shadow-sm border border-primary/20'
                  : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
              )}
            >
              <Activity size={18} className={cn(
                currentView === 'billing-validation' ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
              )} />
              <span className="text-xs font-bold tracking-wide uppercase">Billing & Validation</span>
            </button>
          </div>

        </div>

        {/* User Card & Operator Gateway */}
        <div className="border-t border-border-low/40 pt-6 flex flex-col gap-4">
          <button
            onClick={() => navigate('/operator')}
            className="rounded-base bg-bg-surface/50 border border-border-low/60 hover:bg-bg-elevated/70 group flex w-full items-center justify-between p-3 transition-all cursor-pointer shadow-sm hover:border-rose-500/20"
          >
            <div className="flex items-center gap-3">
              <Sliders size={14} className="text-rose-500 group-hover:rotate-12 transition-transform" />
              <span className="text-rose-400 group-hover:text-rose-300 text-xs font-semibold">Operator Console</span>
            </div>
            <div className="bg-success h-1.5 w-1.5 rounded-full shadow-[0_0_12px_var(--color-success)]" />
          </button>

          <div className="rounded-card bg-bg-surface/50 border border-border-low/40 p-3 flex items-center gap-3">
            <div className="bg-bg-sunken border border-border-low flex h-9 w-9 items-center justify-center overflow-hidden rounded-sm">
              <User size={18} className="text-text-muted" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-text-primary truncate text-[11px] font-bold">
                {user?.user_metadata?.full_name || 'Local Builder'}
              </span>
              <span className="text-text-muted truncate text-[9px] uppercase font-mono mt-0.5">
                Freemium Level
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
