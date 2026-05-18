import React, { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  ViewUpdate,
} from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { css } from '@codemirror/lang-css'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'

interface CodeEditorProps {
  content: string
  language?: string
  onChange?: (value: string) => void
  readOnly?: boolean
}

const getLanguageExtension = (lang?: string) => {
  switch (lang?.toLowerCase()) {
    case 'javascript':
    case 'jsx':
    case 'typescript':
    case 'tsx':
      return javascript({ jsx: true, typescript: true })
    case 'json':
      return json()
    case 'css':
      return css()
    case 'markdown':
      return markdown()
    default:
      return javascript({ jsx: true, typescript: true })
  }
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  content,
  language,
  onChange,
  readOnly = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const startState = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        oneDark,
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        getLanguageExtension(language),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
            backgroundColor: 'transparent !important',
          },
          '.cm-content': {
            fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
            padding: '20px 0',
          },
          '.cm-gutters': {
            backgroundColor: 'transparent !important',
            border: 'none',
            color: '#444',
            paddingLeft: '10px',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
          },
        }),
        EditorState.readOnly.of(readOnly),
      ],
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync content if it changes externally
  useEffect(() => {
    if (viewRef.current && content !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: content },
      })
    }
  }, [content])

  return (
    <div
      ref={editorRef}
      className="bg-background/40 h-full w-full overflow-hidden backdrop-blur-md"
    />
  )
}
