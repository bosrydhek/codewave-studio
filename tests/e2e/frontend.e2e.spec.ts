import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage and see workbench', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/$/)

    // Wait for the app logo to appear in the sidebar
    await expect(page.getByText('designwave').first()).toBeVisible({ timeout: 15000 })
  })
})
