'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <h2 className="text-red-400 font-medium">حدث خطأ</h2>
          <p className="text-sm text-red-300/80 mt-1">
            {this.state.error?.message || 'حدث خطأ غير متوقع'}
          </p>
        </div>
      )
    }

    return this.props.children
  }
} 