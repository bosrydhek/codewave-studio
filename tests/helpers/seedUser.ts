
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
const MAX_RETRIES = 5
const INITIAL_DELAY_MS = 2000

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
}

/**
 * Seeds a test user for e2e admin tests by calling the internal test API.
 * Includes retry logic with exponential backoff to handle slow server starts.
 */
export async function seedTestUser(): Promise<void> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${BASE_URL}/api/test/seed`, {
        method: 'POST',
      })
      if (response.ok) return

      lastError = new Error(
        `Failed to seed test user (attempt ${attempt}/${MAX_RETRIES}): ${response.status} ${response.statusText}`,
      )
    } catch (err) {
      lastError =
        err instanceof Error
          ? err
          : new Error(`Seed fetch failed on attempt ${attempt}/${MAX_RETRIES}`)
    }

    if (attempt < MAX_RETRIES) {
      const delay = INITIAL_DELAY_MS * attempt
      console.log(`[seedTestUser] Attempt ${attempt} failed, retrying in ${delay}ms...`)
      await new Promise((r) => setTimeout(r, delay))
    }
  }

  throw lastError ?? new Error('Failed to seed test user after all retries')
}

/**
 * Cleans up the test user after tests complete.
 */
export async function cleanupTestUser(): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/api/test/seed`, {
      method: 'POST',
    })
    if (!response.ok) {
      console.warn(`[cleanupTestUser] Cleanup seed returned ${response.status}`)
    }
  } catch {
    // Best-effort cleanup — don't fail the test suite
    console.warn('[cleanupTestUser] Cleanup request failed (non-fatal)')
  }
}
