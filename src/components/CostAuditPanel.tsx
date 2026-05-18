'use client'

import React from 'react'
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Cpu,
  RefreshCw,
  Coins
} from 'lucide-react'
import { cn } from '../lib/utils'
import { BillingBreakdown } from '../lib/types'

interface CostAuditPanelProps {
  data: BillingBreakdown
  onRefresh: () => void
  isLoading: boolean
}

export const CostAuditPanel: React.FC<CostAuditPanelProps> = ({ data, onRefresh, isLoading }) => {
  const anomaliesCount = data.anomalies?.length || 0

  return (
    <div className="glass-card flex h-full flex-col p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-sm">
            <Coins size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Calculation Trace</h3>
            <p className="text-[10px] text-text-muted">Itemized audit logs & pricing models</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="text-text-muted hover:text-text-primary rounded-sm p-1.5 transition-colors border border-border-low/40 bg-white/5 disabled:opacity-50"
        >
          <RefreshCw size={14} className={cn(isLoading && "animate-spin")} />
        </button>
      </div>

      {/* Summary Stat Card */}
      <div className="bg-bg-sunken border border-border-low/60 rounded-card p-5 relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Total Value Pricing</span>
            <div className="text-3xl font-display font-black text-text-primary">
              £{(data.totalCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/25 rounded-card px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-bold text-primary">
            <TrendingUp size={12} />
            <span>VALUE BASED</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border-low/40 flex items-center justify-between text-xs">
          <span className="text-text-muted">Calculation State:</span>
          <span className="text-success font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Validated
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Breakdowns */}
      <div className="space-y-3 flex-1">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Pricing Itemization</span>
        <div className="space-y-2">
          {data.items?.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-bg-sunken/40 border border-border-low/30 hover:border-border-low/80 transition-all rounded-sm p-4.5 flex justify-between items-start text-xs"
            >
              <div className="space-y-1">
                <span className="font-bold text-text-primary">{item.name}</span>
                {item.details && (
                  <p className="text-[10px] text-text-muted leading-relaxed font-sans">{item.details}</p>
                )}
              </div>
              <span className="font-mono text-text-primary font-bold">
                £{item.cost.toFixed(2)}
              </span>
            </div>
          ))}
          {(!data.items || data.items.length === 0) && (
            <div className="text-center py-6 text-text-muted italic">No items available.</div>
          )}
        </div>
      </div>

      {/* Anomalies & Auditing Warnings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Anomaly Check</span>
          <span className={cn(
            "text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider",
            anomaliesCount > 0 ? "bg-warning/10 text-warning border border-warning/20" : "bg-success/10 text-success border border-success/20"
          )}>
            {anomaliesCount > 0 ? `${anomaliesCount} Warnings` : 'All Clean'}
          </span>
        </div>

        <div className="space-y-2.5">
          {data.anomalies?.map((anomaly, idx) => (
            <div 
              key={idx}
              className={cn(
                "border rounded-sm p-4 flex gap-3 text-xs",
                anomaly.severity === 'high' 
                  ? "bg-error/5 border-error/20 text-text-primary" 
                  : "bg-warning/5 border-warning/20 text-text-primary"
              )}
            >
              <AlertTriangle className={cn(
                "shrink-0 mt-0.5",
                anomaly.severity === 'high' ? "text-error animate-pulse" : "text-warning"
              )} size={16} />
              <div className="space-y-0.5">
                <span className="font-bold capitalize">{anomaly.type.replace('_', ' ')}</span>
                <p className="text-[10px] text-text-muted leading-relaxed">{anomaly.description}</p>
              </div>
            </div>
          ))}
          {anomaliesCount === 0 && (
            <div className="bg-success/5 border border-success/15 rounded-sm p-4 flex gap-3 text-xs text-text-primary">
              <CheckCircle2 className="text-success shrink-0" size={16} />
              <div>
                <span className="font-bold">Zero Anomalies</span>
                <p className="text-[10px] text-text-muted mt-0.5">Pricing models conform completely to workspace scale parameters.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RAG Context Reference */}
      <div className="border-t border-border-low/40 pt-5 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-text-muted">
          <Cpu size={14} className="text-primary" />
          <span className="font-bold uppercase text-[9px] tracking-wider">AI Pipeline Reference</span>
        </div>
        <p className="text-[10px] text-text-muted leading-relaxed">
          Pricing thresholds optimized dynamically based on customer expectations (£1,500 - £5,000 values) persisting in local storage.
        </p>
      </div>

    </div>
  )
}
