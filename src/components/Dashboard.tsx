import React, { useState, useEffect } from 'react'
import { Plus, MoreVertical, Folder, ArrowRight, Sparkles, Sunrise, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSupabaseClient } from '@/lib/supabase'

export interface Workspace {
  id: string
  name: string
}

export interface Project {
  id: string
  workspace_id: string
  name: string
  status: string
  config: any
  updated_at: string
}

const getGreeting = (): { text: string; icon: React.ReactNode } => {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning', icon: <Sunrise size={24} className="text-warning" /> }
  if (hour < 17) return { text: 'Good afternoon', icon: <Sun size={24} className="text-warning" /> }
  return { text: 'Good evening', icon: <Moon size={24} className="text-primary-tint-1" /> }
}

const ProjectCard = ({ project, onOpen }: { project: Project, onOpen: (id: string) => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card group relative cursor-pointer p-6 hover:border-primary/50 transition-colors"
      onClick={() => onOpen(project.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">
            Project
          </span>
          <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors m-0 leading-tight">
            {project.name}
          </h3>
        </div>
        <button
          className="text-text-muted hover:text-text-primary transition-colors"
          aria-label="Project options"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border-low/50">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-[10px] font-bold uppercase bg-primary/10 text-primary">
          {project.status}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
          {new Date(project.updated_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </div>
      </div>
    </motion.div>
  )
}

export const Dashboard = ({ onNewProject, onOpenProject }: { onNewProject: () => void, onOpenProject: (id: string) => void }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null)

  useEffect(() => {
    const sb = getSupabaseClient()
    sb.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user)
    })

    const fetchData = async () => {
      // In a real implementation we would fetch from Supabase
      // const { data: wData } = await sb.from('workspaces').select('*')
      // const { data: pData } = await sb.from('projects').select('*')
      
      // Stubbing data for MVP UI testing
      setWorkspaces([{ id: 'default', name: 'My Workspace' }])
      setProjects([
        { id: '1', workspace_id: 'default', name: 'Hartwell Property', status: 'planning', config: {}, updated_at: new Date().toISOString() },
      ])
      setLoading(false)
    }

    fetchData()
  }, [])

  const greeting = getGreeting()
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

  return (
    <div className="flex-1 overflow-y-auto p-8 pt-10 pb-16 relative z-0">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            {greeting.icon}
            <h1 className="text-3xl font-display m-0">{greeting.text}, {displayName}</h1>
          </div>
          <p className="text-text-muted max-w-lg text-sm">
            Manage your workspaces and projects. Build Payload CMS apps faster.
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-text-primary m-0">Recent Projects</h2>
          <button
            onClick={onNewProject}
            className="btn-primary-gradient group rounded-pill px-5 py-2.5 flex items-center gap-2 shadow-[0_8px_32px_rgba(var(--color-primary),0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18} className="text-text-on-primary" />
            <span className="font-bold text-text-on-primary text-sm">New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (<div key={i} className="glass-card h-48 animate-pulse" />))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-8 glass-card border-dashed border-2 bg-transparent">
            <Folder size={36} className="text-primary mb-6" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">No projects yet</h2>
            <p className="text-text-muted text-center max-w-md mb-8 text-sm">
              Start your first project to begin building your Payload CMS site.
            </p>
            <button onClick={onNewProject} className="btn-primary-gradient rounded-pill px-8 py-4 flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all">
              <Sparkles size={20} className="text-text-on-primary" />
              <span className="font-bold text-text-on-primary text-lg">Create Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={onOpenProject} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
