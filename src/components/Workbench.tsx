import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary'
import { Dashboard } from '@/components/Dashboard'
import { BillingValidationPage } from '@/components/BillingValidationPage'

export interface WorkbenchProps {
  initialView?: 'welcome' | 'canvas' | 'editor' | 'dashboard' | 'projects' | 'billing-validation'
}

export function Workbench({ initialView = 'dashboard' }: WorkbenchProps) {
  const navigate = useNavigate()
  
  const [user] = useState<any>({
    id: 'local-dev',
    email: 'local@developer.com',
    user_metadata: { full_name: 'Local Developer' },
    settings: { defaultProvider: 'automatic' }
  })

  const [currentView, setCurrentView] = useState<'dashboard' | 'billing-validation' | 'workbench'>(
    initialView === 'billing-validation' ? 'billing-validation' : 'dashboard'
  )

  // Handle active build navigation / redirect
  const handleViewChange = (view: 'dashboard' | 'workbench' | 'billing-validation') => {
    if (view === 'workbench') {
      const mockProjects = JSON.parse(localStorage.getItem('designwave_projects') || '[]')
      if (mockProjects.length > 0) {
        const latestProj = mockProjects[mockProjects.length - 1]
        navigate(`/portal/${latestProj.id}`)
      } else {
        navigate('/intake')
      }
    } else {
      setCurrentView(view)
    }
  }

  return (
    <GlobalErrorBoundary>
      <div className="bg-bg-base selection:bg-primary-tint-1/30 selection:text-text-primary flex h-screen flex-col overflow-hidden">
        {/* Dynamic Background Glows */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-950/50 opacity-50 blur-[120px]" />
          <div className="bg-primary-tint-2/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full opacity-30 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-1 overflow-hidden">
          <Sidebar
            user={user}
            onOpenSettings={() => {}}
            onNewProject={() => {
              navigate('/intake')
            }}
            onViewChange={handleViewChange}
            currentView={currentView}
          />

          <main className="bg-bg-base/40 relative flex min-w-0 flex-1 flex-col overflow-hidden backdrop-blur-sm">
            {currentView === 'dashboard' ? (
              <Dashboard />
            ) : (
              <BillingValidationPage />
            )}
          </main>
        </div>
      </div>
    </GlobalErrorBoundary>
  )
}
