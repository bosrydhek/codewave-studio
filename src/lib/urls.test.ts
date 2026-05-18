import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getAppUrl } from './urls'

describe('getAppUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should return window.location.origin if window is defined', () => {
    const originalWindow = global.window
    global.window = { location: { origin: 'https://browser-origin.com' } } as any

    expect(getAppUrl()).toBe('https://browser-origin.com')

    global.window = originalWindow
  })

  it('should return production domain for development environment (server-side fallback)', () => {
    const originalWindow = global.window
    // @ts-expect-error - delete global window for server-side testing
    delete global.window

    process.env.VERCEL_ENV = 'development'
    // Should fallback to production domain if no other vars are set
    expect(getAppUrl()).toBe('https://designwave-nine.vercel.app')

    global.window = originalWindow
  })

  it('should return production domain for production environment (server-side)', () => {
    const originalWindow = global.window
    // @ts-expect-error - delete global window for server-side testing
    delete global.window

    process.env.VERCEL_ENV = 'production'
    process.env.VERCEL_PUBLIC_APP_URL = 'https://custom-domain.com'
    expect(getAppUrl()).toBe('https://custom-domain.com')

    global.window = originalWindow
  })

  it('should return preview URL for preview environment on dev branch (server-side)', () => {
    const originalWindow = global.window
    // @ts-expect-error - delete global window for server-side testing
    delete global.window

    process.env.VERCEL_ENV = 'preview'
    process.env.VERCEL_GIT_COMMIT_REF = 'dev'
    process.env.VERCEL_DEV_PREVIEW_APP_URL = 'https://dev-preview.vercel.app'
    expect(getAppUrl()).toBe('https://dev-preview.vercel.app')

    global.window = originalWindow
  })

  it('should return default preview URL for non-dev branches (server-side)', () => {
    const originalWindow = global.window
    // @ts-expect-error - delete global window for server-side testing
    delete global.window

    process.env.VERCEL_ENV = 'preview'
    process.env.VERCEL_GIT_COMMIT_REF = 'feature-x'
    process.env.NEXT_PUBLIC_VERCEL_URL = 'feature-x.vercel.app'
    expect(getAppUrl()).toBe('https://feature-x.vercel.app')

    global.window = originalWindow
  })

  it('should fallback to NEXT_PUBLIC_VERCEL_URL if custom variables are missing (server-side)', () => {
    const originalWindow = global.window
    // @ts-expect-error - delete global window for server-side testing
    delete global.window

    process.env.VERCEL_ENV = 'preview'
    process.env.NEXT_PUBLIC_VERCEL_URL = 'generated-url.vercel.app'
    // Remove other variables
    delete process.env.VERCEL_DEV_PREVIEW_APP_URL
    delete process.env.VERCEL_PUBLIC_PREVIEW_APP_URL

    expect(getAppUrl()).toBe('https://generated-url.vercel.app')

    global.window = originalWindow
  })
})
