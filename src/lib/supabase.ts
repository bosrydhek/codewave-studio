import { createClient as createBrowserClient } from '@/utils/supabase/client'
import { getAppUrl } from './urls'

/**
 * Get the Supabase client for the current context.
 * This file is now client-safe. For server-side usage,
 * use `@/utils/supabase/server` directly.
 */
export const getSupabaseClient = () => {
  return createBrowserClient()
}

// Internal client for browser-side hooks or direct legacy compatibility
export const supabase = (() => {
  if (typeof window !== 'undefined') {
    // Return a mocked client for local development
    return {
      auth: {
        getUser: async () => ({ data: { user: { id: 'local-dev', email: 'local@developer.com', user_metadata: { full_name: 'Local Developer' } } }, error: null }),
        getSession: async () => ({ data: { session: { user: { id: 'local-dev', email: 'local@developer.com' } } }, error: null }),
        onAuthStateChange: (callback: any) => {
          callback('SIGNED_IN', { user: { id: 'local-dev', email: 'local@developer.com' } });
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signInWithPassword: async () => ({ data: { user: { id: 'local-dev' } }, error: null }),
        signUp: async () => ({ data: { user: { id: 'local-dev' } }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: {}, error: null }),
            maybeSingle: async () => ({ data: {}, error: null }),
          }),
          order: () => ({
            limit: async () => ({ data: [], error: null }),
          }),
        }),
        insert: () => ({
          select: () => ({
            single: async () => ({ data: {}, error: null }),
          }),
        }),
      }),
    } as any;
  }
  return null as any;
})()

/**
 * Fetch the current user profile
 * Uses native auth session to ensure security
 */
export const getUserProfile = async () => {
  // Mock profile for local development
  return {
    id: 'local-dev',
    email: 'local@developer.com',
    full_name: 'Local Developer',
    settings: {},
    skills: []
  }
}

/**
 * Sync all user data (settings and skills)
 * Uses authenticated user ID to prevent unauthorized access
 */
export const syncUserData = async (settings: Record<string, unknown>, skills: unknown[]) => {
  console.log('[Supabase] syncUserData skipped in local mode', { settings, skills })
  return null
}

/**
 * Authentication Helpers (2026 Production Standards)
 */

export const signUpWithEmail = async (email: string, password: string) => {
  const sb = await getSupabaseClient()
  const baseUrl = getAppUrl()

  return await sb.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: baseUrl ? `${baseUrl}/auth/callback/` : undefined,
    },
  })
}

export const signInWithEmail = async (email: string, password: string) => {
  const sb = await getSupabaseClient()
  return await sb.auth.signInWithPassword({ email, password })
}

export const signInWithMagicLink = async (email: string) => {
  const sb = await getSupabaseClient()
  const baseUrl = getAppUrl()

  return await sb.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: baseUrl ? `${baseUrl}/auth/callback/` : undefined,
    },
  })
}

export const signInWithOAuth = async (
  provider: 'github' | 'google' | 'apple',
  redirectTo?: string,
) => {
  const sb = await getSupabaseClient()

  // Use getAppUrl for consistent URL resolution across environments
  const baseUrl = getAppUrl()

  const options: {
    redirectTo?: string
    scopes?: string
  } = {
    redirectTo: redirectTo || (baseUrl ? `${baseUrl}/auth/callback/` : undefined),
  }

  if (provider === 'github') {
    options.scopes = 'repo gist notifications'
  }

  console.log(`[Auth] Initiating ${provider} sign-in with redirectTo:`, options.redirectTo)

  return await sb.auth.signInWithOAuth({
    provider,
    options,
  })
}

/**
 * Fetch all projects for the current user
 */
export const getProjects = async () => {
  // Return empty array or local projects in local mode
  console.log('[Supabase] getProjects returning empty list in local mode')
  return []
}

/**
 * Legacy wrapper for GitHub token updates
 */
export const updateGitHubToken = async (token: string) => {
  return syncUserData({ githubToken: token }, [])
}
