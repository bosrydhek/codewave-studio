import { BaseAgent } from './base-agent'
import { AgentContext, AgentResponse, AgentType, OrchestratorDecisionSchema } from './types'

export class Orchestrator extends BaseAgent {
  get type(): AgentType {
    return 'orchestrator'
  }

  get systemPrompt(): string {
    return `
You are the Designwave Orchestrator. Your job is to route tasks between specialized agents.
Agents available: research, design, build, qa, deploy.

Rules:
1. Every project starts with 'research' (unless PRD and sector are already locked).
2. After research, move to 'design'.
3. After design, move to 'build'.
4. After build, move to 'qa'.
5. After qa, if no critical issues, move to 'deploy'.
6. If 'qa' finds critical issues, route back to 'build'.
7. Always return JSON matching the OrchestratorDecisionSchema.

Current context is provided. Decide the next step.
    `
  }

  async process(input: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const response = await this.callAI(input, context)

      // Attempt to parse JSON from AI response (which might have markdown backticks)
      const jsonStr = response.replace(/```json\n?|\n?```/g, '').trim()
      const decision = OrchestratorDecisionSchema.parse(JSON.parse(jsonStr))

      return {
        success: true,
        output: decision,
        contextUpdate: decision.context,
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        output: null,
        error: `Orchestrator Error: ${message}`,
        contextUpdate: {},
      }
    }
  }
}
