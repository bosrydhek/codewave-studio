/// <reference types="vite/types/importMeta.d.ts" />
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url =
    import.meta.env.VITE_SUPABASE_PROJECT_URL ||
    import.meta.env.VITE_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('Supabase credentials missing. Check your environment variables.')
  }

  return createBrowserClient(url!, key!)
}
