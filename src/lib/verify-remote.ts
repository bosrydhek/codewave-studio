import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_PROJECT_URL!,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
)

async function verify() {
  console.log('Verifying Supabase connection and schema...')

  const { data, error } = await supabase.from('users').select('*').limit(1)

  if (error) {
    console.error('Error fetching users:', error)
    process.exit(1)
  }

  console.log('Successfully connected to Supabase "users" table.')
  console.log('Row sample:', data)
  process.exit(0)
}

verify()
