import React, { useState } from 'react'
import { useQueue } from '../lib/contexts/QueueContext'
import { motion } from 'framer-motion'
import {
  ChevronUp,
  ChevronDown,
  ListTodo,
  History,
  X,
  Play,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { cn } from '../lib/utils'

export const QueueDrawer: React.FC = () => {
  const { queue, activeTask, history, cancelTask } = useQueue()
  const [isOpen, setIsOpen] = useState(false)
  const totalTasks = queue.length + (activeTask ? 1 : 0)

  if (totalTasks === 0 && history.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-6 bottom-6 z-50 flex flex-col items-end gap-4">
      {/* Active Task Floating Indicator */}
      {activeTask && !isOpen && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-bg-base/80 border-border-low rounded-modal pointer-events-auto flex min-w-[300px] items-center gap-4 border p-4 font-sans shadow-2xl backdrop-blur-xl"
        >
          <div className="relative flex h-10 w-10 items-center justify-center">
            <svg className="h-10 w-10 -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/5"
              />
              <motion.circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="113.1"
                initial={{ strokeDashoffset: 113.1 }}
                animate={{ strokeDashoffset: 113.1 * (1 - (activeTask.progress || 0) / 100) }}
                className="text-primary"
              />
            </svg>
            <Play size={12} className="text-primary fill-primary absolute" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-muted font-display text-[10px] font-black tracking-[0.2em] uppercase">
              Processing Task
            </p>
            <p className="truncate text-sm font-medium text-white/90">{activeTask.prompt}</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChevronUp size={18} />
          </button>
        </motion.div>
      )}

      {/* Main Drawer */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : '0px',
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.95,
        }}
        className={cn(
          'bg-bg-base/95 border-border-low rounded-modal pointer-events-auto flex w-[400px] flex-col overflow-hidden border font-sans shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-3xl',
          !isOpen && 'invisible',
        )}
      >
        <div className="border-border-low bg-bg-sunken flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-sm p-2">
              <ListTodo size={18} className="text-primary" />
            </div>
            <h3 className="text-text-primary font-display text-lg font-normal tracking-tight">
              Agent Queue
            </h3>
            <span className="rounded-pill bg-bg-surface text-text-muted border-border-low border px-2 py-0.5 text-[10px] font-bold tracking-tighter uppercase">
              {totalTasks} Tasks
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-xl p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        <div className="max-h-[500px] flex-1 space-y-8 overflow-y-auto p-6">
          {/* Active Task Section */}
          {activeTask && (
            <div className="space-y-4">
              <label className="text-text-muted font-display px-1 text-[10px] font-black tracking-[0.2em] uppercase">
                Active
              </label>
              <div className="bg-bg-surface border-border-low group relative overflow-hidden rounded-sm border p-4 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary text-sm leading-relaxed font-medium">
                      {activeTask.prompt}
                    </p>
                  </div>
                  <button
                    onClick={() => cancelTask(activeTask.id)}
                    className="rounded-lg p-1.5 text-white/20 transition-all hover:bg-red-400/10 hover:text-red-400"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="bg-bg-sunken rounded-pill h-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeTask.progress}%` }}
                    className="bg-primary h-full"
                  />
                </div>
                <p className="text-primary mt-2 text-right text-[10px] font-bold tracking-widest uppercase">
                  {activeTask.progress}% COMPLETE
                </p>
              </div>
            </div>
          )}

          {/* Queued Items */}
          {queue.length > 0 && (
            <div className="space-y-4">
              <label className="text-text-muted font-display px-1 text-[10px] font-black tracking-[0.2em] uppercase">
                Queued
              </label>
              <div className="space-y-3">
                {queue.map((task) => (
                  <div
                    key={task.id}
                    className="bg-bg-sunken border-border-low hover:bg-bg-surface group flex items-start gap-4 rounded-sm border p-4 transition-all"
                  >
                    <div className="mt-1">
                      <Clock
                        size={16}
                        className="text-text-muted/40 group-hover:text-text-muted transition-colors"
                      />
                    </div>
                    <p className="text-text-muted group-hover:text-text-primary line-clamp-2 flex-1 text-sm leading-relaxed italic transition-colors">
                      {task.prompt}
                    </p>
                    <button
                      onClick={() => cancelTask(task.id)}
                      className="rounded-lg p-1.5 text-white/0 transition-all group-hover:text-white/20 hover:bg-red-400/10 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <div className="border-border-low space-y-4 border-t pt-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-text-muted font-display text-[10px] font-black tracking-[0.2em] uppercase">
                  History
                </label>
                <History size={14} className="text-text-muted/40" />
              </div>
              <div className="space-y-3 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                {history.map((task) => (
                  <div
                    key={task.id}
                    className="bg-bg-sunken/40 hover:border-border-low flex items-center gap-4 rounded-sm border border-transparent p-4 transition-all"
                  >
                    <CheckCircle2 size={16} className="text-primary/50" />
                    <p className="text-text-muted line-clamp-1 flex-1 text-sm italic">
                      {task.prompt}
                    </p>
                    <span className="text-text-muted/40 text-[10px] font-bold tracking-tighter uppercase">
                      {task.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Floating Toggle (when not active or explicitly closed) */}
      {!activeTask && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-pill bg-bg-sunken border-border-low text-text-muted hover:text-text-primary hover:bg-bg-surface group ring-border-low pointer-events-auto border p-4 font-sans shadow-2xl ring-1 backdrop-blur-xl transition-all"
        >
          <div className="flex items-center gap-3">
            <ListTodo size={20} className="transition-transform group-hover:rotate-12" />
            {history.length > 0 && (
              <span className="font-display text-xs font-black tracking-[0.2em] uppercase">
                Queue
              </span>
            )}
          </div>
        </button>
      )}
    </div>
  )
}
