import { useState } from 'react'
import { Sparkles, Zap, Brain, MessageSquare, ChevronDown, Check } from 'lucide-react'
import { AIProvider, AVAILABLE_MODELS, AISettings } from '../lib/ai'
import { cn } from '../lib/utils'

interface ModelSwitcherProps {
  settings: AISettings
  onSelectProvider: (provider: AIProvider) => void
  className?: string
}

export function ModelSwitcher({ settings, onSelectProvider, className }: ModelSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentProvider = settings.defaultProvider || 'automatic'

  const getModelIcon = (provider: AIProvider) => {
    switch (provider) {
      case 'automatic':
        return <Sparkles size={16} className="text-primary" />
      case 'gemini':
        return <Zap size={16} className="text-secondary" />
      case 'openai':
        return <Brain size={16} className="text-primary" />
      case 'anthropic':
        return <MessageSquare size={16} className="text-secondary" />
      default:
        return <Sparkles size={16} />
    }
  }

  const getProviderLabel = (provider: AIProvider) => {
    if (provider === 'automatic') return 'Automatic'
    const model = AVAILABLE_MODELS.find((m) => m.provider === provider)
    return model ? model.name : provider.charAt(0).toUpperCase() + provider.slice(1)
  }

  return (
    <div className={cn('relative z-20', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-pill bg-bg-sunken border-border-low hover:bg-bg-surface hover:border-border-mid text-text-muted hover:text-text-primary flex items-center gap-2 border px-3 py-1.5 text-xs font-bold shadow-sm transition-all"
      >
        {getModelIcon(currentProvider)}
        <span className="tracking-widest uppercase">{getProviderLabel(currentProvider)}</span>
        <ChevronDown
          size={12}
          className={cn('opacity-40 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="bg-bg-base/90 border-border-mid rounded-modal animate-in fade-in slide-in-from-bottom-2 absolute bottom-full left-0 z-20 mb-2 w-64 overflow-hidden border p-2 shadow-2xl backdrop-blur-xl duration-200">
            <div className="text-text-muted font-display px-2 py-2 text-[10px] font-black tracking-[0.2em] uppercase">
              Select Model
            </div>

            <button
              onClick={() => {
                onSelectProvider('automatic')
                setIsOpen(false)
              }}
              className={cn(
                'group flex w-full items-center justify-between rounded-sm p-2.5 transition-colors',
                currentProvider === 'automatic'
                  ? 'bg-bg-surface ring-border-low shadow-sm ring-1'
                  : 'hover:bg-bg-sunken',
              )}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-sm p-1.5">
                  <Sparkles size={16} />
                </div>
                <div className="text-left font-sans">
                  <div className="text-text-primary text-xs font-bold">Automatic</div>
                  <div className="text-text-muted text-[10px] italic">Best model for the task</div>
                </div>
              </div>
              {currentProvider === 'automatic' && <Check size={14} className="text-primary" />}
            </button>

            <div className="border-border-low my-1 border-t" />

            {AVAILABLE_MODELS.map((model) => {
              const hasKey =
                model.provider === 'gemini' ||
                (model.provider === 'openai' && settings.openaiApiKey) ||
                (model.provider === 'anthropic' && settings.anthropicApiKey)

              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelectProvider(model.provider)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'group mb-0.5 flex w-full items-center justify-between rounded-sm p-2.5 transition-colors',
                    currentProvider === model.provider
                      ? 'bg-bg-surface ring-border-low shadow-sm ring-1'
                      : 'hover:bg-bg-sunken',
                  )}
                >
                  <div className="flex items-center gap-3 font-sans">
                    <div
                      className={cn(
                        'rounded-sm p-1.5',
                        model.provider === 'gemini'
                          ? 'bg-secondary/10 text-secondary'
                          : model.provider === 'openai'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary/10 text-secondary',
                      )}
                    >
                      {getModelIcon(model.provider)}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-text-primary text-xs font-bold">{model.name}</span>
                        {model.tier === 'free' && (
                          <span className="rounded-pill bg-primary/10 text-primary border-primary/20 border px-1.5 py-0.5 text-[9px] font-bold tracking-tighter uppercase">
                            Free
                          </span>
                        )}
                        {!hasKey && model.provider !== 'gemini' && (
                          <span className="rounded-pill bg-bg-sunken text-text-muted border-border-low border px-1.5 py-0.5 text-[9px] font-bold tracking-tighter uppercase">
                            Key Required
                          </span>
                        )}
                      </div>
                      <div className="text-text-muted max-w-[140px] truncate text-[10px] italic">
                        {model.description}
                      </div>
                    </div>
                  </div>
                  {currentProvider === model.provider && (
                    <Check size={14} className="text-text-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
