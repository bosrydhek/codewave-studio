'use client'

import React, { useState } from 'react'

import {
  Settings,
  Package,
  Plus,
  ArrowRight,
  User,
  LogOut,
  Search,
  Sparkles,
  Layers,
  Home,
  Activity,
} from 'lucide-react'
import { cn } from '../lib/utils'
import PromptSuggestions from './PromptSuggestions'
import SkeletonSkills from './SkeletonSkills'
import EmptyState from './EmptyState'
import { ModelSwitcher } from './ModelSwitcher'
import { useQueue } from '../lib/contexts/QueueContext'
import { getAutomatedSuggestions } from '../lib/SuggestionsEngine'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onOpenSettings: () => void
  featuredSkills: any[]
  isSkillsLoading?: boolean
  onInstallSkill: (skill: any) => Promise<void>
  onSelectProvider: (provider: string) => void
  onNewProject: () => void
  projectFiles?: string[]
  activeFile?: string
  activeFileContent?: string
  onViewChange?: (view: 'dashboard' | 'workbench' | 'billing-validation') => void
  currentView?: 'dashboard' | 'workbench' | 'welcome' | 'billing-validation'
}

export default function Sidebar({
  user,
  onOpenSettings,
  featuredSkills,
  isSkillsLoading = false,
  onInstallSkill,
  onSelectProvider,
  onNewProject,
  projectFiles = [],
  activeFile,
  activeFileContent,
  onViewChange,
  currentView,
}: Omit<SidebarProps, 'isOpen' | 'onClose'>) {
  const [prompt, setPrompt] = useState('')
  const [activeTab, setActiveTab] = useState<'build' | 'skills'>('build')
  const [searchQuery, setSearchQuery] = useState('')
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([])
  const [, setIsSuggesting] = useState(false)

  React.useEffect(() => {
    async function fetchDynamic() {
      if (!user?.settings) return
      setIsSuggesting(true)
      const suggestions = await getAutomatedSuggestions(
        {
          files: projectFiles,
          activeFile,
          activeFileContent,
        },
        user.settings,
      )
      setDynamicSuggestions(suggestions)
      setIsSuggesting(false)
    }

    // De-bounce or trigger on significant changes
    const timer = setTimeout(fetchDynamic, 2000)
    return () => clearTimeout(timer)
  }, [projectFiles, activeFile, activeFileContent, user?.settings])

  const getSuggestions = () => {
    if (dynamicSuggestions.length > 0) return dynamicSuggestions

    // Fallback to basic suggestions if engine hasn't loaded or failed
    const p = prompt.toLowerCase()
    if (!p) return ['Create a landing page', 'Build a dashboard', 'Add authentication']

    const suggestions: string[] = []
    if (p.includes('auth') || p.includes('login') || p.includes('user')) {
      suggestions.push('Add Google OAuth', 'Secure with RLS', 'Create login form')
    }
    if (p.includes('ui') || p.includes('css') || p.includes('style') || p.includes('design')) {
      suggestions.push('Make it glassmorphic', 'Use a dark theme', 'Add animations')
    }
    if (p.includes('data') || p.includes('table') || p.includes('list') || p.includes('db')) {
      suggestions.push('Connect to Supabase', 'Add search functionality', 'Enable pagination')
    }

    if (suggestions.length === 0) {
      return ['Improve the UI', 'Add more features', 'Make it responsive']
    }

    return suggestions.slice(0, 3)
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setPrompt((prev) => (prev ? `${prev} ${suggestion}` : suggestion))
  }

  const { enqueuePrompt } = useQueue()

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    enqueuePrompt(prompt)
    setPrompt('')
  }

  const filteredSkills = featuredSkills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="bg-bg-base border-border-low relative z-20 flex h-screen w-full flex-col border-r font-sans md:w-80">
      <div className="p-6">
        <div className="mb-12 flex items-center gap-2">
          <div
            onClick={onNewProject}
            className="bg-text-primary group relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-sm shadow-2xl"
          >
            <div className="btn-primary-gradient absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
            <Plus
              size={20}
              className="text-bg-base relative z-10 transition-transform group-hover:rotate-90"
            />
          </div>
          <span className="text-text-primary font-display text-xl font-bold tracking-tight">
            designwave
          </span>
        </div>

        {/* Home/Dashboard Navigation */}
        <div className="mb-8 space-y-2">
          <button
            onClick={() => onViewChange?.('dashboard')}
            className={cn(
              'group flex w-full items-center gap-4 rounded-base p-3 transition-all',
              currentView === 'dashboard'
                ? 'bg-primary/10 text-primary shadow-sm border border-primary/20'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
            )}
          >
            <Home size={18} className={cn(
              currentView === 'dashboard' ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
            )} />
            <span className="text-sm font-bold tracking-wide uppercase">Dashboard</span>
          </button>
          <button
            onClick={() => onViewChange?.('workbench')}
            className={cn(
              'group flex w-full items-center gap-4 rounded-base p-3 transition-all',
              currentView === 'workbench'
                ? 'bg-primary/10 text-primary shadow-sm border border-primary/20'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
            )}
          >
            <Sparkles size={18} className={cn(
              currentView === 'workbench' ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
            )} />
            <span className="text-sm font-bold tracking-wide uppercase">Active Build</span>
          </button>
          <button
            onClick={() => onViewChange?.('billing-validation')}
            className={cn(
              'group flex w-full items-center gap-4 rounded-base p-3 transition-all',
              currentView === 'billing-validation'
                ? 'bg-primary/10 text-primary shadow-sm border border-primary/20'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
            )}
          >
            <Activity size={18} className={cn(
              currentView === 'billing-validation' ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
            )} />
            <span className="text-sm font-bold tracking-wide uppercase">Billing & Validation</span>
          </button>
        </div>

        <div className="bg-bg-sunken border-border-low rounded-base mb-12 flex border p-1">
          <button
            onClick={() => setActiveTab('build')}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-sm py-2 text-sm font-semibold transition-all',
              activeTab === 'build'
                ? 'bg-bg-surface text-text-primary ring-border-mid shadow-xl ring-1'
                : 'text-text-muted hover:text-text-primary',
            )}
          >
            <Sparkles size={14} />
            Build
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-sm py-2 text-sm font-semibold transition-all',
              activeTab === 'skills'
                ? 'bg-bg-surface text-text-primary ring-border-mid shadow-xl ring-1'
                : 'text-text-muted hover:text-text-primary',
            )}
          >
            <Package size={14} />
            Skills
          </button>
        </div>

        {activeTab === 'build' ? (
          <div className="space-y-10">
            {/* Main Action Section */}
            <div className="space-y-6">
              <h3 className="text-text-muted/90 px-1 text-sm font-bold tracking-widest uppercase">
                New Build
              </h3>
              <div className="group relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="What are we building today?"
                  className="bg-bg-sunken border-border-low text-text-secondary focus:border-border-mid placeholder:text-text-muted/40 min-h-[140px] w-full resize-none rounded-sm border p-5 text-base leading-relaxed shadow-xl transition-all focus:outline-none"
                />
                <div className="absolute right-5 bottom-5 flex items-center gap-3">
                  <ModelSwitcher settings={user?.settings} onSelectProvider={onSelectProvider} />
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className={cn(
                      'btn-primary-gradient text-text-on-primary rounded-pill p-2.5 shadow-lg transition-all active:scale-95',
                      !prompt.trim() ? 'cursor-not-allowed opacity-50' : 'hover:scale-105',
                    )}
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>

                <PromptSuggestions
                  suggestions={getSuggestions()}
                  onSelect={handleSuggestionSelect}
                />
              </div>

              <div className="space-y-4">
                <label className="text-text-muted pl-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                  Configuration
                </label>
                <button
                  onClick={onOpenSettings}
                  className="rounded-base bg-bg-surface border-border-low hover:bg-bg-elevated group flex w-full items-center justify-between border p-4 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-bg-sunken group-hover:bg-bg-base rounded-sm p-2 transition-colors">
                      <Settings size={18} className="text-text-muted" />
                    </div>
                    <span className="text-text-secondary text-base font-medium">
                      Project Settings
                    </span>
                  </div>
                  <div className="bg-success h-2 w-2 rounded-full shadow-[0_0_12px_var(--color-success)]" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-12 duration-500">
            <div className="relative">
              <Search
                size={16}
                className="text-text-muted absolute top-1/2 left-4 -translate-y-1/2"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Explore skills..."
                className="bg-bg-sunken border-border-low rounded-pill text-text-secondary placeholder:text-text-muted focus:border-border-mid w-full border py-4 pr-6 pl-12 text-base shadow-inner focus:outline-none"
              />
            </div>

            <div className="space-y-6">
              <label className="text-text-muted pl-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                Featured Skills
              </label>

              {isSkillsLoading ? (
                <SkeletonSkills />
              ) : filteredSkills.length > 0 ? (
                <div className="grid gap-4">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-card bg-bg-surface border-border-low hover:border-border-mid group relative border p-6 transition-all"
                    >
                      <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => onInstallSkill(skill)}
                          className="bg-text-primary text-bg-base rounded-sm p-2 shadow-2xl transition-transform hover:scale-110"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-bg-sunken text-text-muted group-hover:text-text-primary rounded-sm p-2 transition-colors">
                          <Sparkles size={18} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-text-primary text-base font-semibold">
                            {skill.name}
                          </h4>
                          <p className="text-text-muted mt-2 text-sm leading-relaxed">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Layers}
                  title="No Skills Found"
                  description="We couldn't find any skills matching your search. Try adjusting your filters."
                  actionLabel="Clear Search"
                  onAction={() => setSearchQuery('')}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-border-low bg-bg-base/80 mt-auto border-t p-6 backdrop-blur-3xl">
        <div className="rounded-card bg-bg-surface border-border-low group hover:bg-bg-elevated hover:border-border-mid flex cursor-pointer items-center justify-between border p-4 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-bg-sunken border-border-low relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-sm border shadow-2xl">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="User avatar" className="object-cover w-full h-full" />
              ) : (
                <User size={24} className="text-text-muted" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-text-primary truncate text-xs font-semibold">
                {user?.user_metadata?.full_name || 'Local Developer'}
              </span>
              <span className="text-text-muted truncate text-[10px]">
                Development Mode
              </span>
            </div>
          </div>
          {/* Logout button removed for temporary auth disablement */}
        </div>
      </div>
    </div>
  )
}
