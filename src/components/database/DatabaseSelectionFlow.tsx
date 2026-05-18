'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Database, Server, Plus, Check, ChevronRight, Globe, Lock, Zap } from 'lucide-react'
import { cn } from '../../lib/utils'

type DBType = 'postgres' | 'mongodb' | 'sqlite' | 'other'

interface DBConfig {
  type: DBType
  connectionString: string
  useExisting: boolean
}

interface DatabaseSelectionFlowProps {
  onFinish?: (config: DBConfig) => void
  onCancel?: () => void
}

export function DatabaseSelectionFlow({ onFinish, onCancel }: DatabaseSelectionFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [config, setConfig] = useState<DBConfig>({
    type: 'postgres',
    connectionString: '',
    useExisting: true,
  })

  const dbOptions: { id: DBType; name: string; icon: React.ReactNode; description: string }[] = [
    {
      id: 'postgres',
      name: 'PostgreSQL',
      icon: <Database className="h-5 w-5 text-blue-400" />,
      description: "The world's most advanced open source database.",
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      icon: <Server className="h-5 w-5 text-green-400" />,
      description: 'NoSQL database for flexible data modeling.',
    },
    {
      id: 'sqlite',
      name: 'SQLite',
      icon: <Globe className="h-5 w-5 text-purple-400" />,
      description: 'Lightweight, file-based database. Perfect for edge.',
    },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 relative mx-auto max-w-xl space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl duration-700">
      <div className="space-y-2">
        <h2 className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-3xl font-bold text-transparent">
          {step === 1 && 'Choose your database'}
          {step === 2 && 'Select database type'}
          {step === 3 && 'Connection details'}
        </h2>
        <p className="text-sm text-white/40">
          {step === 1 && 'Start from scratch or use your existing infrastructure.'}
          {step === 2 && 'Payload 3.0 supports multiple storage engines.'}
          {step === 3 && 'Securely connect your application to your data.'}
        </p>
      </div>

      {step === 1 && (
        <div className="grid gap-4">
          <button
            onClick={() => {
              setConfig({ ...config, useExisting: true })
              setStep(3)
            }}
            className="group flex w-full items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:bg-white/10"
          >
            <div className="mr-4 rounded-xl bg-blue-500/20 p-4 transition-transform group-hover:scale-110">
              <Database className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Use Existing Database</h3>
              <p className="text-xs text-white/40">Connect to an already provisioned instance.</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/20 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {
              setConfig({ ...config, useExisting: false })
              setStep(2)
            }}
            className="group flex w-full items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:bg-white/10"
          >
            <div className="mr-4 rounded-xl bg-orange-500/20 p-4 transition-transform group-hover:scale-110">
              <Plus className="h-6 w-6 text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Create New Database</h3>
              <p className="text-xs text-white/40">Provision a fresh database for this project.</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/20 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {dbOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setConfig({ ...config, type: opt.id })}
                className={cn(
                  'flex w-full items-center rounded-xl border p-4 text-left transition-all',
                  config.type === opt.id
                    ? 'border-white/40 bg-white/10 shadow-lg'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8',
                )}
              >
                <div className="mr-4 rounded-lg bg-white/5 p-2">{opt.icon}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{opt.name}</h4>
                  <p className="text-[10px] tracking-wider text-white/30 uppercase">
                    {opt.description}
                  </p>
                </div>
                {config.type === opt.id && <Check className="h-4 w-4 text-white" />}
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              className="flex-1 bg-white text-black hover:bg-white/90"
              onClick={() => setStep(3)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 px-1 text-xs font-medium text-white/50">
                <Lock className="h-3 w-3" /> Connection String
              </label>
              <input
                type="text"
                placeholder="postgres://user:pass@host:5432/db"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white transition-all placeholder:text-white/10 focus:ring-2 focus:ring-white/20 focus:outline-none"
                value={config.connectionString}
                onChange={(e) => setConfig({ ...config, connectionString: e.target.value })}
              />
              <p className="px-1 text-[10px] text-white/20">
                Your credentials are encrypted and never stored in plain text.
              </p>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => setStep(config.useExisting ? 1 : 2)}
            >
              Back
            </Button>
            <Button
              className="flex-1 border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
              onClick={() => {
                if (onFinish) {
                  onFinish(config)
                }
              }}
            >
              Finish Setup
            </Button>
          </div>
        </div>
      )}

      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-8 right-8 text-white/20 transition-colors hover:text-white"
        >
          <Zap size={20} className="rotate-45" />
        </button>
      )}
    </div>
  )
}
