import { describe, it, expect, vi } from 'vitest'
import { globalFred } from '../../src/lib/copilot-engine'

describe('FredEngine Intent Classification', () => {
  it('should parse slash commands correctly', async () => {
    const result = await globalFred.parseCommand('/deploy now', { geminiApiKey: 'test' })
    expect(result.intent).toBe('slash_command')
    expect(result.params.command).toBe('deploy')
  })

  it('should handle navigation intent (mocked model response)', async () => {
    // We mock the fetch for the model call
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              intent: 'navigate',
              params: { view: 'dashboard' },
              confidence: 0.9,
              explanation: 'Navigating to dashboard'
            })
          }]
        }
      }]
    }

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse)
    })

    const result = await globalFred.parseCommand('Go to dashboard', { geminiApiKey: 'test' })
    expect(result.intent).toBe('navigate')
    expect(result.params.view).toBe('dashboard')
  })
})
