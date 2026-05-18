import { BaseAgent } from './base-agent'
import { AgentContext, AgentResponse, AgentType } from './types'

export class ResearchAgent extends BaseAgent {
  get type(): AgentType {
    return 'research'
  }

  get systemPrompt(): string {
    return `
You are the Designwave Research & Discovery Agent.
Your tasks:
1. Identify the 'sector' (industry/vertical) of the project.
2. Analyze the PRD if provided.
3. If no PRD is provided, suggest a sector and key conversion patterns based on the user's initial brief.
4. Output should be a structured analysis of the sector and project goals.

Sector Intelligence:
- Map the brief to a sector profile (e.g., real_estate, laundromat, fintech).
- Identify CRO (Conversion Rate Optimization) patterns for that sector.
- Establish 'sector_context' JSON object.
    `
  }

  async process(input: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const response = await this.callAI(input, context)

      // In a real implementation, we'd parse specific sector tags here.
      // For now, we'll return the raw analysis and assume the context is updated.

      return {
        success: true,
        output: response,
        contextUpdate: {
          sector: this.extractSector(response),
          prd: context.prd || 'Fetched via Research Agent (Simulated)',
        },
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        output: null,
        error: `Research Error: ${message}`,
        contextUpdate: {},
      }
    }
  }

  private extractSector(text: string): string {
    const sectors = ['real_estate', 'fintech', 'hospitality', 'professional_services', 'e-commerce']
    for (const s of sectors) {
      if (text.toLowerCase().includes(s.replace('_', ' '))) return s
    }
    return 'general'
  }
}
