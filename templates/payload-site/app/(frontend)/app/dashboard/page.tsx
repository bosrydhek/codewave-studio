import { redirect } from 'next/navigation'
import { AppDashboardLayout } from '@/components/AppDashboardLayout'
import React from 'react'

export default async function DashboardPage() {
  return (
    <main className="min-h-screen bg-bg-base">
      <AppDashboardLayout />
    </main>
  )
}
