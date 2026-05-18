'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ConsentContent() {
  const searchParams = useSearchParams()
  const clientName = searchParams.get('client_name') || 'External Application'
  const scope = searchParams.get('scope') || 'basic profile'

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="animate-in fade-in zoom-in w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-2xl duration-500">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black shadow-xl">
          <span className="material-icons text-2xl">auto_awesome</span>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-white">Allow Access?</h1>
        <p className="mb-8 text-center text-sm leading-relaxed text-[#888]">
          <span className="font-medium text-white">{clientName}</span> is requesting permission to
          access your Designwave account.
        </p>

        <div className="mb-8 space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <h3 className="mb-3 text-xs font-bold tracking-widest text-white/40 uppercase">
              Requested Scopes
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              {scope.split(' ').map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="bg-brand-500 h-1.5 w-1.5 rounded-full" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="w-full rounded-2xl bg-white py-4 text-base font-bold text-black shadow-lg transition-all hover:bg-gray-200 active:scale-[0.98]"
            onClick={() => {
              // In a real app, this would redirect back to Supabase auth with approval
              console.log('Approved')
            }}
          >
            Allow Access
          </button>
          <button
            className="w-full rounded-2xl bg-white/[0.03] py-4 text-sm font-semibold text-white/60 transition-all hover:bg-white/5 hover:text-white"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
        </div>

        <div className="mt-8 border-t border-white/5 pt-8 text-center">
          <p className="text-[10px] tracking-[0.2em] text-white/20 uppercase">
            Secure Authorization Engine • 2026
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OAuthConsentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
        </div>
      }
    >
      <ConsentContent />
    </Suspense>
  )
}
