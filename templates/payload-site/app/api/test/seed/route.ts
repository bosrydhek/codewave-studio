import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

console.log('[SEED] Route file loaded.')

export async function POST() {
  console.log('[SEED] Starting seed process...')
  // Only allow in development or test environments
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    console.log('[SEED] Forbidden: NODE_ENV is', process.env.NODE_ENV)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    console.log('[SEED] Getting payload instance...')
    const payload = await getPayload({ config })
    console.log('[SEED] Payload instance acquired.')

    const testUser = {
      email: 'dev@payloadcms.com',
      password: 'test',
    }

    // Delete existing test user if any
    console.log('[SEED] Deleting existing test user...')
    await payload.delete({
      collection: 'users',
      where: {
        email: {
          equals: testUser.email,
        },
      },
    })
    console.log('[SEED] Existing test user deleted (if any).')

    // Create fresh test user
    console.log('[SEED] Creating fresh test user...')
    await payload.create({
      collection: 'users',
      data: testUser,
    })
    console.log('[SEED] Fresh test user created.')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[SEED] Error seeding test user:', error)
    return NextResponse.json({ error: 'Failed to seed user' }, { status: 500 })
  }
}
