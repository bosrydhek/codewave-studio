import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Folder, Sparkles, Sunrise, Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

export interface Project {
  id: string
  name: string
  vertical: string
  roi: number
  price: number
  status: string
  aesthetic: string
  revisionsLeft: number
  updated_at: string
}

const getGreeting = (): { text: string; icon: React.ReactNode } => {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning', icon: <Sunrise size={22} className="text-warning animate-pulse" /> }
  if (hour < 17) return { text: 'Good afternoon', icon: <Sun size={22} className="text-warning animate-pulse" /> }
  return { text: 'Good evening', icon: <Moon size={22} className="text-primary-tint-1" /> }
}

export const Dashboard = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = () => {
      let mockProjects = JSON.parse(localStorage.getItem('designwave_projects') || '[]')
      if (mockProjects.length === 0) {
        // Fallback default demo project
        const defaultProj: Project = {
          id: 'dw-hartwell',
          name: 'Hartwell Properties',
          vertical: 'SaaS / Tech',
          roi: 100000,
          price: 5000,
          status: 'AI Clarifying',
          aesthetic: 'Sleek Glassmorphic',
          revisionsLeft: 3,
          updated_at: new Date().toISOString()
        }
        localStorage.setItem('designwave_projects', JSON.stringify([defaultProj]))
        mockProjects = [defaultProj]
      }
      setProjects(mockProjects)
      setLoading(false)
    }

    fetchProjects()
  }, [])

  const greeting = getGreeting()

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-0 text-text-primary">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Welcome greeting header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border-low/40 pb-6"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-text-muted">
              {greeting.icon}
              <span className="text-sm font-semibold">{greeting.text}, Builder</span>
            </div>
            <h1 className="text-3xl font-display font-semibold">Self-Serve Workspaces</h1>
            <p className="text-text-muted text-xs">
              Manage your active AI synthesis projects and edge-deploying CMS sites.
            </p>
          </div>

          <button
            onClick={() => navigate('/intake')}
            className="btn-primary-gradient group rounded-pill px-6 py-3 flex items-center gap-2 shadow-[0_8px_32px_rgba(var(--color-primary),0.3)] hover:scale-105 active:scale-95 transition-all text-xs font-bold text-text-on-primary self-start md:self-auto"
          >
            <Plus size={16} />
            Launch Onboarding Brief
          </button>
        </motion.div>

        {/* Project Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-text-secondary">Your Onboarded Ventures</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="glass-card h-48 animate-pulse rounded-card" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-low/60 rounded-card bg-bg-sunken/10">
              <Folder size={36} className="text-primary mb-4" />
              <h3 className="text-xl font-bold">No active workspaces</h3>
              <p className="text-text-muted text-xs text-center max-w-sm mt-2 mb-6">
                Ready to build? Onboard your project brief and launch premium dynamic designs in hours.
              </p>
              <button 
                onClick={() => navigate('/intake')} 
                className="btn-primary-gradient rounded-pill px-6 py-3 text-xs font-bold text-text-on-primary flex items-center gap-2 shadow-lg"
              >
                <Sparkles size={16} />
                Get Started
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/portal/${p.id}`)}
                  className="glass-card group cursor-pointer p-6 hover:border-primary/50 border border-border-low/60 rounded-card bg-bg-surface/30 backdrop-blur-md flex flex-col justify-between h-56 transition-colors shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-pill">
                        {p.id}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-pill border ${
                        p.status === 'Done' ? 'border-success text-success bg-success/5' :
                        p.status === 'Escalated' ? 'border-danger text-danger bg-danger/5 animate-pulse' :
                        'border-primary text-primary bg-primary/5'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors m-0 leading-tight">
                        {p.name}
                      </h3>
                      <p className="text-[10px] text-text-muted mt-1">Aesthetics: {p.aesthetic}</p>
                    </div>
                  </div>

                  <div className="border-t border-border-low/40 pt-4 flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <span className="text-[9px] text-text-muted uppercase font-bold block">Escrow Rate</span>
                      <span className="font-mono font-bold text-text-secondary">£{p.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="space-y-1 text-right">
                      <span className="text-[9px] text-text-muted uppercase font-bold block">Revisions</span>
                      <span className="font-bold text-text-secondary">{p.revisionsLeft} left</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
