'use client'

import React, { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { Dashboard } from '@/components/Dashboard'
import { Statusbar } from '@/components/Statusbar'
import { CoPilotButton } from '@/components/CoPilotButton'
import { supabase } from '@/lib/supabase'

export function AppDashboardLayout() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (mounted) {
          setUser(user)
          setIsLoading(false)
        }
      } catch {
        if (mounted) setIsLoading(false)
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (mounted) {
        setUser(session?.user || null)
        setIsLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm font-medium text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-base selection:bg-primary-tint-1/30 selection:text-text-primary flex h-screen flex-col overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-950 opacity-40 blur-[120px]" />
        <div className="bg-primary-tint-2/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full opacity-20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        <DashboardSidebar user={user} onNewProject={() => {}} />

        <main className="bg-bg-base/40 relative flex min-w-0 flex-1 flex-col overflow-hidden backdrop-blur-sm">
          <Dashboard onNewProject={() => {}} onOpenProject={(id) => console.log('Open project', id)} />
        </main>
      </div>

      <CoPilotButton userId={user?.id} />
      <Statusbar />
    </div>
  )
}
