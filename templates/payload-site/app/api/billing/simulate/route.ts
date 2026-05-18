import { NextResponse } from 'next/server'
import { globalBillingValidation } from '@/lib/billing-validation'

export async function POST(req: Request) {
  try {
    const { scenario, workspaceId, pricingRuleVersion } = await req.json()

    if (!scenario || !workspaceId) {
      return NextResponse.json({ error: 'Missing scenario or workspaceId' }, { status: 400 })
    }

    const result = await globalBillingValidation.simulate(
      scenario,
      workspaceId,
      pricingRuleVersion
    )

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[Billing API] Simulation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
