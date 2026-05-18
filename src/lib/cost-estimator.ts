import { z } from 'zod'
import { CalculationTrace, BillingBreakdown, PricingRule } from './types'

export const PricingItemSchema = z.object({
  category: z.string(),
  item: z.string(),
  costGbp: z.number(),
  frequency: z.enum(['one-time', 'monthly', 'yearly']),
})

export type PricingItem = z.infer<typeof PricingItemSchema>

export class CostEstimator {
  private defaultRules: PricingRule = {
    id: 'default',
    version: 'v1.0-default',
    rules: {
      memory: { rate: 0.0084, unit: 'MB' },
      ai_tokens: { rate: 0.0001, unit: 'token' },
      rag_queries: { rate: 0.05, unit: 'query' },
    },
    is_active: true,
    created_at: new Date().toISOString(),
  }

  calculateUsage(
    usage: { resource_type: string; quantity: number }[],
    pricingRule?: PricingRule
  ): BillingBreakdown {
    const activeRule = pricingRule || this.defaultRules
    const items: CalculationTrace[] = []
    const anomalies: string[] = []

    for (const entry of usage) {
      const rule = activeRule.rules[entry.resource_type]
      if (!rule) {
        anomalies.push(`No pricing rule found for resource: ${entry.resource_type}`)
        continue
      }

      const total = entry.quantity * rule.rate
      items.push({
        resource: entry.resource_type,
        quantity: entry.quantity,
        unit: rule.unit,
        rate: rule.rate,
        total: Number(total.toFixed(4)),
        formula: `${entry.quantity} ${rule.unit} × £${rule.rate}/${rule.unit} = £${total.toFixed(2)}`,
        ruleVersion: activeRule.version,
      })

      if (total === 0 && entry.quantity > 0) {
        anomalies.push(`Zero-cost detected for ${entry.resource_type} with usage > 0`)
      }
    }

    const totalCost = items.reduce((acc, i) => acc + i.total, 0)

    return {
      items,
      totalCost: Number(totalCost.toFixed(2)),
      anomalies,
    }
  }

  // Legacy support for basic estimates
  estimate(projectType: 'landing_page' | 'website', _pages: number = 1): PricingItem[] {
    const items: PricingItem[] = [
      { category: 'Hosting', item: 'Vercel Hobby', costGbp: 0, frequency: 'monthly' },
      { category: 'Database', item: 'Supabase Free', costGbp: 0, frequency: 'monthly' },
      { category: 'License', item: 'Designwave MVP', costGbp: 0, frequency: 'one-time' },
    ]

    if (projectType === 'website') {
      items.push({
        category: 'Domain',
        item: '.com/.co.uk domain',
        costGbp: 12.0,
        frequency: 'yearly',
      })
    }

    return items
  }

  getTotalMonthly(items: PricingItem[]): number {
    return items.filter((i) => i.frequency === 'monthly').reduce((acc, i) => acc + i.costGbp, 0)
  }
}

export const globalCostEstimator = new CostEstimator()
