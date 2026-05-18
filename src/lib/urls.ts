/**
 * Utility to get the absolute application URL based on the current environment.
 * Supports Vercel's multi-environment setups (Dev, Preview, Production).
 */
export function getAppUrl(): string {
  // 1. Browser context: always use current origin for dynamic deployment support
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  const isValidUrl = (url: string | undefined): url is string => !!url && !url.includes('*')

  // 2. Server context: Check for custom environment variable overrides
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV
  const branch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || process.env.VERCEL_GIT_COMMIT_REF

  if (env === 'production') {
    const prodUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_VERCEL_PUBLIC_APP_URL ||
      process.env.VERCEL_PUBLIC_APP_URL

    if (isValidUrl(prodUrl)) return prodUrl
    return 'https://designwave-nine.vercel.app'
  }

  if (env === 'preview') {
    if (branch === 'dev') {
      const devUrl = process.env.NEXT_PUBLIC_VERCEL_DEV_PREVIEW_APP_URL || process.env.VERCEL_DEV_PREVIEW_APP_URL
      if (isValidUrl(devUrl)) return devUrl
    }
  }

  // Fallback to Vercel provided URL or Production domain
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL
  if (isValidUrl(process.env.NEXT_PUBLIC_APP_URL)) return process.env.NEXT_PUBLIC_APP_URL
  if (isValidUrl(vercelUrl)) return `https://${vercelUrl}`

  return 'https://designwave-nine.vercel.app'
}
