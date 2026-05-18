'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Info, 
  History, 
  Download,
  Calculator,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CalculationTrace, BillingBreakdown } from '@/lib/types'

interface CostAuditPanelProps {
  data: BillingBreakdown
  onRefresh?: () => void
  onExport?: (format: 'json' | 'csv' | 'pdf') => void
  isLoading?: boolean
}

const TraceItem = ({ trace }: { trace: CalculationTrace }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-border-low/30 last:border-0 py-3">
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-white/5 px-2 py-1 rounded-sm transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-sm">
            <Calculator size={14} className="text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary capitalize">{trace.resource.replace('_', ' ')}</h4>
            <p className="text-[10px] text-text-muted">{trace.quantity} {trace.unit}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-text-primary">£{trace.total.toFixed(2)}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-bg-sunken/50 rounded-sm mt-2 px-4 py-3"
          >
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-muted">Formula</span>
                <code className="text-primary font-mono bg-primary/5 px-1 rounded">{trace.formula}</code>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-text-muted">Rate</span>
                <span className="text-text-primary">£{trace.rate}/{trace.unit}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-text-muted">Pricing Version</span>
                <span className="text-text-primary">{trace.ruleVersion}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const CostAuditPanel = ({ data, onRefresh, onExport, isLoading }: CostAuditPanelProps) => {
  return (
    <div className="glass-card flex flex-col h-full bg-bg-base/40 border-border-low/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border-low flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display flex items-center gap-2">
            Cost Audit
            {data.anomalies.length > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-warning animate-pulse" />
            )}
          </h2>
          <p className="text-xs text-text-muted mt-1">Real-time cost tracing & validation</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-primary transition-all"
            title="Refresh calculations"
          >
            <RefreshCw size={16} className={cn(isLoading && "animate-spin")} />
          </button>
          <div className="relative group">
             <button className="p-2 hover:bg-white/5 rounded-full text-text-muted hover:text-text-primary transition-all">
                <Download size={16} />
             </button>
             <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 bg-bg-surface border border-border-low rounded-sm shadow-2xl p-2 min-w-[120px]">
                <button onClick={() => onExport?.('json')} className="w-full text-left px-3 py-2 text-xs hover:bg-primary/10 rounded-sm">Export JSON</button>
                <button onClick={() => onExport?.('csv')} className="w-full text-left px-3 py-2 text-xs hover:bg-primary/10 rounded-sm">Export CSV</button>
             </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Total Summary */}
        <div className="bg-primary/5 border border-primary/10 rounded-card p-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Estimated Total</span>
          <div className="text-4xl font-display text-text-primary">£{data.totalCost.toFixed(2)}</div>
        </div>

        {/* Anomalies */}
        <AnimatePresence>
          {data.anomalies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              {data.anomalies.map((anomaly, i) => (
                <div key={i} className="bg-warning/10 border border-warning/20 rounded-sm p-3 flex gap-3">
                  <AlertTriangle size={16} className="text-warning shrink-0" />
                  <p className="text-[11px] font-medium text-warning">{anomaly}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breakdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-4">Itemized Breakdown</label>
          {data.items.length === 0 ? (
             <div className="text-center py-12 text-text-muted italic text-sm">No usage events recorded in this period.</div>
          ) : (
            data.items.map((item, i) => (
              <TraceItem key={i} trace={item} />
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-bg-sunken/30 border-t border-border-low flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-tighter">
          <History size={12} />
          Last Audit: {new Date().toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-2">
           <Info size={12} className="text-text-muted" />
           <span className="text-[9px] text-text-muted">Prices accurate to rule v1.0</span>
        </div>
      </div>
    </div>
  )
}
