import React, { useState } from 'react'
import {
  Cloud,
  Zap,
  Globe,
  ArrowRight,
  Shield,
  ExternalLink,
  ChevronRight,
  Database,
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

interface DeploymentConfig {
  provider: 'vercel' | 'netlify' | 'other'
  projectName: string
  apiToken: string
  siteId?: string
  usePersonalToken: boolean
}

interface DeploymentSelectionFlowProps {
  onFinish?: (config: DeploymentConfig) => void
  onCancel?: () => void
}

export const DeploymentSelectionFlow: React.FC<DeploymentSelectionFlowProps> = ({
  onFinish,
  onCancel,
}) => {
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<DeploymentConfig>({
    provider: 'vercel',
    projectName: '',
    apiToken: '',
    usePersonalToken: true,
  })

  const providers = [
    {
      id: 'vercel',
      name: 'Vercel',
      icon: Zap,
      color: 'from-blue-500 to-indigo-600',
      description: 'Optimized for Next.js and Payload CMS with edge functions.',
    },
    {
      id: 'netlify',
      name: 'Netlify',
      icon: Cloud,
      color: 'from-cyan-400 to-blue-500',
      description: 'Excellent for static sites and serverless deployments.',
    },
    {
      id: 'other',
      name: 'Something Else',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      description: 'Docker, VPS, or self-hosted Payload instances.',
    },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-xl sm:p-24">
      <div className="animate-in zoom-in-95 relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl duration-500 sm:p-12">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />

        {/* Step Indicator */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'h-1 rounded-full transition-all duration-500',
                s === step
                  ? 'w-8 bg-blue-500'
                  : s < step
                    ? 'w-4 bg-blue-500/40'
                    : 'w-4 bg-white/10',
              )}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">
                Deploy your project
              </h2>
              <p className="text-lg font-medium text-[#888]">
                Where would you like to host your Payload site?
              </p>
            </div>
            <div className="grid gap-4">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setConfig({ ...config, provider: p.id as any })
                    setStep(2)
                  }}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border bg-white/[0.02] p-6 text-left transition-all duration-300 hover:bg-white/[0.05]',
                    config.provider === p.id ? 'border-white/20' : 'border-white/5',
                  )}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={cn(
                        'rounded-xl bg-gradient-to-br p-3 shadow-lg transition-transform duration-500 group-hover:scale-110',
                        p.color,
                      )}
                    >
                      <p.icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{p.name}</span>
                        <ChevronRight
                          size={16}
                          className="text-[#444] transition-all group-hover:translate-x-1 group-hover:text-white"
                        />
                      </div>
                      <p className="mt-1 text-sm leading-relaxed font-medium text-[#888]">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-500">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">Project Details</h2>
              <p className="text-lg font-medium text-[#888]">
                Configure your {config.provider} deployment settings.
              </p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="pl-1 text-xs font-bold tracking-widest text-[#444] uppercase">
                  Project Name
                </label>
                <div className="group relative">
                  <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#444] transition-colors group-focus-within:text-blue-400">
                    <Database size={18} />
                  </div>
                  <input
                    type="text"
                    value={config.projectName}
                    onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
                    placeholder="e.g. my-payload-site"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pr-4 pl-12 font-medium text-white transition-all focus:border-blue-500/50 focus:outline-none"
                  />
                </div>
              </div>

              {config.provider !== 'other' && (
                <div className="space-y-4 pt-2">
                  <button
                    onClick={() =>
                      setConfig({ ...config, usePersonalToken: !config.usePersonalToken })
                    }
                    className="group flex items-center gap-3 text-white/60 transition-colors hover:text-white"
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded border transition-all',
                        config.usePersonalToken ? 'border-blue-500 bg-blue-500' : 'border-white/20',
                      )}
                    >
                      {config.usePersonalToken && <Zap size={12} className="shrink-0 text-white" />}
                    </div>
                    <span className="text-sm font-semibold">Use Personal Access Token</span>
                  </button>
                  <p className="pl-8 text-xs leading-relaxed font-medium text-[#555]">
                    Personal tokens allow designwave to manage the project on your behalf.
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                className="flex-1 border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
                disabled={!config.projectName}
                onClick={() => setStep(3)}
              >
                Proceed
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-500">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">
                Connect to Provider
              </h2>
              <p className="text-lg font-medium text-[#888]">
                Verify your credentials to enable deployment.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="pl-1 text-xs font-bold tracking-widest text-[#444] uppercase">
                  {config.provider === 'other' ? 'Deployment URL' : 'API Access Token'}
                </label>
                <div className="group relative">
                  <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#444] transition-colors group-focus-within:text-blue-400">
                    <Shield size={18} />
                  </div>
                  <input
                    type="password"
                    value={config.apiToken}
                    onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                    placeholder={config.provider === 'other' ? 'https://...' : '••••••••••••••••'}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pr-4 pl-12 font-medium text-white transition-all focus:border-blue-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">
                <div className="flex gap-4">
                  <div className="h-fit rounded-xl bg-blue-500/10 p-2.5">
                    <ExternalLink size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-white">Secure Integration</h4>
                    <p className="text-xs leading-relaxed font-medium text-[#888]">
                      Your credentials are only used for this session and are never stored on our
                      servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                className="flex-1 border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
                disabled={!config.apiToken}
                onClick={() => onFinish?.(config)}
              >
                Start Deployment
              </Button>
            </div>
          </div>
        )}

        <button
          onClick={onCancel}
          className="absolute top-8 right-8 text-[#444] transition-colors hover:text-white"
        >
          <Zap size={24} className="rotate-45" />
        </button>
      </div>
    </div>
  )
}
