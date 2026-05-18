export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          settings: Json
          skills: Json
          github_token: string | null
          updated_at: string | null
          last_sync_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          settings?: Json
          skills?: Json
          github_token?: string | null
          updated_at?: string | null
          last_sync_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          settings?: Json
          skills?: Json
          github_token?: string | null
          updated_at?: string | null
          last_sync_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  settings: any
  skills: any[]
  github_token: string | null
  updated_at: string | null
}

export interface CalculationTrace {
  resource: string
  quantity: number
  unit: string
  rate: number
  total: number
  formula: string
  ruleVersion: string
}

export interface BillingBreakdown {
  items: CalculationTrace[]
  totalCost: number
  anomalies: string[]
}

export interface UsageEvent {
  id: string
  workspace_id: string
  resource_type: 'memory' | 'ai_tokens' | 'rag_queries'
  quantity: number
  unit: string
  timestamp: string
  metadata: Record<string, any>
}

export interface PricingRule {
  id: string
  version: string
  rules: Record<string, { rate: number; unit: string }>
  is_active: boolean
  created_at: string
}

export interface CoPilotSession {
  id: string
  user_id: string
  context_snapshot: Record<string, any>
  summary: string
  created_at: string
}

export interface CoPilotNudge {
  id: string
  user_id: string
  type: string
  title: string
  description: string
  action_payload: Record<string, any> | null
  status: 'pending' | 'dismissed' | 'completed'
  depends_on?: string[] // IDs of nudges that must be completed first
  priority: number // Higher is more urgent
  created_at: string
}
