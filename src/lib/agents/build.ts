import { BaseAgent } from './base-agent'
import { AgentContext, AgentResponse, AgentType } from './types'
import { retrieveProjectMemory } from '../rag-engine'

export class BuildAgent extends BaseAgent {
  get type(): AgentType {
    return 'build'
  }

  get systemPrompt(): string {
    return `
You are the Designwave Build Agent.
Your tasks:
1. Generate Next.js 16 code for pages and components.
2. Use Tailwind CSS v4 (@theme, OKLCH colors).
3. Use Payload CMS 3.0 blocks and configurations.
4. Generate .env files logic (secret vs public).
5. Ensure animations are sector-appropriate (restrained vs immersive).
6. Always refer to the provided RAG context for prior project snippets, PRDs, and error fixes.

British English standards apply.
    `
  }

  async process(input: string, context: AgentContext): Promise<AgentResponse> {
    try {
      let enrichedInput = input

      // Simulate fetching RAG context if projectId is present
      if (context.projectId) {
        try {
          const memories = await retrieveProjectMemory(context.projectId, input, 3)
          if (memories && memories.length > 0) {
            const contextStr = memories.map((m: any) => `[${m.type}] ${m.content}`).join('\n\n')
            enrichedInput = `RAG Context:\n${contextStr}\n\nTask:\n${input}`
          }
        } catch (e) {
          console.warn('Failed to retrieve RAG memory, proceeding without it', e)
        }
      }

      const response = await this.callAI(enrichedInput, context)
      return {
        success: true,
        output: response,
        contextUpdate: {
          files: [...(context.files || []), 'src/app/(frontend)/generated-page.tsx'],
        },
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        output: null,
        error: `Build Error: ${message}`,
        contextUpdate: {},
      }
    }
  }
}

