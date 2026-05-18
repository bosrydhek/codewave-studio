'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  MessageSquare, 
  CheckSquare, 
  RefreshCcw, 
  AlertTriangle,
  Mail, 
  MessageCircle,
  Eye,
  FileCheck,
  Zap,
  Send
} from 'lucide-react'
import Canvas from './Canvas'

export function ClientPipelinePortal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [project, setProject] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'tracker' | 'clarifications' | 'review'>('tracker')
  const [answerText, setAnswerText] = useState('')
  const [revisionComments, setRevisionComments] = useState('')
  const activeClarIndex = 0
  const [actionSimMessage, setActionSimMessage] = useState<string | null>(null)
  
  // Pipeline Progress Simulation
  const [pipelineProgress, setPipelineProgress] = useState<number>(30)

  useEffect(() => {
    // Load local mock projects
    const loadProject = () => {
      const mockProjects = JSON.parse(localStorage.getItem('designwave_projects') || '[]')
      // Fallback stub if not found
      let proj = mockProjects.find((p: any) => p.id === id)
      if (!proj) {
        proj = {
          id: id || 'dw-hartwell',
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
            },
            {
              id: 'clar-2',
              question: 'What is your preferred color palette focus? We default to a premium high-contrast Slate/Indigo scheme unless specified.',
              answered: false,
              answer: ''
            }
          ],
          logs: [
            { time: '12:00:00', message: 'Brief Ingest Completed.' },
            { time: '12:01:05', message: 'Escrow payment pre-authorized via Stripe.' },
            { time: '12:02:40', message: 'Claude context engine parsed brief requirements.' }
          ]
        }
      }
      setProject(proj)
      
      // Select pipeline percentage based on status
      if (proj.status === 'Done') setPipelineProgress(100)
      else if (proj.status === 'Under Review') setPipelineProgress(85)
      else if (proj.status === 'AI Clarifying') setPipelineProgress(45)
      else setPipelineProgress(25)
    };

    loadProject()
  }, [id])

  const saveProjectState = (updated: any) => {
    setProject(updated)
    const mockProjects = JSON.parse(localStorage.getItem('designwave_projects') || '[]')
    const idx = mockProjects.findIndex((p: any) => p.id === updated.id)
    if (idx !== -1) {
      mockProjects[idx] = updated
    } else {
      mockProjects.push(updated)
    }
    localStorage.setItem('designwave_projects', JSON.stringify(mockProjects))
  }

  // Handle Clarification Answer Submission
  const submitAnswer = (clarId: string) => {
    if (!answerText.trim() || !project) return

    const updatedClars = project.clarifications.map((c: any) => {
      if (c.id === clarId) {
        return { ...c, answered: true, answer: answerText }
      }
      return c
    })

    const updatedLogs = [
      ...project.logs,
      { time: new Date().toLocaleTimeString(), message: `Client answered clarification: "${answerText.substring(0, 30)}..."` }
    ]

    // Trigger SMS and Email simulation
    triggerSimNotification(`SMS Dispatch: "Clarification answered for Project ${project.name}. Model pipeline resuming."`)

    const updated = {
      ...project,
      clarifications: updatedClars,
      logs: updatedLogs,
      status: updatedClars.every((c: any) => c.answered) ? 'Under Review' : 'AI Clarifying'
    }

    saveProjectState(updated)
    setAnswerText('')
    
    if (updated.status === 'Under Review') {
      setPipelineProgress(85)
      setActiveTab('review')
    }
  }

  // Handle Draft Review Approval
  const approveProject = () => {
    if (!project) return
    
    const updated = {
      ...project,
      status: 'Done',
      logs: [
        ...project.logs,
        { time: new Date().toLocaleTimeString(), message: 'Project layout Approved by client! Escrow Stripe finalized.' },
        { time: new Date().toLocaleTimeString(), message: 'Production deployment triggered to Vercel edge edge-nodes.' }
      ]
    }
    
    saveProjectState(updated)
    setPipelineProgress(100)
    triggerSimNotification('Escrow Escrow Finalized: £' + project.price.toLocaleString() + ' charged via pre-auth Stripe key.')
  }

  // Handle Revision Submission
  const submitRevision = () => {
    if (!revisionComments.trim() || !project) return

    const currentRevisions = project.revisionsLeft
    const nextRevisions = Math.max(currentRevisions - 1, 0)
    
    const updated = {
      ...project,
      revisionsLeft: nextRevisions,
      status: nextRevisions === 0 ? 'Escalated' : 'AI Clarifying',
      logs: [
        ...project.logs,
        { time: new Date().toLocaleTimeString(), message: `Revision requested: "${revisionComments.substring(0, 30)}..." (${nextRevisions} left)` }
      ]
    }

    if (nextRevisions === 0) {
      updated.logs.push({
        time: new Date().toLocaleTimeString(),
        message: 'CRITICAL WARNING: Revisions exhausted. Pipeline escalated for Operator Manual Review.'
      })
    }

    saveProjectState(updated)
    setRevisionComments('')
    setPipelineProgress(nextRevisions === 0 ? 90 : 40)
    setActiveTab('tracker')
    
    triggerSimNotification(
      nextRevisions === 0 
        ? 'SLACK ALERT SENT: Escalation warning triggered for Project ' + project.name
        : 'Model re-queued: 1-shot pipeline restarted using client feedback context.'
    )
  }

  const triggerSimNotification = (msg: string) => {
    setActionSimMessage(msg)
    setTimeout(() => {
      setActionSimMessage(null)
    }, 4500)
  }

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-base text-text-muted">
        Loading Client Pipeline Tracker...
      </div>
    )
  }

  const activeClar = project.clarifications.filter((c: any) => !c.answered)[activeClarIndex]

  return (
    <div className="min-h-screen bg-bg-base text-text-primary p-4 md:p-12 relative overflow-hidden flex flex-col justify-between">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[10%] left-[20%] h-[30%] w-[30%] rounded-full bg-indigo-950/40 opacity-40 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[40%] w-[40%] rounded-full bg-primary-tint-2/5 opacity-20 blur-[110px]" />
      </div>

      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Navigation & Header */}
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
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Live Client Pipeline Portal
                </span>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-pill border ${
                  project.status === 'Done' ? 'border-success text-success bg-success/5' :
                  project.status === 'Escalated' ? 'border-danger text-danger bg-danger/5 animate-pulse' :
                  'border-primary text-primary bg-primary/5'
                }`}>
                  {project.status}
                </span>
              </div>
              <h1 className="text-3xl font-display font-semibold mt-1">{project.name} Workspace</h1>
            </div>
          </div>

          {/* Value Pricing Display */}
          <div className="bg-bg-sunken border border-border-low/50 px-6 py-3 rounded-card flex gap-6 items-center">
            <div>
              <span className="text-[9px] font-bold text-text-muted uppercase block">Value Price (Stripe escrow)</span>
              <span className="text-xl font-bold font-mono text-text-primary">£{project.price.toLocaleString()}</span>
            </div>
            <div className="h-8 w-[1px] bg-border-low/40" />
            <div>
              <span className="text-[9px] font-bold text-text-muted uppercase block">Aesthetic Selected</span>
              <span className="text-sm font-semibold text-primary-tint-1">{project.aesthetic}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Warning for Operator Intervention */}
        {project.status === 'Escalated' && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="border border-danger/30 bg-danger/5 p-6 rounded-card flex flex-col md:flex-row md:items-center gap-4 text-left"
          >
            <div className="text-danger bg-danger/10 p-3.5 rounded-sm flex items-center justify-center">
              <AlertTriangle size={24} className="animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-text-primary text-lg">Operator Review Escalated</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                You have exhausted all remaining revision cycles. Claude&apos;s codebase pipeline is locked, and a Slack alert has queued. Our support operator will contact you directly to process custom requirements or override boundaries.
              </p>
            </div>
            <button 
              onClick={() => navigate('/operator')}
              className="bg-danger hover:bg-danger/90 text-text-on-primary font-bold px-5 py-3 rounded-pill text-xs shadow-xl active:scale-95 transition-all"
            >
              Open Operator Override
            </button>
          </motion.div>
        )}

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-border-low/40">
          {[
            { id: 'tracker', label: '1-Shot Pipeline Tracker', icon: Sparkles },
            { id: 'clarifications', label: `Claude Clarifications (${project.clarifications.filter((c: any) => !c.answered).length})`, icon: MessageSquare },
            { id: 'review', label: 'Approve & Preview Canvas', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all -mb-[2px] ${
                  active 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'tracker' && (
                <motion.div
                  key="tracker"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8 bg-bg-sunken/20 border border-border-low/40 p-6 md:p-8 rounded-card"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold font-display">Generation Progress</h2>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2.5 text-xs flex rounded-pill bg-bg-sunken border border-border-low/55">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${pipelineProgress}%` }}
                          transition={{ duration: 1 }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center btn-primary-gradient rounded-pill"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-text-muted mt-2 font-mono">
                        <span>Ingesting Brief (20%)</span>
                        <span>Compiling Schema (50%)</span>
                        <span>Client Review Ready (85%)</span>
                        <span>Complete (100%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Steps Tracking */}
                  <div className="space-y-4 border-t border-border-low/40 pt-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Pipeline Pipeline Logs</h3>
                    <div className="space-y-3 font-mono text-xs max-h-[220px] overflow-y-auto pr-2">
                      {project.logs.slice().reverse().map((log: any, idx: number) => (
                        <div key={idx} className="flex gap-4 border-b border-border-low/20 pb-2">
                          <span className="text-primary font-bold">{log.time}</span>
                          <span className="text-text-secondary">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'clarifications' && (
                <motion.div
                  key="clarifications"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-bg-sunken/20 border border-border-low/40 p-6 md:p-8 rounded-card min-h-[300px] flex flex-col justify-between"
                >
                  {activeClar ? (
                    <div className="space-y-6">
                      <div className="bg-primary/5 border border-primary/20 p-5 rounded-card flex gap-4 items-start">
                        <MessageSquare className="text-primary flex-shrink-0 mt-1" />
                        <div>
                          <span className="text-[10px] font-bold text-primary uppercase block">Claude AI Coworker Question</span>
                          <p className="text-text-primary text-base font-semibold leading-relaxed mt-1">
                            {activeClar.question}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                          Your Direct Response
                        </label>
                        <textarea
                          placeholder="Provide specifics (e.g. competitor websites, aesthetic guidelines, logo shapes...)"
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          className="bg-bg-sunken border border-border-low/60 text-text-primary rounded-card px-4 py-4 w-full min-h-[120px] focus:border-primary focus:outline-none transition-all resize-none"
                        />
                      </div>

                      <button
                        onClick={() => submitAnswer(activeClar.id)}
                        disabled={!answerText.trim()}
                        className="btn-primary-gradient text-text-on-primary py-3 px-6 rounded-pill flex items-center justify-center gap-2 font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all ml-auto text-xs"
                      >
                        Submit Response
                        <Send size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                      <div className="bg-success/10 border border-success/20 p-3 rounded-full text-success">
                        <FileCheck size={28} />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary">No Active Clarifications</h3>
                      <p className="text-text-muted text-sm max-w-sm">
                        Claude has all context specifications required to finalize your draft layout. Track our edge-deploying pipeline directly!
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="bg-bg-sunken/40 border border-border-low/40 p-4 rounded-card flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <h3 className="font-bold text-text-primary">Stripe Payment Escalated Escrow</h3>
                      <p className="text-text-muted text-xs">
                        Review the generated design canvas below. Approve draft to trigger immediate Payload CMS code deployments.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={approveProject}
                        disabled={project.status === 'Done'}
                        className={`px-5 py-2.5 rounded-pill font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                          project.status === 'Done' 
                            ? 'bg-success/20 border border-success/30 text-success cursor-not-allowed'
                            : 'btn-primary-gradient text-text-on-primary hover:scale-105'
                        }`}
                      >
                        <CheckSquare size={14} />
                        {project.status === 'Done' ? 'Fully Approved' : 'Approve Draft'}
                      </button>
                    </div>
                  </div>

                  {/* Embedding Real Interactive Canvas Component */}
                  <div className="border border-border-low/50 rounded-card overflow-hidden h-[450px] shadow-2xl relative bg-bg-sunken">
                    <Canvas 
                      generatedCode={`<html>
                        <body style="font-family: sans-serif; background: #0b0f19; color: #f8fafc; padding: 4rem; display: flex; align-items: center; justify-content: center; height: 100vh; margin:0;">
                          <div style="text-align: center; border: 1px solid #1e293b; background: rgba(30,41,59,0.3); border-radius: 12px; padding: 3rem; backdrop-filter: blur(10px); max-width: 600px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                            <span style="color: #6366f1; text-transform: uppercase; font-size: 11px; font-weight: bold; letter-spacing: 0.15em;">Deliverable Preview</span>
                            <h1 style="font-size: 36px; margin: 12px 0;">${project.name}</h1>
                            <p style="color: #94a3b8; line-height: 1.6; font-size: 14px; margin-bottom: 24px;">Custom high-converting design layout synthesized by Claude AI under dynamic aesthetic: <b>${project.aesthetic}</b>.</p>
                            <div style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 9999px; font-weight: bold; font-size: 13px;">Pre-auth Status: Secured</div>
                          </div>
                        </body>
                      </html>`}
                      onDeploy={() => {}}
                      onGithubSync={async () => {}}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar: Comm Logs & Revisions */}
          <div className="space-y-6">
            
            {/* Revisions Control Panel */}
            <div className="bg-bg-sunken/30 border border-border-low/40 p-6 rounded-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex justify-between items-center">
                <span>Revision Cycle Control</span>
                <span className="font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-pill">
                  {project.revisionsLeft} Left
                </span>
              </h3>

              <p className="text-text-muted text-xs leading-relaxed">
                If the canvas doesn&apos;t perfectly match your branding goals, request a 1-shot revision. Claude will ingest feedback details and regenerate.
              </p>

              <div className="space-y-2">
                <textarea
                  placeholder="Specify revision targets (e.g. adjust logo scaling, shift brand details to darker shades...)"
                  value={revisionComments}
                  onChange={(e) => setRevisionComments(e.target.value)}
                  disabled={project.revisionsLeft === 0 || project.status === 'Done'}
                  className="bg-bg-sunken border border-border-low/60 text-text-primary rounded-card px-3 py-3.5 w-full min-h-[90px] text-xs focus:border-primary focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                onClick={submitRevision}
                disabled={!revisionComments.trim() || project.revisionsLeft === 0 || project.status === 'Done'}
                className="w-full btn-primary-gradient text-text-on-primary py-3 rounded-pill flex items-center justify-center gap-2 font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
              >
                Request 1-Shot Revision
                <RefreshCcw size={14} />
              </button>
            </div>

            {/* Notification Simulators */}
            <div className="bg-bg-sunken/30 border border-border-low/40 p-6 rounded-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">SMS & Email logs</h3>
              
              <div className="space-y-3">
                <div className="bg-bg-sunken p-3.5 rounded-sm flex items-start gap-3 border border-border-low/50">
                  <Mail size={16} className="text-primary mt-0.5" />
                  <div className="text-[10px] space-y-1">
                    <span className="font-bold text-text-secondary block">Email Sent to Client:</span>
                    <p className="text-text-muted leading-relaxed">
                      &quot;Project {project.name} has clarification updates awaiting review on Designwave dashboard.&quot;
                    </p>
                  </div>
                </div>

                <div className="bg-bg-sunken p-3.5 rounded-sm flex items-start gap-3 border border-border-low/50">
                  <MessageCircle size={16} className="text-success mt-0.5" />
                  <div className="text-[10px] space-y-1">
                    <span className="font-bold text-text-secondary block">SMS Dispatched:</span>
                    <p className="text-text-muted leading-relaxed">
                      &quot;Escrow secured rate £{project.price.toLocaleString()} for project {project.id}. Model starting pipeline.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Simulator Event Popup Box */}
      <AnimatePresence>
        {actionSimMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-primary/30 p-5 rounded-card shadow-2xl flex items-center gap-3.5 max-w-sm text-left backdrop-blur-xl"
          >
            <div className="bg-primary/20 border border-primary/30 p-2.5 rounded-sm text-primary flex items-center justify-center flex-shrink-0 animate-pulse">
              <Zap size={20} />
            </div>
            <div>
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-0.5">System Alert Sim</span>
              <p className="text-text-primary text-xs font-semibold leading-relaxed">
                {actionSimMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
