import { BaseAgent } from './base-agent'
import { AgentContext, AgentResponse, AgentType } from './types'

export class DesignAgent extends BaseAgent {
  get type(): AgentType {
    return 'design'
  }

  get systemPrompt(): string {
    return `
You are the Designwave Design Agent (The Design Brain).
Your tasks:
1. Create a 'design_system' based on the 'sector' and PRD.
2. Propose a sitemap and page structure.
3. Recommend typography (Google Fonts) and color palettes (Tailwind v4 OKLCH).
4. Define motion and animation tokens (sector-appropriate).

Constraint:
- Enforce WCAG accessibility (contrast).
- Mobile-first hierarchy.
- Dribbble-level aesthetic.
- British English spelling/grammar.
    `
  }

  async process(input: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const response = await this.callAI(input, context)

      return {
        success: true,
        output: response,
        contextUpdate: {
          designSystem: this.parseDesignSystem(response),
        },
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        output: null,
        error: `Design Error: ${message}`,
        contextUpdate: {},
      }
    }
  }

  private parseDesignSystem(text: string): Record<string, unknown> {
    // Simple mock parser for now
    console.log('Parsing design system from:', text.substring(0, 50))
    return {
      colors: { core: '#8b5cf6', accent: '#6366f1' },
      fonts: { sans: 'Inter', heading: 'Outfit' },
      animations: 'subtle_reveal',
    }
  }
}
