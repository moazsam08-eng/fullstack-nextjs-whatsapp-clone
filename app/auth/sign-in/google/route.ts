import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${requestUrl.origin}/auth/callback`,
    },
  })

  if (error || !data.url) {
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set(
      'error',
      'Google sign-in could not be started. Please try again.'
    )
    return NextResponse.redirect(loginUrl, 303)
  }

  return NextResponse.redirect(data.url, 303)
}
