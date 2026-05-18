'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
// XTerm is imported dynamically in useEffect to prevent SSR errors

export type LogType = 'info' | 'warn' | 'error' | 'agent' | 'success'

export interface LogEntry {
  id: string
  type: LogType
  message: string
  timestamp: Date
}

interface TerminalProps {
  isOpen: boolean
  onClose: () => void
  logs?: LogEntry[]
  onCommand?: (command: string) => void
  className?: string
}

export function Terminal({ isOpen, onClose, onCommand, className }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<import('xterm').Terminal | null>(null)
  const fitAddonRef = useRef<import('xterm-addon-fit').FitAddon | null>(null)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return

    const initTerminal = async () => {
      // Dynamic imports for client-side only
      const { Terminal: XTermClass } = await import('xterm')
      const { FitAddon: FitAddonClass } = await import('xterm-addon-fit')
      await import('xterm/css/xterm.css')

      const term = new XTermClass({
        cursorBlink: true,
        fontSize: 12,
        fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, "Courier New", monospace',
        theme: {
          background: 'transparent',
          foreground: 'var(--color-text-primary)',
          cursor: 'var(--color-primary)',
          selectionBackground: 'var(--color-primary-tint-1)',
        },
        allowTransparency: true,
      })

      const fitAddon = new FitAddonClass()
      term.loadAddon(fitAddon)
      term.open(terminalRef.current!)
      fitAddon.fit()

      term.writeln('\x1b[38;5;99mDesignwave Agent Terminal v1.0.0\x1b[0m')
      term.writeln('Type a command to execute logic or interact with the file system.\r\n')
      term.write('\x1b[32m➜\x1b[0m \x1b[36m~\x1b[0m ')

      let currentLine = ''
      term.onData((data: string) => {
        const code = data.charCodeAt(0)
        if (code === 13) {
          // Enter
          term.write('\r\n')
          if (currentLine.trim()) {
            onCommand?.(currentLine.trim())
          }
          currentLine = ''
          term.write('\x1b[32m➜\x1b[0m \x1b[36m~\x1b[0m ')
        } else if (code === 127) {
          // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1)
            term.write('\b \b')
          }
        } else if (code < 32) {
          // Control characters
        } else {
          currentLine += data
          term.write(data)
        }
      })

      xtermRef.current = term
      fitAddonRef.current = fitAddon

      const handleResize = () => fitAddon.fit()
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
        term.dispose()
      }
    }

    const cleanupPromise = initTerminal()

    return () => {
      cleanupPromise.then((cleanup) => cleanup?.())
    }
  }, [onCommand])

  useEffect(() => {
    if (isOpen && fitAddonRef.current) {
      setTimeout(() => fitAddonRef.current?.fit(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newHeight = window.innerHeight - e.clientY
      if (newHeight > 100 && newHeight < window.innerHeight * 0.9) {
        fitAddonRef.current?.fit()
      }
    }
    const handleMouseUp = () => setIsResizing(false)

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 transition-all duration-500 ease-in-out',
        'h-[45vh] shadow-[0_-20px_60px_rgba(0,0,0,0.6)]',
        className,
      )}
    >
      <div className="bg-bg-base/40 border-primary-tint-2/30 flex h-full flex-col overflow-hidden border-t-2 backdrop-blur-xl">
        {/* Terminal Header */}
        <div className="bg-bg-sunken border-border-low flex h-14 shrink-0 items-center justify-between border-b px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="h-3.5 w-3.5 rounded-full border border-red-500/80 bg-red-500/50" />
              <div className="h-3.5 w-3.5 rounded-full border border-yellow-500/80 bg-yellow-500/50" />
              <div className="h-3.5 w-3.5 rounded-full border border-green-500/80 bg-green-500/50" />
            </div>
            <div className="bg-border-low mx-1 h-6 w-px" />
            <span className="text-text-muted text-xs font-black tracking-[0.25em] uppercase">
              Agent Intelligence Terminal
            </span>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-bg-surface text-text-muted hover:text-text-primary rounded-sm p-2.5 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Terminal Output Area */}
        <div
          ref={terminalRef}
          className="bg-bg-base/80 custom-scrollbar flex-1 overflow-hidden p-5 font-mono text-sm leading-relaxed"
          style={{ height: 'calc(100% - 56px)' }}
        />
      </div>
    </div>
  )
}
