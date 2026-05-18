'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Zap,
  Lock, 
  Unlock
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { CoPilotNudge } from '@/lib/types'
import { cn } from '@/lib/utils'

export const NudgeChecklist = ({ userId }: { userId?: string }) => {
  const [nudges, setNudges] = useState<CoPilotNudge[]>([])
  const [overriddenIds, setOverriddenIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchNudges = async () => {
      const { data } = await supabase
        .from('copilot_nudges')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (data) setNudges(data)
      setLoading(false)
    }

    fetchNudges()

    // Real-time subscription
    const channel = supabase
      .channel('nudges_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'copilot_nudges',
        filter: `user_id=eq.${userId}`
      }, fetchNudges)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const toggleNudge = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    await supabase
      .from('copilot_nudges')
      .update({ status: newStatus })
      .eq('id', id)
    
    setNudges(prev => prev.filter(n => n.id !== id))
  }

  const isBlocked = (nudge: CoPilotNudge) => {
    if (!nudge.depends_on || nudge.depends_on.length === 0) return false
    if (overriddenIds.has(nudge.id)) return false
    
    // Check if any dependencies are still pending
    return nudge.depends_on.some(depId => 
      nudges.some(n => n.id === depId && n.status === 'pending')
    )
  }

  const sortedNudges = [...nudges].sort((a, b) => {
    const aBlocked = isBlocked(a)
    const bBlocked = isBlocked(b)
    
    // Unblocked first, then by priority
    if (aBlocked !== bBlocked) return aBlocked ? 1 : -1
    return (b.priority || 0) - (a.priority || 0)
  })

  const toggleOverride = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setOverriddenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (loading || nudges.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={14} className="text-primary" />
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Fred&apos;s Recommendations</h3>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedNudges.map((nudge) => {
            const blocked = isBlocked(nudge)
            const overridden = overriddenIds.has(nudge.id)

            return (
              <motion.div
                key={nudge.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: blocked ? 0.6 : 1, 
                  x: 0,
                  scale: blocked ? 0.98 : 1
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "group relative bg-bg-sunken/50 border border-border-low rounded-modal p-4 transition-all cursor-pointer",
                  blocked ? "grayscale-[0.5]" : "hover:border-primary/30 shadow-lg shadow-primary/0 hover:shadow-primary/5",
                )}
                onClick={() => !blocked && toggleNudge(nudge.id, nudge.status)}
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    {blocked ? (
                      <div className="relative group/lock">
                        <Lock size={18} className="text-text-muted" />
                        <button 
                          onClick={(e) => toggleOverride(e, nudge.id)}
                          className="absolute -top-2 -right-2 p-1 bg-bg-base border border-border-low rounded-full opacity-0 group-hover:opacity-100 hover:text-primary transition-all shadow-xl"
                          title="Override Dependency"
                        >
                          <Unlock size={10} />
                        </button>
                      </div>
                    ) : nudge.status === 'completed' ? (
                      <CheckCircle2 size={18} className="text-primary" />
                    ) : (
                      <Circle size={18} className="text-text-muted group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-sm font-bold truncate transition-colors",
                        blocked ? "text-text-muted" : "text-text-primary"
                      )}>
                        {nudge.title}
                      </span>
                      {overridden && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-warning/10 text-warning rounded-pill uppercase tracking-tighter">
                          Overridden
                        </span>
                      )}
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-pill font-bold uppercase tracking-tighter",
                        nudge.type === 'security' ? "bg-red-500/10 text-red-500" :
                        nudge.type === 'qa' ? "bg-primary/10 text-primary" : "bg-white/5 text-text-muted"
                      )}>
                        {nudge.type}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs leading-relaxed line-clamp-2",
                      blocked ? "text-text-muted/60" : "text-text-secondary"
                    )}>
                      {nudge.description}
                    </p>
                    
                    {blocked && nudge.depends_on && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-text-muted" />
                        <span className="text-[9px] text-text-muted font-medium italic">
                          Requires completion of dependent tasks
                        </span>
                      </div>
                    )}
                  </div>
                  {!blocked && (
                    <ChevronRight size={16} className="text-text-muted group-hover:text-primary transition-all group-hover:translate-x-1 self-center" />
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
