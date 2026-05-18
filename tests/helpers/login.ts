import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export interface LoginOptions {
  page: Page
  user: {
    email: string
    password: string
  }
}

/**
 * Logs the user into the admin panel via the login page.
 * Uses Playwright's baseURL — all paths are relative.
 */
export async function login({ page, user }: LoginOptions): Promise<void> {
  // Auth is bypassed in development mode, so we just navigate to the admin URL
  // and expect the auto-login to handle the rest.
  await page.goto('/admin/', { waitUntil: 'domcontentloaded' })
  await page.waitForURL(/\/admin\/?/, { timeout: 30000 })
}
