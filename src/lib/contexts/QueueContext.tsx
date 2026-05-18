/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface QueuedTask {
  id: string
  prompt: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  timestamp: Date
  progress?: number
}

interface QueueContextType {
  queue: QueuedTask[]
  activeTask: QueuedTask | null
  history: QueuedTask[]
  enqueuePrompt: (prompt: string) => void
  cancelTask: (taskId: string) => void
  clearHistory: () => void
}

const QueueContext = createContext<QueueContextType | undefined>(undefined)

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<QueuedTask[]>([])
  const [activeTask, setActiveTask] = useState<QueuedTask | null>(null)
  const [history, setHistory] = useState<QueuedTask[]>([])

  const enqueuePrompt = useCallback((prompt: string) => {
    const newTask: QueuedTask = {
      id: Math.random().toString(36).substr(2, 9),
      prompt,
      status: 'queued',
      timestamp: new Date(),
    }
    setQueue((prev) => [...prev, newTask])
  }, [])

  const cancelTask = useCallback(
    (taskId: string) => {
      setQueue((prev) => prev.filter((t) => t.id !== taskId))
      if (activeTask?.id === taskId) {
        setActiveTask(null)
        // In a real app, you'd also signal the agent to stop
      }
    },
    [activeTask],
  )

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  // Process the queue
  useEffect(() => {
    if (!activeTask && queue.length > 0) {
      const nextTask = queue[0]
      // Use microtask to avoid synchronous setState in effect warning
      Promise.resolve().then(() => {
        setQueue((prev) => prev.slice(1))
        setActiveTask({ ...nextTask, status: 'processing', progress: 0 })
      })

      // Simulate processing
      let progress = 0
      const interval = setInterval(() => {
        progress += 5
        if (progress <= 100) {
          setActiveTask((curr) => (curr ? { ...curr, progress } : null))
        } else {
          clearInterval(interval)
          setHistory((prev) => [
            { ...nextTask, status: 'completed', timestamp: new Date() },
            ...prev,
          ])
          setActiveTask(null)
        }
      }, 200)

      return () => clearInterval(interval)
    }
  }, [queue, activeTask])

  return (
    <QueueContext.Provider
      value={{ queue, activeTask, history, enqueuePrompt, cancelTask, clearHistory }}
    >
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = () => {
  const context = useContext(QueueContext)
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider')
  }
  return context
}
