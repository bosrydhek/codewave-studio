import { AISettings, generateCode } from '../ai'
import { AgentContext, AgentResponse, AgentType } from './types'

export abstract class BaseAgent {
  constructor(protected settings: AISettings) {}

  abstract get type(): AgentType
  abstract get systemPrompt(): string

  protected async callAI(prompt: string, context?: AgentContext): Promise<string> {
    const fullPrompt = `
SYSTEM PROMPT: ${this.systemPrompt}

CONTEXT:
${JSON.stringify(context || {}, null, 2)}

USER REQUEST:
${prompt}
    `

    return generateCode(fullPrompt, this.settings)
  }

  abstract process(input: string, context: AgentContext): Promise<AgentResponse>
}
