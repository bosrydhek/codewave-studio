'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Sliders, 
  ShieldAlert, 
  Play,
  Pause,
  DollarSign,
  Send
} from 'lucide-react'

interface SystemLog {
  id: string
  time: string
  source: 'Claude AI' | 'Stripe Gateway' | 'System Edge' | 'Operator Override'
  message: string
}

export function OperatorPanel() {
  const navigate = useNavigate()
  
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProjId, setSelectedProjId] = useState<string>('')
  const [priceTweakValue, setPriceTweakValue] = useState<number>(3000)
  const [directMsg, setDirectMsg] = useState('')
  const [operatorLogs, setOperatorLogs] = useState<SystemLog[]>([
    { id: 'l-1', time: new Date().toLocaleTimeString(), source: 'System Edge', message: 'Operator panel connected' },
    { id: 'l-2', time: new Date().toLocaleTimeString(), source: 'Claude AI', message: 'Active generation pipeline running: queue idle' }
  ])

  // Load projects from local storage or create mock default
  useEffect(() => {
    const fetchProj = () => {
      const mockProjects = JSON.parse(localStorage.getItem('designwave_projects') || '[]')
      if (mockProjects.length === 0) {
        // Populate standard default for demo
        const defaultProj = {
          id: 'dw-hartwell',
          name: 'Hartwell Properties',
          vertical: 'SaaS / Tech',
          roi: 100000,
          price: 5000,
          status: 'AI Clarifying',
          aesthetic: 'Sleek Glassmorphic',
          integrations: ['stripe'],
          audience: 'Modern property searchers',
          updated_at: new Date().toISOString(),
          revisionsLeft: 3,
          clarifications: [
            {
              id: 'clar-1',
              question: 'Can you specify your primary competitor websites so our styling algorithm extracts standard conversion patterns?',
              answered: false,
              answer: ''
            }
          ],
          logs: [
            { time: '12:00:00', message: 'Brief Ingest Completed.' },
            { time: '12:01:05', message: 'Escrow payment pre-authorized via Stripe.' }
          ]
        }
        localStorage.setItem('designwave_projects', JSON.stringify([defaultProj]))
        setProjects([defaultProj])
        setSelectedProjId('dw-hartwell')
      } else {
        setProjects(mockProjects)
        setSelectedProjId(mockProjects[0].id)
      }
    }
    
    fetchProj()
  }, [])

  const selectedProj = projects.find(p => p.id === selectedProjId)

  // Save changes locally
  const saveProjects = (updatedList: any[]) => {
    setProjects(updatedList)
    localStorage.setItem('designwave_projects', JSON.stringify(updatedList))
  }

  // Tweak Price Value
  const applyPriceTweak = () => {
    if (!selectedProj) return
    const updated = projects.map(p => {
      if (p.id === selectedProjId) {
        return {
          ...p,
          price: priceTweakValue,
          logs: [...p.logs, { time: new Date().toLocaleTimeString(), message: `Operator manually tweaked price to £${priceTweakValue}` }]
        }
      }
      return p
    })
    saveProjects(updated)
    addSystemLog('Operator Override', `Tweaked price lock for ${selectedProj.name} to £${priceTweakValue}`)
  }

  // Override Status
  const applyStatusOverride = (newStatus: string) => {
    if (!selectedProj) return
    const updated = projects.map(p => {
      if (p.id === selectedProjId) {
        return {
          ...p,
          status: newStatus,
          // Reset revisions if force-releasing
          revisionsLeft: newStatus === 'AI Clarifying' ? 3 : p.revisionsLeft,
          logs: [...p.logs, { time: new Date().toLocaleTimeString(), message: `Operator manually shifted status to "${newStatus}"` }]
        }
      }
      return p
    })
    saveProjects(updated)
    addSystemLog('Operator Override', `Status override forced for ${selectedProj.name} to ${newStatus}`)
  }

  // Pause / Resume Generation
  const togglePipelineActivity = () => {
    if (!selectedProj) return
    const nextStatus = selectedProj.status === 'Pipeline Paused' ? 'AI Clarifying' : 'Pipeline Paused'
    applyStatusOverride(nextStatus)
  }

  // Direct message simulation
  const sendOperatorDirectMsg = () => {
    if (!directMsg.trim() || !selectedProj) return
    const updated = projects.map(p => {
      if (p.id === selectedProjId) {
        return {
          ...p,
          logs: [...p.logs, { time: new Date().toLocaleTimeString(), message: `Operator support DM: "${directMsg}"` }]
        }
      }
      return p
    })
    saveProjects(updated)
    addSystemLog('Operator Override', `DM sent to ${selectedProj.name}: "${directMsg}"`)
    setDirectMsg('')
  }

  // Refund Escrow
  const processEscrowRefund = () => {
    if (!selectedProj) return
    if (!window.confirm('Are you sure you want to release the Stripe pre-authorization escrow and issue a full refund?')) return
    const updated = projects.map(p => {
      if (p.id === selectedProjId) {
        return {
          ...p,
          status: 'Escrow Refunded',
          logs: [...p.logs, { time: new Date().toLocaleTimeString(), message: 'Operator triggered full escrow release refund.' }]
        }
      }
      return p
    })
    saveProjects(updated)
    addSystemLog('Stripe Gateway', `Escrow pre-auth released / refunded for project ${selectedProj.name}`)
  }

  const addSystemLog = (source: any, message: string) => {
    setOperatorLogs(prev => [
      ...prev,
      { id: `l-${Math.random()}`, time: new Date().toLocaleTimeString(), source, message }
    ])
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-4 md:p-12 relative overflow-hidden flex flex-col justify-between">
      {/* Background neon glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[5%] right-[20%] h-[30%] w-[30%] rounded-full bg-rose-950/20 opacity-40 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-slate-900 opacity-50 blur-[110px]" />
      </div>

      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-low/40 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 border border-border-low/50 hover:bg-bg-elevated rounded-sm text-text-muted hover:text-text-primary transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                  <ShieldAlert size={12} />
                  Designwave Security Panel
                </span>
                <span className="text-[9px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-pill">
                  Admin Slack Controls
                </span>
              </div>
              <h1 className="text-3xl font-display font-semibold mt-1">Operator Intervention Console</h1>
            </div>
          </div>

          {/* Project Selector dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-bold uppercase">Active Project:</span>
            <select
              value={selectedProjId}
              onChange={(e) => setSelectedProjId(e.target.value)}
              className="bg-bg-sunken border border-border-low/60 text-text-primary px-4 py-2.5 rounded-card text-sm focus:border-rose-500 focus:outline-none transition-colors font-semibold"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProj ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Operator Quick Override Tools */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Project metrics panel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-bg-sunken/20 border border-border-low/40 p-5 rounded-card">
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Status</span>
                  <span className="text-sm font-bold text-primary-tint-1 mt-1 block">{selectedProj.status}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Rate Locked</span>
                  <span className="text-sm font-mono font-bold text-text-primary mt-1 block">£{selectedProj.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Revisions Remaining</span>
                  <span className="text-sm font-bold mt-1 block text-text-primary">{selectedProj.revisionsLeft} Cycles</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Brand Aesthetics</span>
                  <span className="text-sm font-bold mt-1 block text-primary-tint-2">{selectedProj.aesthetic}</span>
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="bg-bg-sunken/10 border border-border-low/40 p-6 md:p-8 rounded-card space-y-6">
                <h2 className="text-lg font-bold font-display flex items-center gap-2">
                  <Sliders size={18} className="text-rose-500" />
                  Manual Slack Override Commands
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pipeline Control */}
                  <div className="bg-bg-sunken/40 border border-border-low/50 p-5 rounded-card space-y-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase">Pipeline Process Trigger</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={togglePipelineActivity}
                        className="flex-1 px-4 py-3 rounded-pill text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 bg-bg-surface border border-border-low text-text-primary hover:bg-bg-elevated"
                      >
                        {selectedProj.status === 'Pipeline Paused' ? (
                          <>
                            <Play size={14} className="text-success" />
                            Resume Claude
                          </>
                        ) : (
                          <>
                            <Pause size={14} className="text-warning" />
                            Pause Claude Pipeline
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Status Force shift */}
                  <div className="bg-bg-sunken/40 border border-border-low/50 p-5 rounded-card space-y-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase">Force Status Transition</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Ingesting', val: 'Brief Submitted' },
                        { label: 'Clarifying', val: 'AI Clarifying' },
                        { label: 'Under Review', val: 'Under Review' },
                        { label: 'Force Approve', val: 'Done' }
                      ].map((item) => (
                        <button
                          key={item.val}
                          onClick={() => applyStatusOverride(item.val)}
                          className="px-3 py-2 rounded-sm text-[10px] font-bold border border-border-low/50 bg-bg-surface hover:bg-bg-elevated text-text-secondary transition-all"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price adjusting */}
                  <div className="bg-bg-sunken/40 border border-border-low/50 p-5 rounded-card space-y-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase">Adjust Escrow Price (£)</h3>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <DollarSign className="absolute top-1/2 left-3 -translate-y-1/2 text-text-muted" size={14} />
                        <input
                          type="number"
                          value={priceTweakValue}
                          onChange={(e) => setPriceTweakValue(Number(e.target.value))}
                          className="bg-bg-surface border border-border-low/60 text-text-primary pl-8 pr-4 py-2 w-full text-xs rounded-card focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <button
                        onClick={applyPriceTweak}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-text-on-primary font-bold text-xs rounded-pill shadow-md active:scale-95 transition-all"
                      >
                        Tweak Rate
                      </button>
                    </div>
                  </div>

                  {/* Refunding Escrow */}
                  <div className="bg-bg-sunken/40 border border-border-low/50 p-5 rounded-card space-y-3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-rose-400 uppercase">Emergency Refund Escrow</h3>
                      <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                        Release the Stripe pre-authorization lock. Cancel the project deliverable and issue a full credit refund.
                      </p>
                    </div>
                    <button
                      onClick={processEscrowRefund}
                      className="w-full py-2.5 bg-danger/25 border border-danger/30 hover:bg-danger/40 text-danger font-bold text-xs rounded-pill shadow-md active:scale-95 transition-all"
                    >
                      Release Escrow Refund
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Operator Logs & Messaging */}
            <div className="space-y-6">
              
              {/* Direct Messaging */}
              <div className="bg-bg-sunken/30 border border-border-low/40 p-6 rounded-card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Direct Support Message</h3>
                <div className="space-y-2">
                  <textarea
                    placeholder="Enter manual support override instructions..."
                    value={directMsg}
                    onChange={(e) => setDirectMsg(e.target.value)}
                    className="bg-bg-sunken border border-border-low/60 text-text-primary rounded-card px-3 py-3 w-full min-h-[80px] text-xs focus:border-rose-500 focus:outline-none transition-all resize-none"
                  />
                  <button
                    onClick={sendOperatorDirectMsg}
                    disabled={!directMsg.trim()}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-text-on-primary py-2.5 rounded-pill flex items-center justify-center gap-2 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
                  >
                    Post Message log
                    <Send size={12} />
                  </button>
                </div>
              </div>

              {/* Administrative Logs */}
              <div className="bg-bg-sunken/30 border border-border-low/40 p-6 rounded-card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Global Operator logs</h3>
                <div className="space-y-3 font-mono text-[10px] max-h-[220px] overflow-y-auto pr-2">
                  {operatorLogs.slice().reverse().map((log) => (
                    <div key={log.id} className="border-b border-border-low/20 pb-2">
                      <div className="flex justify-between font-bold text-text-secondary">
                        <span className="text-rose-400">{log.source}</span>
                        <span className="text-text-muted">{log.time}</span>
                      </div>
                      <p className="text-text-muted mt-1 leading-relaxed">{log.message}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-bg-sunken/20 border border-border-low/40 rounded-card text-text-muted">
            No projects currently queued in the pipeline.
          </div>
        )}

      </div>
    </div>
  )
}
