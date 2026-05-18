import React, { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, FileCode, FileJson, FileText, Hash } from 'lucide-react'
import { cn } from '../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'directory'
  children?: FileNode[]
  content?: string
  language?: string
}

interface FileTreeProps {
  data: FileNode[]
  onFileSelect: (file: FileNode) => void
  selectedFileId?: string
}

const FileIcon = ({ name }: { name: string }) => {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return <FileCode className="text-primary h-4 w-4" />
    case 'json':
      return <FileJson className="h-4 w-4 text-indigo-400" />
    case 'css':
      return <Hash className="text-primary-tint-1 h-4 w-4" />
    default:
      return <FileText className="text-text-muted h-4 w-4" />
  }
}

const TreeNode: React.FC<{
  node: FileNode
  depth: number
  onFileSelect: (file: FileNode) => void
  selectedFileId?: string
}> = ({ node, depth, onFileSelect, selectedFileId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isSelected = selectedFileId === node.id

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.type === 'directory') {
      setIsOpen(!isOpen)
    } else {
      onFileSelect(node)
    }
  }

  return (
    <div className="select-none">
      <div
        onClick={handleToggle}
        className={cn(
          'group mx-1 flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1 transition-colors',
          isSelected
            ? 'bg-bg-surface text-text-primary ring-border-low shadow-sm ring-1'
            : 'text-text-muted hover:bg-bg-sunken hover:text-text-primary',
        )}
        style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
      >
        <span className="flex h-4 w-4 items-center justify-center">
          {node.type === 'directory' &&
            (isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
        </span>
        <span className="flex h-4 w-4 items-center justify-center">
          {node.type === 'directory' ? (
            <Folder
              className={cn(
                'h-4 w-4',
                isOpen ? 'text-primary fill-primary/20' : 'text-primary-tint-1/60',
              )}
            />
          ) : (
            <FileIcon name={node.name} />
          )}
        </span>
        <span className="truncate text-sm font-medium">{node.name}</span>
      </div>

      <AnimatePresence>
        {isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                onFileSelect={onFileSelect}
                selectedFileId={selectedFileId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const FileTree: React.FC<FileTreeProps> = ({ data, onFileSelect, selectedFileId }) => {
  return (
    <div className="bg-bg-sunken/40 border-border-low flex h-full flex-col overflow-y-auto border-r py-4 font-sans backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between px-5">
        <h3 className="text-text-muted font-display text-[10px] font-black tracking-[0.2em] uppercase">
          Files
        </h3>
      </div>
      <div className="flex-1">
        {data.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            onFileSelect={onFileSelect}
            selectedFileId={selectedFileId}
          />
        ))}
      </div>
    </div>
  )
}
