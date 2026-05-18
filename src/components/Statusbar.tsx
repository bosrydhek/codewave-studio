'use client'

import React, { useState, useEffect } from 'react'
import {
  Database,
  Github,
  Rocket,
  ShieldCheck,
  Search,
  RefreshCw,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface SystemStatus {
  component: string
  status: 'healthy' | 'warning' | 'error'
  message: string | null
  last_checked_at: string
}

interface StatusItemProps {
  label: string
  status: 'healthy' | 'warning' | 'error'
  icon: React.ReactNode
  message?: string | null
  onClick?: () => void
}

const StatusItem = ({ label, status, icon, message, onClick }: StatusItemProps) => {
  const statusColors = {
    healthy: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  }

  const dotColors = {
    healthy: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  }

  return (
    <button
      onClick={onClick}
      title={message || label}
      className="flex items-center gap-2 px-3 py-1 text-[11px] font-medium transition-colors hover:bg-white/5 whitespace-nowrap group"
    >
      <span className={cn('flex items-center gap-1.5', statusColors[status])}>
        {icon}
        <span
          className={cn('h-1.5 w-1.5 rounded-full', dotColors[status], {
            'animate-pulse': status !== 'healthy',
          })}
        />
      </span>
      <span className="text-text-muted group-hover:text-text-secondary transition-colors uppercase tracking-wider">
        {label}
      </span>
    </button>
  )
}

const COMPONENT_ICONS: Record<string, React.ReactNode> = {
  'Research Engine': <Search size={14} />,
  Supabase: <Database size={14} />,
  'GitHub Sync': <Github size={14} />,
  'Deploy Agent': <Rocket size={14} />,
  'QA Agent': <ShieldCheck size={14} />,
  'Learning Cycle': <RefreshCw size={14} />,
}

export const Statusbar = () => {
  const [statuses, setStatuses] = useState<SystemStatus[]>([])
  const [lastSync, setLastSync] = useState<string>('Loading...')

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('system_status')
          .select('component, status, message, last_checked_at')
          .order('component')

        if (error) {
          console.error('[Statusbar] Error fetching statuses:', error)
          return
        }

        if (data && mounted) {
          setStatuses(data as SystemStatus[])
          setLastSync(
            new Date().toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          )
        }
      } catch (err) {
        console.error('[Statusbar] Fetch error:', err)
      }
    }

    load()
    const interval = setInterval(load, 60_000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  // Fallback to static data if fetch hasn't loaded yet
  const displayStatuses =
    statuses.length > 0
      ? statuses
      : [
          { component: 'Research Engine', status: 'healthy' as const, message: null, last_checked_at: '' },
          { component: 'Supabase', status: 'healthy' as const, message: null, last_checked_at: '' },
          { component: 'GitHub Sync', status: 'healthy' as const, message: null, last_checked_at: '' },
          { component: 'Deploy Agent', status: 'healthy' as const, message: null, last_checked_at: '' },
          { component: 'QA Agent', status: 'healthy' as const, message: null, last_checked_at: '' },
          { component: 'Learning Cycle', status: 'healthy' as const, message: null, last_checked_at: '' },
        ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-7 bg-bg-sunken border-t border-border-low flex items-center justify-between px-4 backdrop-blur-md select-none overflow-x-auto no-scrollbar">
      <div className="flex items-center divide-x divide-border-low/30">
        {displayStatuses.map((s) => (
          <StatusItem
            key={s.component}
            label={s.component}
            status={s.status}
            message={s.message}
            icon={COMPONENT_ICONS[s.component] || <Database size={14} />}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 text-[11px] text-text-muted px-3 border-l border-border-low/30">
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>Last sync: {lastSync}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono opacity-60">
          <span>v1.108.0</span>
        </div>
      </div>
    </div>
  )
}
