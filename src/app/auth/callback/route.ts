import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth error:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      `${new URL(request.url).origin}/auth/auth-code-error`
    )
  }

  return NextResponse.redirect(
    `${new URL(request.url).origin}/auth/auth-code-error`
  )
}
