import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createClient } from '@/utils/supabase/client'

export function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const next = searchParams.get('next') || '/dashboard'

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/?error=auth_callback_failed')
          return
        }
      }
      
      navigate(next)
    }

    handleCallback()
  }, [searchParams, navigate, supabase])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-bg-base">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-base border-t-transparent" />
        <p className="text-text-muted animate-pulse font-medium">Completing authentication...</p>
      </div>
    </div>
  )
}
