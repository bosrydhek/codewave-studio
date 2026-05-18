import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_PROJECT_URL!,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
)

async function test() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'dev@designwave.ai')
    .single()

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success! Found user:', data)
  }
}

test()
