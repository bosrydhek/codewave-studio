import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Critical System Failure:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-6 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-red-500/20 bg-red-500/10 shadow-2xl">
            <span className="material-icons text-4xl text-red-500">priority_high</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white">System Interrupted</h1>
          <p className="mb-12 max-w-sm text-base leading-relaxed text-[#888]">
            Designwave encountered a critical state error. Your session has been protected, but a
            reload is required to restore the AI engine.
          </p>
          <div className="flex w-full max-w-xs flex-col gap-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-xl bg-white py-4 text-base font-bold text-black shadow-lg transition-all hover:bg-gray-200"
            >
              Recover Session
            </button>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-4 text-sm font-medium text-[#444] transition-all hover:text-[#888]"
            >
              Attempt Soft Reset
            </button>
          </div>
          {this.state.error && (
            <div className="mt-12 rounded-xl border border-white/5 bg-black p-4 font-mono text-[10px] tracking-widest text-[#222] uppercase">
              ID: {btoa(this.state.error.message).substring(0, 16)}
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default GlobalErrorBoundary
