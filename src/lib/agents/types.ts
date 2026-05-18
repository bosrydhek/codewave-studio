import { z } from 'zod'
import type { Issue } from '../tracking/tracker'
import type { ChangelogEntry } from '../changelog'

export type AgentType = 'orchestrator' | 'research' | 'design' | 'build' | 'qa' | 'deploy' | 'done'

export const AgentMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'agent']),
  agentType: z
    .enum(['orchestrator', 'research', 'design', 'build', 'qa', 'deploy', 'done'])
    .optional(),
  content: z.string(),
  timestamp: z.number(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).default('completed'),
  metadata: z.record(z.any()).optional(),
})

export type AgentMessage = z.infer<typeof AgentMessageSchema>

export const OrchestratorDecisionSchema = z.object({
  nextAgent: z.enum(['orchestrator', 'research', 'design', 'build', 'qa', 'deploy', 'done']),
  requiresApproval: z.boolean().default(false),
  context: z.record(z.any()),
  reason: z.string(),
})

export type OrchestratorDecision = z.infer<typeof OrchestratorDecisionSchema>

export interface AgentContext {
  projectId: string
  sector?: string
  prd?: string
  designSystem?: Record<string, unknown>
  files?: string[]
  errors?: Issue[]
  changelog?: ChangelogEntry[]
}

export interface AgentResponse<T = unknown> {
  success: boolean
  output: T
  error?: string
  contextUpdate: Partial<AgentContext>
}
