// @vitest-environment node
import { expect, test, describe } from 'vitest'
import { resolveModel, AISettings } from './ai'

describe('AI Routing Logic', () => {
  const mockSettingsNone: AISettings = {
    defaultProvider: 'automatic',
    geminiApiKey: '',
    openaiApiKey: '',
    anthropicApiKey: '',
  }

  const mockSettingsAll: AISettings = {
    defaultProvider: 'automatic',
    geminiApiKey: 'gemini-key',
    openaiApiKey: 'openai-key',
    anthropicApiKey: 'anthropic-key',
  }

  test('Automatic mode with no keys should fallback to gemini-1.5-flash', () => {
    const model = resolveModel(mockSettingsNone)
    expect(model.id).toBe('gemini-1.5-flash')
    expect(model.tier).toBe('free')
  })

  test('Automatic mode with all keys should prioritize Claude 3.5 Sonnet', () => {
    const model = resolveModel(mockSettingsAll)
    expect(model.id).toBe('claude-3-5-sonnet-20240620')
    expect(model.provider).toBe('anthropic')
  })

  test('Automatic mode with only OpenAI key should pick GPT-4o', () => {
    const settings = { ...mockSettingsNone, openaiApiKey: 'sk-...' }
    const model = resolveModel(settings)
    expect(model.id).toBe('gpt-4o')
    expect(model.provider).toBe('openai')
  })

  test('Explicit selection should override automatic routing', () => {
    const settings: AISettings = { ...mockSettingsAll, defaultProvider: 'openai' }
    const model = resolveModel(settings, 'openai')
    expect(model.id).toBe('gpt-4o')
  })

  test('Explicit selection without key should still return the model (key check is post-resolve)', () => {
    const model = resolveModel(mockSettingsNone, 'anthropic')
    expect(model.id).toBe('claude-3-5-sonnet-20240620')
  })
})
