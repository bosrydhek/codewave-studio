import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class CanvasErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Canvas error caught:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="m-8 flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0a0a0a]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <span className="text-2xl">⚡</span>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">Canvas execution failed</h2>
          <p className="mb-6 max-w-xs text-center text-sm text-white/40">
            The AI-generated code encountered a runtime error. You can try adjusting your prompt to
            fix it.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/60 transition-colors hover:text-white"
          >
            Reset Canvas
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default CanvasErrorBoundary
