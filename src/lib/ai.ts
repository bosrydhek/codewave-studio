/**
 * Designwave AI Service Layer (2026 BYOK Standard)
 * Supports Gemini, OpenAI, and Anthropic with automatic fallback.
 */

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'automatic'

export interface AISettings {
  geminiApiKey?: string
  openaiApiKey?: string
  anthropicApiKey?: string
  defaultProvider?: AIProvider
}

export type ModelTier = 'free' | 'premium'

export interface ModelInfo {
  id: string
  name: string
  provider: AIProvider
  tier: ModelTier
  description: string
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'gemini',
    tier: 'free',
    description: 'Fast and reliable for general tasks.',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    tier: 'premium',
    description: 'Superior reasoning and complex coding.',
  },
  {
    id: 'claude-3-5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    tier: 'premium',
    description: 'Best-in-class for coding and logic.',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    tier: 'premium',
    description: 'High-performance versatile model.',
  },
]

export async function generateCode(prompt: string, settings: AISettings): Promise<string> {
  const resolved = resolveModel(settings)
  console.log(`[AI] Routing to ${resolved.id} (${resolved.provider})`)

  if (resolved.provider === 'gemini') {
    return callGemini(prompt, resolved.id, settings.geminiApiKey)
  } else if (resolved.provider === 'openai') {
    return callOpenAI(prompt, resolved.id, settings.openaiApiKey)
  } else if (resolved.provider === 'anthropic') {
    return callAnthropic(prompt, resolved.id, settings.anthropicApiKey)
  }

  throw new Error(`Unsupported AI provider: ${resolved.provider}`)
}

export interface ModelConfig {
  provider: AIProvider
  id: string
  tier: 'free' | 'premium'
}

export const resolveModel = (settings: AISettings, selectedProvider?: AIProvider): ModelConfig => {
  const provider = selectedProvider || settings.defaultProvider || 'automatic'

  if (provider === 'automatic') {
    if (settings.anthropicApiKey)
      return { provider: 'anthropic', id: 'claude-3-5-sonnet-20240620', tier: 'premium' }
    if (settings.openaiApiKey) return { provider: 'openai', id: 'gpt-4o', tier: 'premium' }
    if (settings.geminiApiKey) return { provider: 'gemini', id: 'gemini-1.5-pro', tier: 'premium' }
    return { provider: 'gemini', id: 'gemini-1.5-flash', tier: 'free' }
  }

  if (provider === 'anthropic')
    return { provider: 'anthropic', id: 'claude-3-5-sonnet-20240620', tier: 'premium' }
  if (provider === 'openai') return { provider: 'openai', id: 'gpt-4o', tier: 'premium' }

  const id = settings.geminiApiKey ? 'gemini-1.5-pro' : 'gemini-1.5-flash'
  return { provider: 'gemini', id, tier: settings.geminiApiKey ? 'premium' : 'free' }
}

async function callGemini(prompt: string, modelId: string, apiKey?: string): Promise<string> {
  // Use user key (BYOK) if provided, otherwise fallback to system key
  const key =
    apiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY

  if (!key) throw new Error('Gemini API key missing. Please provide one in Settings.')

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${prompt}\n\nIMPORTANT: Return ONLY the code. Use British English spelling (e.g.,ised, colour, localisation) and British grammatical standards. Use GBP (£) as the default currency for any pricing or monetary values. No markdown boxes, no explanation.`,
              },
            ],
          },
        ],
      }),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Gemini Error: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callOpenAI(prompt: string, modelId: string, apiKey?: string): Promise<string> {
  if (!apiKey) throw new Error('OpenAI API key missing. Please provide one in Settings.')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nIMPORTANT: Return ONLY the code. Use British English spelling (e.g.,ised, colour, localisation) and British grammatical standards. Use GBP (£) as the default currency for any pricing or monetary values. No markdown boxes, no explanation.`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`OpenAI Error: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callAnthropic(prompt: string, modelId: string, apiKey?: string): Promise<string> {
  if (!apiKey) throw new Error('Anthropic API key missing. Please provide one in Settings.')

  // Note: Anthropic usually requires a proxy due to CORS in browser calls.
  // For this BYOK implementation, we assume the user might need to use a CORS-friendly endpoint or we handle it via proxy.
  // We'll use the standard endpoint and expect properly configured headers or a proxy.
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true', // Recommended for client-side BYOK if absolutely necessary
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nIMPORTANT: Return ONLY the code. Use British English spelling (e.g.,ised, colour, localisation) and British grammatical standards. Use GBP (£) as the default currency for any pricing or monetary values. No markdown boxes, no explanation.`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Anthropic Error: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || ''
}
