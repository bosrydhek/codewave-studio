import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { FileTree, FileNode } from './FileTree'
import { CodeEditor } from './CodeEditor'
import { Terminal, LogEntry } from './Terminal'

interface EditorLayoutProps {
  files: FileNode[]
  activeFile: FileNode | null
  onFileSelect: (file: FileNode) => void
  onCodeChange: (value: string) => void
  terminalLogs?: LogEntry[]
  onTerminalCommand: (cmd: string) => void
  isTerminalOpen: boolean
  onToggleTerminal: (open: boolean) => void
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  files,
  activeFile,
  onFileSelect,
  onCodeChange,
  terminalLogs = [],
  onTerminalCommand,
  isTerminalOpen,
  onToggleTerminal,
}) => {
  const [direction, setDirection] = React.useState<'horizontal' | 'vertical'>('horizontal')

  React.useEffect(() => {
    const handleResize = () => {
      setDirection(window.innerWidth < 768 ? 'vertical' : 'horizontal')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="bg-bg-base flex h-full w-full flex-col overflow-hidden font-sans">
      <PanelGroup direction={direction}>
        {/* Sidebar / File Tree */}
        <Panel defaultSize={20} minSize={15} collapsible>
          <FileTree data={files} onFileSelect={onFileSelect} selectedFileId={activeFile?.id} />
        </Panel>

        <PanelResizeHandle className="bg-border-low hover:bg-primary-tint-1 w-px transition-colors" />

        {/* Main Editor & Terminal Area */}
        <Panel defaultSize={80}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={70} minSize={30}>
              {activeFile ? (
                <div className="flex h-full flex-col">
                  {/* Tab bar (simplified for now) */}
                  <div className="bg-bg-sunken border-border-low flex h-10 items-center gap-4 border-b px-4">
                    <span className="text-text-primary flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                      {activeFile.name}
                      <div className="bg-primary h-1.5 w-1.5 rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <CodeEditor
                      content={activeFile.content || ''}
                      language={activeFile.language}
                      onChange={onCodeChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-text-muted font-display flex h-full items-center justify-center italic select-none">
                  <p className="text-sm">Select a file to start coding</p>
                </div>
              )}
            </Panel>

            {isTerminalOpen && (
              <>
                <PanelResizeHandle className="bg-border-low hover:bg-primary-tint-1 h-px transition-colors" />
                <Panel defaultSize={30} minSize={20} collapsible>
                  <Terminal
                    isOpen={true}
                    onClose={() => onToggleTerminal(false)}
                    logs={terminalLogs}
                    onCommand={onTerminalCommand}
                  />
                </Panel>
              </>
            )}
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  )
}
