'use client'

import React from 'react'
import GlobalErrorBoundary from './GlobalErrorBoundary'
import { QueueProvider } from '@/lib/contexts/QueueContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalErrorBoundary>
      <QueueProvider>{children}</QueueProvider>
    </GlobalErrorBoundary>
  )
}
