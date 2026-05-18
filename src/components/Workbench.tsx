'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'

import WelcomeView from '@/components/WelcomeView'
import { DatabaseSelectionFlow } from '@/components/database/DatabaseSelectionFlow'
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary'
import { Terminal } from '@/components/Terminal'
import { Command, Code2, MonitorPlay } from 'lucide-react'
import { EditorLayout } from '@/components/EditorLayout'
import { FileNode } from '@/components/FileTree'
import { cn } from '@/lib/utils'
import { QueueDrawer } from '@/components/QueueDrawer'
import { Dashboard } from '@/components/Dashboard'
import { Statusbar } from '@/components/Statusbar'
import { BillingValidationPage } from '@/components/BillingValidationPage'
import { CoPilotButton } from '@/components/CoPilotButton'
import Canvas from '@/components/Canvas'

export interface WorkbenchProps {
  initialView?: 'welcome' | 'canvas' | 'editor' | 'dashboard' | 'projects' | 'billing-validation'
}

export function Workbench({ initialView = 'welcome' }: WorkbenchProps) {
  // Use initialView logic if needed, currently defaulting based on prop
  console.log('Target initial view:', initialView)
  const [isAuthenticated] = useState(true)
  const [user] = useState<any>({
    id: 'local-dev',
    email: 'local@developer.com',
    user_metadata: { full_name: 'Local Developer' },
    settings: { defaultProvider: 'automatic' }
  })
  // Auth disabled temporarily for development
  useEffect(() => {
    // Auth disabled temporarily for development
    console.log('[Workbench] Auth disabled: Local developer mode active')
    return () => {}
  }, [])

  const [showWelcome, setShowWelcome] = useState(false)
  const [showDBFlow, setShowDBFlow] = useState(false)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'canvas' | 'code'>('canvas')
  const [activeFile, setActiveFile] = useState<FileNode | null>(null)
  const [files, setFiles] = useState<FileNode[]>([])
  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard' | 'workbench' | 'billing-validation'>(
    initialView === 'dashboard' ? 'dashboard' : initialView === 'billing-validation' ? 'billing-validation' : 'workbench'
  )

  // --- Real File System Integration ---
  const callMcp = React.useCallback(async (tool: string, args: any) => {
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, arguments: args }),
      })
      const data = await res.json()
      return data.content?.[0]?.text
    } catch (err) {
      console.error(`MCP ${tool} error:`, err)
      return null
    }
  }, [])

  useEffect(() => {
    const fetchFileTree = async (dir: string = '.'): Promise<FileNode[]> => {
      const raw = await callMcp('fs_read_dir', { path: dir })
      if (!raw) return []

      const entries = JSON.parse(raw)
      const nodes: FileNode[] = []

      for (const entry of entries) {
        const node: FileNode = {
          id: `${dir}/${entry.name}`,
          name: entry.name,
          type: entry.type,
        }

        if (entry.type === 'directory') {
          node.children = []
        }
        nodes.push(node)
      }
      return nodes
    }

    if (isAuthenticated) {
      const loadFiles = async () => {
        try {
          const tree = await fetchFileTree()
          setFiles(tree)
        } catch (err) {
          console.error('Failed to load files:', err)
        }
      }
      loadFiles()
    }
  }, [isAuthenticated, callMcp])

  const handleFileSelect = async (file: FileNode) => {
    if (file.type === 'file') {
      const content = await callMcp('fs_read_file', { path: file.id })
      setActiveFile({ ...file, content: content || '' })
    }
  }

  const handleCommand = async (cmd: string) => {
    const output = await callMcp('shell_execute', { command: cmd })
    // The Terminal component handles echoing, but we could add agent responses here
    console.log('Command output:', output)
  }

  const [, setIsSettingsOpen] = useState(false)

  if (showWelcome) {
    return <WelcomeView fullName="User" onGetStarted={() => setShowWelcome(false)} />
  }

  return (
    <GlobalErrorBoundary>
      <div className="bg-bg-base selection:bg-primary-tint-1/30 selection:text-text-primary flex h-screen flex-col overflow-hidden">
        {/* Dynamic Background Glows */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-950 opacity-50 blur-[120px]" />
          <div className="bg-primary-tint-2/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full opacity-30 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-1 overflow-hidden">
          <Sidebar
            user={user}
            onOpenSettings={() => setIsSettingsOpen(true)}
            featuredSkills={[]}
            onInstallSkill={async () => {}}
            onSelectProvider={() => {}}
            onNewProject={() => {
              setShowDBFlow(true)
            }}
            onViewChange={(view: any) => setCurrentView(view)}
            currentView={currentView}
            projectFiles={files.map((f) => f.name)}
            activeFile={activeFile?.name}
            activeFileContent={activeFile?.content}
          />

          <main className="bg-bg-base/40 relative flex min-w-0 flex-1 flex-col overflow-hidden backdrop-blur-sm">
            {showDBFlow ? (
              <div className="flex h-full items-center justify-center">
                <DatabaseSelectionFlow />
              </div>
            ) : currentView === 'dashboard' ? (
              <Dashboard onNewProject={() => setShowDBFlow(true)} onOpenProject={(id) => { console.log('Open project', id); setCurrentView('workbench'); }} />
            ) : currentView === 'billing-validation' ? (
              <BillingValidationPage />
            ) : (
              <div className="relative flex h-full w-full flex-col">
                {/* View Toggle */}
                <div className="bg-bg-sunken border-border-low rounded-pill absolute top-2.5 left-1/2 z-40 flex -translate-x-1/2 border p-1 shadow-2xl backdrop-blur-xl">
                  <button
                    onClick={() => setViewMode('canvas')}
                    className={cn(
                      'rounded-pill flex items-center gap-2 px-6 py-2 text-sm font-bold transition-all',
                      viewMode === 'canvas'
                        ? 'bg-bg-surface text-text-primary ring-border-mid shadow-xl ring-1'
                        : 'text-text-muted hover:text-text-primary',
                    )}
                  >
                    <MonitorPlay size={18} />
                    Canvas
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={cn(
                      'rounded-pill flex items-center gap-2 px-6 py-2 text-sm font-bold transition-all',
                      viewMode === 'code'
                        ? 'bg-bg-surface text-text-primary ring-border-mid shadow-xl ring-1'
                        : 'text-text-muted hover:text-text-primary',
                    )}
                  >
                    <Code2 size={18} />
                    Code
                  </button>
                </div>

                <div className="flex-1 overflow-hidden">
                  {viewMode === 'canvas' ? (
                    <div className="flex h-full flex-col items-center justify-center p-8">
                      <Canvas
                        generatedCode={activeFile?.content || null}
                        onDeploy={(platform: string) => console.log('Deploying to', platform)}
                        onGithubSync={async () => console.log('Syncing to GitHub')}
                      />
                    </div>
                  ) : (
                    <div className="h-full w-full">
                      <EditorLayout
                        files={files}
                        activeFile={activeFile}
                        onFileSelect={handleFileSelect}
                        onCodeChange={async (newCode) => {
                          if (activeFile) {
                            await callMcp('fs_write_file', {
                              path: activeFile.id,
                              content: newCode,
                            })
                            setActiveFile((prev) => (prev ? { ...prev, content: newCode } : null))
                          }
                        }}
                        onTerminalCommand={handleCommand}
                        isTerminalOpen={isTerminalOpen}
                        onToggleTerminal={setIsTerminalOpen}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* Terminal Toggle Button */}
            <button
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="rounded-modal btn-primary-gradient text-text-on-primary group absolute right-8 bottom-8 z-40 p-4 shadow-[0_8px_32px_rgba(var(--color-primary),0.3)] transition-all hover:scale-105 active:scale-95"
              title="Toggle Agent Terminal"
            >
              <Command className="h-6 w-6" />
            </button>
          </main>

          <QueueDrawer />
        </div>
      </div>

      {/* Terminal Overlay */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onCommand={handleCommand}
      />
      <CoPilotButton userId={user?.id} />
      <Statusbar />
    </GlobalErrorBoundary>
  )
}
