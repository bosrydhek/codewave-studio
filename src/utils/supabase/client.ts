import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('[Supabase Client] Creating with URL:', url ? 'Present' : 'MISSING')
  
  if (!url || !anonKey) {
    console.error('[Supabase Client] Missing environment variables!')
  }

  return createBrowserClient(
    url!,
    anonKey!,
  )
}
