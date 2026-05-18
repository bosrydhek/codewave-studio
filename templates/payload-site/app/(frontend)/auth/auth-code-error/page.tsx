'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An unknown error occurred during authentication.'

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="animate-in fade-in zoom-in w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-2xl duration-500">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 shadow-xl">
          <span className="material-icons text-2xl">error_outline</span>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-white">Authentication Error</h1>
        <p className="mb-8 text-center text-sm leading-relaxed text-[#888]">
          {error}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full rounded-2xl bg-white py-4 text-center text-base font-bold text-black shadow-lg transition-all hover:bg-gray-200 active:scale-[0.98]"
          >
            Back to Login
          </Link>
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

export default function AuthCodeErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
