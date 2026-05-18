import { AISettings, resolveModel } from './ai'
import { supabase } from './supabase'

export interface CoPilotContext {
  workspaceId: string
  currentView: string
  activeProject?: string
  agentStatus?: string
  lastActions?: string[]
}

export interface IntentResponse {
  intent: string
  params: Record<string, any>
  confidence: number
  explanation?: string
}

export class FredEngine {
  private context: CoPilotContext = {
    workspaceId: 'default',
    currentView: 'dashboard'
  }

  updateContext(update: Partial<CoPilotContext>) {
    this.context = { ...this.context, ...update }
  }

  async parseCommand(input: string, settings: AISettings): Promise<IntentResponse> {
    const model = resolveModel(settings)
    
    // Slash command shortcut
    if (input.startsWith('/')) {
      return this.handleSlashCommand(input)
    }

    const prompt = `
      You are Fred, the Designwave CoPilot. Your personality is calm, warm, direct, and quietly opinionated.
      Current Context: ${JSON.stringify(this.context)}
      
      User Input: "${input}"
      
      Task: Classify the user intent into one of the following:
      - navigate (params: view)
      - agent_command (params: agent, task)
      - config_change (params: key, value)
      - project_action (params: action, projectId)
      - inquiry (params: query)
      
      Return ONLY a JSON object: { "intent": string, "params": {}, "confidence": number, "explanation": string }
    `

    try {
      const response = await this.callModel(prompt, model, settings)
      return JSON.parse(response)
    } catch (err) {
      console.error('[Fred] Parsing Error:', err)
      return { intent: 'inquiry', params: { query: input }, confidence: 0.5 }
    }
  }

  private handleSlashCommand(input: string): IntentResponse {
    const [cmd, ...args] = input.slice(1).split(' ')
    return {
      intent: 'slash_command',
      params: { command: cmd, args },
      confidence: 1.0
    }
  }

  private async callModel(prompt: string, model: any, settings: AISettings): Promise<string> {
    // Reusing the existing AI service logic
    const key = settings.geminiApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent?key=${key}`
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return text.replace(/```json\n?|\n?```/g, '').trim()
  }

  async saveSession(userId: string, summary: string) {
    await supabase.from('copilot_sessions').insert({
      user_id: userId,
      context_snapshot: this.context,
      summary
    })
  }

  async getLatestSession(userId: string) {
    const { data } = await supabase
      .from('copilot_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    return data
  }
}

export const globalFred = new FredEngine()
