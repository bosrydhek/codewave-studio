import { AISettings } from '../ai'
import { Orchestrator } from './orchestrator'
import { ResearchAgent } from './research'
import { DesignAgent } from './design'
import { BuildAgent } from './build'
import { QA_Agent } from './qa'
import { DeployAgent } from './deploy'
import { AgentContext, AgentType, OrchestratorDecision } from './types'
import { BaseAgent } from './base-agent'
import { globalTracker } from '../tracking/tracker'

export class AgentManager {
  private orchestrator: Orchestrator
  private agents: Record<string, BaseAgent>
  private context: AgentContext

  constructor(settings: AISettings, initialContext: Partial<AgentContext> = {}) {
    this.orchestrator = new Orchestrator(settings)
    this.agents = {
      research: new ResearchAgent(settings),
      design: new DesignAgent(settings),
      build: new BuildAgent(settings),
      qa: new QA_Agent(settings),
      deploy: new DeployAgent(settings),
    }
    this.context = {
      projectId: initialContext.projectId || `proj-${Date.now()}`,
      errors: [],
      changelog: [],
      files: [],
      ...initialContext,
    }
  }

  async run(userInput: string, onProgress?: (agent: AgentType, output: any) => void) {
    let currentAgent: AgentType | 'done' = 'research'
    let lastOutput = userInput

    console.log(`[AgentManager] Starting process for: ${userInput}`)

    while ((currentAgent as string) !== 'done') {
      // 1. Ask Orchestrator what to do next
      const decisionResponse = await this.orchestrator.process(lastOutput, this.context)
      if (!decisionResponse.success) {
        throw new Error(decisionResponse.error)
      }

      const decision = decisionResponse.output as OrchestratorDecision
      currentAgent = decision.nextAgent

      if (currentAgent === 'done') break

      // 2. Run the specialized agent
      console.log(`[AgentManager] Running Agent: ${currentAgent}`)
      const agent = this.agents[currentAgent]
      if (!agent) throw new Error(`Agent ${currentAgent} not found`)

      const agentResponse = await agent.process(lastOutput, this.context)
      if (!agentResponse.success) {
        // Log failure to tracker
        globalTracker.logIssue({
          title: `${currentAgent} Agent Failed`,
          description: agentResponse.error || 'Unknown error',
          severity: 'high',
          category: 'generation',
        })
        throw new Error(agentResponse.error)
      }

      // 3. Update context and progress
      this.context = { ...this.context, ...agentResponse.contextUpdate }
      lastOutput =
        typeof agentResponse.output === 'string'
          ? agentResponse.output
          : JSON.stringify(agentResponse.output)

      if (onProgress) onProgress(currentAgent, agentResponse.output)
    }

    console.log(`[AgentManager] Process complete.`, this.context)
    return this.context
  }

  getContext() {
    return this.context
  }
}
