import { describe, it, expect } from 'vitest'
import { CostEstimator } from '../cost-estimator'
import { PricingRule } from '../types'

const mockPricingRule: PricingRule = {
  id: 'rule-1',
  version: '1.0',
  rules: {
    memory_gb_hour: { rate: 0.05, unit: 'GB/h' },
    ai_token_million: { rate: 2.00, unit: 'M-Tokens' }
  },
  is_active: true,
  created_at: new Date().toISOString()
}

describe('CostEstimator', () => {
  it('calculates memory cost correctly with trace', () => {
    const estimator = new CostEstimator()
    const usage = [
      { resource_type: 'memory_gb_hour', quantity: 10 }
    ]
    
    const breakdown = estimator.calculateUsage(usage, mockPricingRule)
    
    expect(breakdown.totalCost).toBe(0.50)
    expect(breakdown.items).toHaveLength(1)
    expect(breakdown.items[0].resource).toBe('memory_gb_hour')
    expect(breakdown.items[0].total).toBe(0.50)
  })

  it('calculates combined costs correctly', () => {
    const estimator = new CostEstimator()
    const usage = [
      { resource_type: 'memory_gb_hour', quantity: 100 },
      { resource_type: 'ai_token_million', quantity: 0.5 }
    ]
    
    const breakdown = estimator.calculateUsage(usage, mockPricingRule)
    
    // 100 * 0.05 = 5.00
    // 0.5 * 2.00 = 1.00
    // Total = 6.00
    expect(breakdown.totalCost).toBe(6.00)
    expect(breakdown.items).toHaveLength(2)
  })

  it('handles missing pricing rules by logging anomalies', () => {
    const estimator = new CostEstimator()
    const usage = [
      { resource_type: 'memory_gb_hour', quantity: 10 },
      { resource_type: 'rag_queries', quantity: 5 } // No rule for rag_queries
    ]
    
    const breakdown = estimator.calculateUsage(usage, mockPricingRule)
    
    expect(breakdown.anomalies).toContain('No pricing rule found for resource: rag_queries')
  })
})
