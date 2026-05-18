import { BaseAgent } from './base-agent'
import { AgentContext, AgentResponse, AgentType } from './types'

export class DeployAgent extends BaseAgent {
  get type(): AgentType {
    return 'deploy'
  }

  get systemPrompt(): string {
    return `
You are the Designwave Deploy Agent.
Your tasks:
1. Configure deployment for Vercel, Netlify, or Google Cloud.
2. Manage GitHub operations (repo creation, commits, PRs).
3. Handle secret .env variable injection.
4. Verify the deployment status.

Always summarize the deployment state.
    `
  }

  async process(input: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const response = await this.callAI(input, context)
      return {
        success: true,
        output: response,
        contextUpdate: {
          changelog: [
            ...(context.changelog || []),
            {
              id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              action: 'deploy',
              status: 'success',
              timestamp: Date.now(),
              description: 'Deployment triggered successfully via Deploy Agent.',
            },
          ],
        },
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        output: null,
        error: `Deploy Error: ${message}`,
        contextUpdate: {},
      }
    }
  }
}
