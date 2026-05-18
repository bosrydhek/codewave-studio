'use client'

import React, { useState } from 'react'
import NextImage from 'next/image'
import { Sparkles, Key, Copy, Check } from 'lucide-react'
import {
  supabase,
  signInWithEmail,
  signUpWithEmail,
  signInWithMagicLink,
  signInWithOAuth,
} from '../lib/supabase'
import { getAppUrl } from '../lib/urls'

interface AuthMessage {
  type: 'success' | 'error'
  text: string
}

interface AuthViewProps {
  onSignupSuccess?: () => void
}

export default function AuthView({ onSignupSuccess }: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'magic'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<AuthMessage | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const handleGeneratePassword = () => {
    const length = 16
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-='

    let pass = ''
    pass += uppercase[Math.floor(Math.random() * uppercase.length)]
    pass += lowercase[Math.floor(Math.random() * lowercase.length)]
    pass += numbers[Math.floor(Math.random() * numbers.length)]
    pass += symbols[Math.floor(Math.random() * symbols.length)]

    const allChars = uppercase + lowercase + numbers + symbols
    for (let i = pass.length; i < length; i++) {
      pass += allChars[Math.floor(Math.random() * allChars.length)]
    }

    pass = pass
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('')
    setGeneratedPassword(pass)
    setIsCopied(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const useGeneratedPassword = () => {
    setPassword(generatedPassword)
    setGeneratedPassword('')
    setIsCopied(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      let result
      if (mode === 'login') {
        result = await signInWithEmail(email, password)
      } else if (mode === 'signup') {
        result = await signUpWithEmail(email, password)
        // Create initial profile in public.users if successful
        if (result.data?.user) {
          const { error: profileError } = await supabase.from('users').upsert({
            id: result.data.user.id,
            email: result.data.user.email,
            full_name: fullName,
            settings: {},
            skills: [],
            updated_at: new Date().toISOString(),
          })
          if (profileError) console.error('Error creating user profile:', profileError)

          if (onSignupSuccess) onSignupSuccess()
        }
      } else {
        result = await signInWithMagicLink(email)
      }

      if (result.error) throw result.error

      if (mode === 'signup')
        setMessage({ type: 'success', text: 'Check your email for confirmation link!' })
      if (mode === 'magic')
        setMessage({ type: 'success', text: 'Magic link sent! Check your inbox.' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setMessage({ type: 'error', text: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in zoom-in bg-bg-base mx-auto flex min-h-screen max-w-lg flex-1 flex-col items-center justify-center p-6 text-center duration-700 sm:p-12">
      {/* Branding */}
      <div 
        className="rounded-modal bg-text-primary text-bg-base mb-12 flex h-16 w-16 items-center justify-center shadow-2xl"
        aria-hidden="true"
      >
        <Sparkles size={32} />
      </div>

      <h2 className="text-text-primary font-display mb-4 text-4xl font-normal tracking-tight">
        {mode === 'login' && 'Sign in to Designwave'}
        {mode === 'signup' && 'Create your account'}
        {mode === 'magic' && 'Passwordless Sign in'}
      </h2>
      <p className="text-text-intro mb-12 text-lg leading-relaxed italic">
        Secure your creative flow with production-grade encryption.
      </p>

      {/* Main Auth Form */}
      <form onSubmit={handleSubmit} className="mb-12 w-full space-y-6">
        <div className="group relative">
          <input
            type="email"
            placeholder="Email Address…"
            aria-label="Email Address"
            required
            autoComplete="email"
            spellCheck={false}
            className="bg-bg-sunken border-border-low text-text-secondary focus:border-border-mid placeholder:text-text-muted/50 w-full rounded-sm border px-5 py-4 text-base shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {mode === 'signup' && (
          <div className="group animate-in fade-in slide-in-from-top-2 relative duration-300">
            <input
              type="text"
              placeholder="Full Name"
              aria-label="Full Name"
              required={mode === 'signup'}
              className="bg-bg-sunken border-border-low text-text-secondary focus:border-border-mid placeholder:text-text-muted/50 w-full rounded-sm border px-5 py-4 text-base shadow-sm transition-all focus:outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        {mode !== 'magic' && (
          <div className="group relative flex flex-col gap-2">
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              required
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              className="bg-bg-sunken border-border-low text-text-secondary focus:border-border-mid placeholder:text-text-muted/50 w-full rounded-sm border px-5 py-4 text-base shadow-sm transition-all focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === 'signup' && (
              <div className="mt-1 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-primary hover:text-primary-tint-1 flex items-center gap-1.5 self-start text-left text-sm font-medium transition-colors"
                >
                  <Key size={14} /> Generate strong password
                </button>
                {generatedPassword && (
                  <div className="bg-bg-sunken border-border-low animate-in fade-in slide-in-from-top-2 flex items-center justify-between gap-4 rounded-sm border p-4 shadow-inner duration-300">
                    <span className="text-text-secondary text-left font-mono text-xs break-all">
                      {generatedPassword}
                    </span>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="hover:bg-bg-surface rounded-base text-text-muted hover:text-text-primary flex items-center justify-center p-1.5 transition-colors"
                        title="Copy to clipboard"
                      >
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={useGeneratedPassword}
                        className="btn-primary-gradient text-text-on-primary rounded-pill px-3 py-1.5 text-xs font-bold shadow-sm transition-all hover:opacity-90"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary-gradient text-text-on-primary rounded-pill flex w-full items-center justify-center gap-3 py-4 text-base font-bold shadow-lg transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
        >
          {isLoading && (
            <svg
              width="20"
              className="border-text-on-primary/20 border-t-text-on-primary h-5 w-5 animate-spin rounded-full border-2"
              viewBox="0 0 24 24"
            />
          )}
          {mode === 'login' ? 'Sign In to Designwave' : mode === 'signup' ? 'Create Your Account' : 'Send Magic Link'}
        </button>
      </form>

      {/* Mode Toggles */}
      <div className="text-text-muted mb-12 flex items-center justify-center gap-6 text-sm font-medium">
        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="hover:text-text-primary transition-colors"
        >
          {mode === 'login' ? 'Create an account' : 'Sign in instead'}
        </button>
        <div className="bg-border-low h-1.5 w-1.5 rounded-full" />
        <button
          onClick={() => setMode(mode === 'magic' ? 'login' : 'magic')}
          className="hover:text-text-primary transition-colors"
        >
          {mode === 'magic' ? 'Back to password' : 'Use magic link'}
        </button>
      </div>

      {/* Social Dividers */}
      <div className="mb-8 flex w-full items-center gap-4 opacity-50">
        <div className="bg-border-low h-px flex-1" />
        <span className="text-text-muted text-[10px] font-bold tracking-widest uppercase">
          Social Sign-In
        </span>
        <div className="bg-border-low h-px flex-1" />
      </div>

      {/* Social Providers */}
      <div className="flex w-full items-center justify-center">
        {(['google'] as const).map((provider) => (
          <button
            key={provider}
            onClick={async () => {
              try {
                const redirectUrl = `${getAppUrl()}/auth/callback?next=/app/dashboard`

                const { error } = await signInWithOAuth(provider, redirectUrl)
                if (error) throw error
              } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error'
                setMessage({
                  type: 'error',
                  text: `Failed to sign in with ${provider}: ${message}`,
                })
              }
            }}
            className="bg-bg-surface border-border-low rounded-modal hover:bg-bg-elevated hover:border-primary-tint-1/30 group flex min-w-[240px] flex-col items-center justify-center gap-4 border p-8 transition-all"
          >
            <div className="relative h-10 w-10 opacity-60 invert transition-all group-hover:opacity-100">
              <NextImage
                src={`https://authjs.dev/img/providers/${provider}.svg`}
                alt={provider}
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-text-muted group-hover:text-text-primary text-xs font-bold tracking-widest uppercase">
              Continue with {provider}
            </span>
          </button>
        ))}
      </div>

      {/* Status Messages */}
      {message && (
        <div
          className={`rounded-card animate-in slide-in-from-top-2 mt-8 border p-4 text-sm font-medium duration-300 ${
            message.type === 'error'
              ? 'bg-error/10 border-error-muted text-error'
              : 'bg-success/10 border-success-muted text-success'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}
