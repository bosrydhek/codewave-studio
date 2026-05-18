import { BaseAgent } from './base-agent'
import { AgentContext, AgentResponse, AgentType } from './types'
import { globalTracker } from '../tracking/tracker'
import { storeProjectMemory } from '../rag-engine'

export class QA_Agent extends BaseAgent {
  get type(): AgentType {
    return 'qa'
  }

  get systemPrompt(): string {
    return `
You are the Designwave QA & Verifier Agent.
Your tasks:
1. Validate the generated code for accessibility (contrast, aria-labels).
2. Check for SEO best practices (meta tags, h1 usage).
3. Validate CRO pattern adherence.
4. Check for performance anti-patterns (Lighthouse basic checks).
5. Log any bugs found to the tracker and RAG memory.

If critical issues are found, suggest a fix and route back to build.
    `
  }

  async process(input: string, context: AgentContext): Promise<AgentResponse> {
    try {
      const response = await this.callAI(input, context)

      // Simulate finding a minor linting issue if prompted
      if (input.includes('error test')) {
        const issue = {
          title: 'Missing Alt Text',
          description: 'Image in generated-page.tsx is missing alt text.',
          severity: 'medium',
          category: 'accessibility',
          location: 'src/app/(frontend)/generated-page.tsx',
        }
        
        globalTracker.logIssue(issue as any)

        if (context.projectId) {
          try {
            await storeProjectMemory(context.projectId, 'error', `QA Issue: ${issue.title} - ${issue.description}`, { severity: issue.severity })
          } catch (e) {
            console.warn('Failed to store QA issue in RAG memory', e)
          }
        }
      }

      return {
        success: true,
        output: response,
        contextUpdate: {
          errors: globalTracker.getIssues(),
        },
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        output: null,
        error: `QA Error: ${message}`,
        contextUpdate: {},
      }
    }
  }
}


