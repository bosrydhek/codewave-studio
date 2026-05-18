'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  Zap, 
  History, 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { globalFred } from '@/lib/copilot-engine'
import { SlashCommandMenu } from './SlashCommandMenu'

interface Message {
  role: 'user' | 'fred'
  content: string
}

export const CoPilotDrawer = ({ 
  isOpen, 
  onClose,
  userId
}: { 
  isOpen: boolean
  onClose: () => void
  userId?: string
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isResuming, setIsResuming] = useState(false)
  const [latestSession, setLatestSession] = useState<any>(null)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && userId) {
      globalFred.getLatestSession(userId).then(session => {
        if (session) setLatestSession(session)
      })
    }
  }, [isOpen, userId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return
    
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setShowSlashMenu(false)

    // Simulate Fred thinking
    const intent = await globalFred.parseCommand(text, { geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY })
    
    let responseText = "I'm on it. I've processed your request."
    if (intent.intent === 'slash_command') {
      responseText = `Executing slash command: /${intent.params.command}`
    } else if (intent.explanation) {
      responseText = intent.explanation
    }

    setMessages(prev => [...prev, { role: 'fred', content: responseText }])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === '/') {
      setShowSlashMenu(true)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-[450px] bg-bg-base border-l border-border-low shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-low flex items-center justify-between bg-bg-sunken/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                  <Zap className="text-text-on-primary" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-display text-text-primary">Fred</h2>
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Designwave CoPilot</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-pill transition-colors text-text-muted">
                <X size={20} />
              </button>
            </div>

            {/* Chat Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {latestSession && !isResuming && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/5 border border-primary/20 rounded-modal p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <History size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Previous Session</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {latestSession.summary || "You were working on the Hartley Property deployment. QA passed."}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setIsResuming(true)
                        handleSend("Resume previous session")
                      }}
                      className="px-4 py-2 bg-primary text-text-on-primary text-xs font-bold rounded-pill hover:bg-primary-tint-1 transition-colors"
                    >
                      Resume Session
                    </button>
                    <button 
                      onClick={() => setLatestSession(null)}
                      className="px-4 py-2 bg-white/5 text-text-muted text-xs font-bold rounded-pill hover:bg-white/10 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col gap-2 max-w-[85%]",
                    m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 text-sm leading-relaxed",
                    m.role === 'user' 
                      ? "bg-bg-sunken border border-border-low rounded-t-2xl rounded-bl-2xl text-text-primary" 
                      : "bg-white/5 border border-white/10 rounded-t-2xl rounded-br-2xl text-text-secondary"
                  )}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border-low bg-bg-sunken/30 relative">
              <AnimatePresence>
                {showSlashMenu && (
                  <SlashCommandMenu 
                    onSelect={(cmd) => {
                      setInput(`/${cmd} `)
                      setShowSlashMenu(false)
                    }} 
                  />
                )}
              </AnimatePresence>

              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Fred anything or type '/'..."
                  className="w-full bg-bg-base border border-border-low rounded-2xl p-4 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none h-24"
                  autoFocus
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="absolute bottom-4 right-4 p-2 bg-primary text-text-on-primary rounded-pill disabled:opacity-30 transition-all hover:scale-110 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>

              {/* Suggestions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {['/deploy', '/qa', 'Dark mode'].map((suggest) => (
                  <button 
                    key={suggest}
                    onClick={() => handleSend(suggest)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-pill text-[10px] font-bold text-text-muted hover:text-primary hover:border-primary/30 transition-all uppercase tracking-wider"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
