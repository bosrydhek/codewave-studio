'use client'

import React, { useState, useEffect } from 'react'
import {
  Home,
  FolderKanban,
  Layers,
  Palette,
  Settings,
  Github,
  Plus,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface DashboardSidebarProps {
  user: {
    email?: string | null
    avatar_url?: string | null
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  } | null
  onNewProject: () => void
}

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
}

export function DashboardSidebar({ user, onNewProject }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth < 768
    return false
  })

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      if (mobile) setCollapsed(true)
    }
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleLogout = async () => {
    window.location.href = '/'
  }

  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: <Home size={18} />, href: '/app/dashboard/', active: true },
    { label: 'All Projects', icon: <FolderKanban size={18} />, href: '/app/projects/' },
    { label: 'Workspaces', icon: <Layers size={18} />, href: '/app/dashboard/' },
    { label: 'Design Systems', icon: <Palette size={18} />, href: '/app/dashboard/' },
    { label: 'Settings', icon: <Settings size={18} />, href: '/app/dashboard/' },
  ]

  const avatarUrl = user?.user_metadata?.avatar_url || user?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <aside
      className={cn(
        'bg-bg-base border-border-low relative z-20 flex h-full flex-col border-r font-sans transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-72',
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center gap-3 p-5', collapsed ? 'justify-center' : '')}>
        <button
          onClick={onNewProject}
          className="bg-text-primary group relative flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-sm shadow-2xl"
          title="New Project"
        >
          <div className="btn-primary-gradient absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
          <Plus
            size={20}
            className="text-bg-base relative z-10 transition-transform group-hover:rotate-90"
          />
        </button>
        {!collapsed && (
          <span className="text-text-primary font-display text-xl font-bold tracking-tight">
            designwave
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              'group flex items-center gap-3 rounded-base px-3 py-2.5 text-sm font-semibold transition-all',
              item.active
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary border border-transparent',
              collapsed ? 'justify-center px-0' : '',
            )}
            title={collapsed ? item.label : undefined}
          >
            <span
              className={cn(
                'flex-shrink-0',
                item.active
                  ? 'text-primary'
                  : 'text-text-muted group-hover:text-text-primary',
              )}
            >
              {item.icon}
            </span>
            {!collapsed && (
              <span className="tracking-wide uppercase text-[11px]">{item.label}</span>
            )}
          </Link>
        ))}

        {/* GitHub Status */}
        <div
          className={cn(
            'mt-6 flex items-center gap-3 rounded-base px-3 py-2.5 text-sm font-semibold text-text-muted',
            collapsed ? 'justify-center px-0' : '',
          )}
        >
          <Github size={18} className="flex-shrink-0" />
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wide">GitHub</span>
              <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]" />
            </div>
          )}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="text-text-muted hover:text-text-primary hover:bg-bg-surface border-border-low mx-3 mb-3 flex items-center justify-center rounded-base border py-2 transition-all"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* User Profile */}
      <div className="border-border-low bg-bg-base/80 border-t p-3 backdrop-blur-3xl">
        <div
          className={cn(
            'rounded-card bg-bg-surface border-border-low group hover:bg-bg-elevated hover:border-border-mid flex cursor-pointer items-center border p-3 transition-all',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          <div className={cn('flex items-center', collapsed ? '' : 'gap-3')}>
            <div className="bg-bg-sunken border-border-low relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm border shadow-lg">
              {avatarUrl ? (
                <img src={avatarUrl} alt="User avatar" className="object-cover w-full h-full" />
              ) : (
                <User size={18} className="text-text-muted" />
              )}
            </div>
            {!collapsed && (
              <div className="flex min-w-0 flex-col">
                <span className="text-text-primary truncate text-xs font-bold tracking-tight">
                  {displayName}
                </span>
                <span className="text-text-muted max-w-[140px] truncate text-[10px] font-medium">
                  {user?.email || 'Offline'}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-text-muted hover:text-error hover:bg-error/10 rounded-sm p-2 opacity-0 transition-all group-hover:opacity-100"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
