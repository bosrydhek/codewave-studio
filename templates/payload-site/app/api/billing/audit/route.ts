import { NextResponse } from 'next/server'
import { globalBillingValidation } from '@/lib/billing-validation'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get('workspaceId')
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    if (!workspaceId) {
      return NextResponse.json({ error: 'Missing workspaceId' }, { status: 400 })
    }

    const startDate = start ? new Date(start) : new Date(new Date().setDate(1)) // Start of month
    const endDate = end ? new Date(end) : new Date()

    const result = await globalBillingValidation.auditWorkspace(
      workspaceId,
      startDate,
      endDate
    )

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[Billing API] Audit error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
