import 'dotenv/config'
import { supabase } from './supabase'

export async function verifySecurity() {
  console.log('--- Security Hardening Audit ---')

  // 1. Verify RLS is enabled on core tables
  const tables = ['profiles', 'user_skills', 'project_settings']

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*', { count: 'exact', head: true })

    if (error && error.code === '42501') {
      console.log(`✅ [${table}] Row Level Security is active (Access Denied for public).`)
    } else if (error) {
      console.error(`❌ [${table}] Error checking RLS:`, error.message)
    } else {
      console.warn(`⚠️ [${table}] RLS might be disabled or policy is too restrictive/permissive.`)
    }
  }

  // 2. Check for sensitive environment variables in build
  const sensitiveKeys = ['SUPABASE_SERVICE_ROLE_KEY', 'DB_PASSWORD']
  sensitiveKeys.forEach((key) => {
    if (import.meta.env[`VITE_${key}`]) {
      console.error(`🚨 CRITICAL: Sensitive key VITE_${key} exposed in frontend environment!`)
    }
  })

  console.log('-------------------------------')
}
