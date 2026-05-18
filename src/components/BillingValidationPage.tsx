'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FlaskConical, 
  History, 
  ShieldCheck, 
  ChevronRight,
  Play,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Activity
} from 'lucide-react'
import { SandboxModeUI } from './SandboxModeUI'
import { CostAuditPanel } from './CostAuditPanel'
import { cn } from '@/lib/utils'
import { BillingBreakdown } from '@/lib/types'
import { supabase } from '@/lib/supabase'

export const BillingValidationPage = () => {
  const [isSandbox, setIsSandbox] = useState(false)
  const [activeScenario, setActiveScenario] = useState<'normal' | 'high_usage' | 'spike' | 'zero_usage'>('normal')
  const [simulationResult, setSimulationResult] = useState<BillingBreakdown | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('')

  const fetchWorkspaces = async () => {
    const { data } = await supabase.from('workspaces').select('id, name')
    if (data) {
      setWorkspaces(data)
      if (data.length > 0) setSelectedWorkspace(data[0].id)
    }
  }

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('simulation_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10)
    if (data) setLogs(data)
  }

  useEffect(() => {
    const init = async () => {
      await fetchLogs()
      await fetchWorkspaces()
    }
    init()
  }, [])

  const runSimulation = async () => {
    if (!selectedWorkspace) return
    setIsSimulating(true)
    setIsSandbox(true)
    
    try {
      const response = await fetch('/api/billing/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: activeScenario,
          workspaceId: selectedWorkspace,
          pricingRuleVersion: 'v1.0'
        })
      })
      
      const result = await response.json()
      setSimulationResult(result)
      fetchLogs()
    } catch (error) {
      console.error('Simulation failed:', error)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <SandboxModeUI isActive={isSandbox} onExit={() => { setIsSandbox(false); setSimulationResult(null); }}>
      <div className="flex-1 overflow-y-auto p-8 pb-24 relative z-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h1 className="text-4xl font-display mb-2 flex items-center gap-3">
                  Billing Validation
                  <ShieldCheck className="text-primary" />
                </h1>
                <p className="text-text-muted max-w-md">
                  Simulate usage scenarios and validate pricing rule accuracy in a safe sandbox environment.
                </p>
              </div>
            </div>

            {/* Scenario Selection */}
            <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-card">
                  <FlaskConical size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Sandbox Configuration</h3>
                  <p className="text-xs text-text-muted">Choose a workspace and usage scenario to test</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Target Workspace</label>
                  <select 
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="w-full bg-bg-sunken border-border-low rounded-sm p-3 text-sm focus:border-primary transition-all outline-none"
                  >
                    {workspaces.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                    {workspaces.length === 0 && <option value="">No workspaces found</option>}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Pricing Rule Version</label>
                  <select className="w-full bg-bg-sunken border-border-low rounded-sm p-3 text-sm focus:border-primary transition-all outline-none">
                    <option>v1.0 (Active)</option>
                    <option>v0.9 (Legacy)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Usage Scenario</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['normal', 'high_usage', 'spike', 'zero_usage'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveScenario(s)}
                      className={cn(
                        "p-4 rounded-card border text-left transition-all group",
                        activeScenario === s 
                          ? "bg-primary/10 border-primary shadow-lg shadow-primary/5" 
                          : "bg-white/5 border-border-low hover:border-border-mid"
                      )}
                    >
                      <h4 className={cn(
                        "text-xs font-bold uppercase tracking-widest transition-colors",
                        activeScenario === s ? "text-primary" : "text-text-muted group-hover:text-text-primary"
                      )}>
                        {s.replace('_', ' ')}
                      </h4>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={runSimulation}
                disabled={isSimulating || !selectedWorkspace}
                className="w-full btn-primary-gradient rounded-pill py-4 flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {isSimulating ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <Play size={20} className="fill-current" />
                )}
                <span className="font-bold text-text-on-primary uppercase tracking-widest text-sm">
                  Run Sandbox Simulation
                </span>
              </button>
            </div>

            {/* Simulation History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <History size={16} />
                  Simulation Logs
                </h3>
                <button className="text-[10px] font-bold text-text-muted hover:text-error uppercase tracking-widest transition-colors flex items-center gap-1">
                  <Trash2 size={12} /> Clear Logs
                </button>
              </div>
              
              <div className="space-y-3">
                {logs.map((log) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    className="glass-card p-4 flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-success/10 p-2 rounded-sm">
                        <CheckCircle2 size={16} className="text-success" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary capitalize">{log.scenario_name.replace('_', ' ')} Simulation</h4>
                        <p className="text-[10px] text-text-muted">
                          {new Date(log.timestamp).toLocaleString()} • Workspace: {log.config.workspaceId.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-bold text-text-primary">£{log.result.totalCost.toFixed(2)}</span>
                        <p className={cn(
                          "text-[9px] font-bold uppercase tracking-widest",
                          log.result.anomalies.length > 0 ? "text-warning" : "text-success"
                        )}>
                          {log.result.anomalies.length > 0 ? `${log.result.anomalies.length} Anomalies` : 'Passed'}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
                {logs.length === 0 && (
                   <div className="text-center py-12 glass-card border-dashed text-text-muted italic text-sm">No simulation logs found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Audit Panel (Result View) */}
          <div className="lg:col-span-1 min-h-[600px]">
            {simulationResult ? (
              <CostAuditPanel 
                data={simulationResult} 
                onRefresh={runSimulation}
                isLoading={isSimulating}
              />
            ) : (
              <div className="glass-card h-full flex flex-col items-center justify-center p-8 text-center bg-transparent border-dashed border-2">
                 <div className="bg-white/5 p-6 rounded-full mb-6">
                    <Activity size={48} className="text-text-muted/30" />
                 </div>
                 <h3 className="text-lg font-bold text-text-primary mb-2">No Active Simulation</h3>
                 <p className="text-sm text-text-muted max-w-xs">
                    Run a simulation to see itemized cost breakdowns and calculation traces here.
                 </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </SandboxModeUI>
  )
}
