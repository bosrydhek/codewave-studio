import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/app/dashboard/'

  if (code) {
    const cookieStore = await cookies()
    
    const protocol = request.headers.get('x-forwarded-proto') ?? (requestUrl.protocol === 'http:' ? 'http' : 'https')
    const host = request.headers.get('host') ?? requestUrl.host
    const origin = `${protocol}://${host}`
    
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return response
    }

    console.error('Auth callback exchange error:', error)
    return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
  }

  const protocol = request.headers.get('x-forwarded-proto') ?? (requestUrl.protocol === 'http:' ? 'http' : 'https')
  const host = request.headers.get('host') ?? requestUrl.host
  const origin = `${protocol}://${host}`

  return NextResponse.redirect(`${origin}${next}`)
}

