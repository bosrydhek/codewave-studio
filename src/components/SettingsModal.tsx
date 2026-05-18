import React, { useState } from 'react'
import {
  X,
  Sun,
  Monitor,
  Bell,
  Shield,
  Key,
  Database,
  Zap,
  Brain,
  MessageSquare,
  Settings as LucideSettings,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { AVAILABLE_MODELS } from '../lib/ai'

export interface Settings {
  theme?: string
  notifications?: boolean
  githubToken?: string
  geminiApiKey?: string
  openaiApiKey?: string
  anthropicApiKey?: string
  defaultProvider?: string
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: Settings
  onSaveSettings: (newSettings: Settings) => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState('general')
  const [localSettings, setLocalSettings] = useState<Settings>(
    settings || {
      theme: 'dark',
      notifications: true,
      githubToken: '',
      geminiApiKey: '',
      openaiApiKey: '',
      anthropicApiKey: '',
      defaultProvider: 'gemini',
    },
  )

  if (!isOpen) return null

  const handleSave = () => {
    onSaveSettings(localSettings)
    onClose()
  }

  const tabs = [
    { id: 'general', label: 'General', icon: LucideSettings },
    { id: 'auth', label: 'Authentication', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'data', label: 'Data management', icon: Database },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-black/60 backdrop-blur-xl duration-300"
        onClick={onClose}
      />

      <div className="animate-in zoom-in-95 relative flex h-[70vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl duration-300">
        <div className="w-64 border-r border-white/5 bg-black/20 p-6">
          <h2 className="mb-8 px-2 text-xl font-bold text-white">Settings</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-white/5 text-white'
                    : 'text-white/40 hover:bg-white/[0.02] hover:text-white/60',
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 flex-col bg-black/40">
          <div className="flex items-center justify-end border-b border-white/5 p-4">
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/20 transition-all hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-8">
            {activeTab === 'general' && (
              <div className="animate-in slide-in-from-bottom-2 space-y-8 duration-300">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white">GitHub Configuration</h3>
                  <div className="space-y-4 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-white/80">
                        <Monitor size={20} className="text-white/40" />
                        Personal Access Token
                      </div>
                      <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-[10px] text-white/40 uppercase">
                        Required for sync
                      </span>
                    </div>
                    <input
                      type="password"
                      value={localSettings.githubToken || ''}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, githubToken: e.target.value })
                      }
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all placeholder:text-white/20 focus:border-white/20 focus:outline-none"
                    />
                    <p className="text-xs leading-relaxed text-white/20">
                      Your token is encrypted and stored securely in your Supabase profile. Required
                      scopes: <code className="text-white/40">repo</code> and{' '}
                      <code className="text-white/40">workflow</code>.
                    </p>
                    <div className="pt-2">
                      <a
                        href="https://github.com/settings/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-fit items-center gap-1 text-xs text-blue-400 transition-colors hover:text-blue-300"
                      >
                        <Key size={12} />
                        Get token from GitHub
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white">Notifications</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() =>
                        setLocalSettings({
                          ...localSettings,
                          notifications: !localSettings.notifications,
                        })
                      }
                      className="group flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition-transform group-hover:scale-110">
                          <Bell size={20} />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-white/90">
                            Email Notifications
                          </div>
                          <div className="text-xs text-white/30">
                            Get updates about your design waves
                          </div>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'relative h-6 w-12 rounded-full transition-colors duration-300',
                          localSettings.notifications ? 'bg-white' : 'bg-white/10',
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-1 h-4 w-4 rounded-full bg-black transition-all duration-300',
                            localSettings.notifications ? 'left-7' : 'left-1',
                          )}
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'auth' && (
              <div className="animate-in slide-in-from-bottom-2 space-y-8 duration-300">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white">AI Engine Configuration</h3>

                  <div className="mb-6">
                    <label className="mb-2 block text-xs font-bold tracking-wider text-white/40 uppercase">
                      Default Provider
                    </label>
                    <select
                      value={localSettings.defaultProvider || 'automatic'}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, defaultProvider: e.target.value })
                      }
                      className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all focus:border-white/20 focus:outline-none"
                    >
                      <option value="automatic" className="bg-[#0a0a0a]">
                        Automatic (Best Available)
                      </option>
                      {AVAILABLE_MODELS.map((model) => (
                        <option key={model.id} value={model.provider} className="bg-[#0a0a0a]">
                          {model.name} {model.tier === 'free' ? '(Free)' : '(Premium)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-white/80">
                          <Zap size={20} className="text-blue-400" />
                          Google Gemini
                        </div>
                        <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 font-mono text-[10px] text-blue-400 uppercase">
                          Free Default
                        </span>
                      </div>
                      <input
                        type="password"
                        value={localSettings.geminiApiKey || ''}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, geminiApiKey: e.target.value })
                        }
                        placeholder="v1beta-..."
                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-white transition-all placeholder:text-white/10 focus:border-white/20 focus:outline-none"
                      />
                      <p className="text-[10px] text-white/30 italic">
                        Uses system key if empty. Supports 1.5 Pro with valid key.
                      </p>
                    </div>

                    <div className="space-y-4 border-t border-white/5 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-white/80">
                          <Brain size={20} className="text-green-400" />
                          OpenAI
                        </div>
                        <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-[10px] text-white/40 uppercase">
                          BYOK
                        </span>
                      </div>
                      <input
                        type="password"
                        value={localSettings.openaiApiKey || ''}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, openaiApiKey: e.target.value })
                        }
                        placeholder="sk-..."
                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-white transition-all placeholder:text-white/10 focus:border-white/20 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-4 border-t border-white/5 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-white/80">
                          <MessageSquare size={20} className="text-orange-400" />
                          Anthropic
                        </div>
                        <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-[10px] text-white/40 uppercase">
                          BYOK
                        </span>
                      </div>
                      <input
                        type="password"
                        value={localSettings.anthropicApiKey || ''}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, anthropicApiKey: e.target.value })
                        }
                        placeholder="sk-ant-..."
                        className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-white transition-all placeholder:text-white/10 focus:border-white/20 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs leading-relaxed text-white/20">
                        Keys are stored securely in your Supabase profile.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-400 transition-colors hover:text-blue-300"
                        >
                          <Database size={12} /> Gemini Dashboard
                        </a>
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-400 transition-colors hover:text-blue-300"
                        >
                          <Key size={12} /> OpenAI Dashboard
                        </a>
                        <a
                          href="https://console.anthropic.com/settings/keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-400 transition-colors hover:text-blue-300"
                        >
                          <Key size={12} /> Anthropic Dashboard
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'general' && activeTab !== 'auth' && (
              <div className="flex h-full flex-col items-center justify-center p-12 text-center opacity-40">
                <div className="mb-4 rounded-3xl border border-white/5 bg-white/5 p-4">
                  <Monitor size={40} className="text-white/20" />
                </div>
                <h4 className="mb-1 font-medium text-white">Coming Soon</h4>
                <p className="max-w-xs text-sm text-white/30">
                  This settings module is being finalized for the production release.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 bg-black/40 p-6">
            <button
              onClick={onClose}
              className="rounded-xl px-6 py-2.5 text-sm font-medium text-white/40 transition-all hover:bg-white/5 hover:text-white"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="rounded-xl bg-white px-8 py-2.5 text-sm font-bold text-black shadow-xl shadow-white/5 transition-all hover:bg-white/90"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
