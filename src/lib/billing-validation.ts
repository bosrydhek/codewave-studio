import { supabase } from './supabase'
import { globalCostEstimator } from './cost-estimator'
import { PricingRule, BillingBreakdown } from './types'

export class BillingValidationEngine {
  /**
   * Run a simulation against a preset scenario
   */
  async simulate(
    scenario: 'normal' | 'high_usage' | 'zero_usage' | 'spike',
    workspaceId: string,
    pricingRuleVersion?: string
  ): Promise<BillingBreakdown> {
    // 1. Fetch pricing rule
    const { data: pricingRule } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('version', pricingRuleVersion || 'v1.0')
      .single()

    // 2. Generate synthetic usage data based on scenario
    const usage = this.generateSyntheticUsage(scenario)

    // 3. Calculate costs
    const result = globalCostEstimator.calculateUsage(usage, pricingRule as PricingRule)

    // 4. Log simulation
    await supabase.from('simulation_logs').insert({
      scenario_name: scenario,
      config: { workspaceId, pricingRuleVersion },
      result: result,
    })

    return result
  }

  /**
   * Audit live usage for a workspace in a given period
   */
  async auditWorkspace(
    workspaceId: string,
    start: Date,
    end: Date
  ): Promise<BillingBreakdown & { liveTotal: number }> {
    // 1. Fetch live usage events
    const { data: events } = await supabase
      .from('usage_events')
      .select('*')
      .eq('workspace_id', workspaceId)
      .gte('timestamp', start.toISOString())
      .lte('timestamp', end.toISOString())

    const usageEntries = (events || []).map((e: any) => ({
      resource_type: e.resource_type,
      quantity: Number(e.quantity),
    }))

    // 2. Aggregrate usage by resource type
    const aggregated = usageEntries.reduce((acc: any, curr: any) => {
      acc[curr.resource_type] = (acc[curr.resource_type] || 0) + curr.quantity
      return acc
    }, {} as Record<string, number>)

    const finalUsage = Object.entries(aggregated).map(([resource_type, quantity]) => ({
      resource_type,
      quantity: quantity as number,
    }))

    // 3. Run calculation
    const breakdown = globalCostEstimator.calculateUsage(finalUsage)

    // 4. Check for anomalies
    const anomalies = [...breakdown.anomalies]
    
    // Anomaly: Stale meter (no updates in > 24h despite being an active workspace)
    if (events && events.length > 0) {
      const lastEvent = new Date(Math.max(...events.map((e: any) => new Date(e.timestamp).getTime())))
      const hoursSinceLastEvent = (new Date().getTime() - lastEvent.getTime()) / (1000 * 60 * 60)
      if (hoursSinceLastEvent > 24) {
        anomalies.push(`Stale meter detected: Last event was ${hoursSinceLastEvent.toFixed(1)}h ago`)
      }
    } else if (usageEntries.length === 0) {
       // Check if there should have been usage (placeholder logic for "active" detection)
       // anomalies.push('No usage events found for current period')
    }

    return {
      ...breakdown,
      anomalies,
      liveTotal: breakdown.totalCost, // In this simplified MVP, live total is the calculated one
    }
  }

  private generateSyntheticUsage(scenario: string) {
    switch (scenario) {
      case 'high_usage':
        return [
          { resource_type: 'memory', quantity: 5120 }, // 5GB
          { resource_type: 'ai_tokens', quantity: 1000000 },
          { resource_type: 'rag_queries', quantity: 500 },
        ]
      case 'zero_usage':
        return []
      case 'spike':
        return [
          { resource_type: 'memory', quantity: 847 },
          { resource_type: 'ai_tokens', quantity: 5000000 }, // Large spike
        ]
      case 'normal':
      default:
        return [
          { resource_type: 'memory', quantity: 847 },
          { resource_type: 'ai_tokens', quantity: 15000 },
          { resource_type: 'rag_queries', quantity: 20 },
        ]
    }
  }
}

export const globalBillingValidation = new BillingValidationEngine()
