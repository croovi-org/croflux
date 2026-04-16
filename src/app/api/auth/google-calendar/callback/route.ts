import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const userId = searchParams.get('state')
  const origin = request.headers.get('x-forwarded-host') 
    ? `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('x-forwarded-host')}`
    : request.headers.get('host')?.includes('localhost') || request.headers.get('host')?.includes('0.0.0.0')
      ? `http://localhost:3000`
      : new URL(request.url).origin

  if (!code || !userId) {
    return NextResponse.redirect(`${new URL(request.url).origin}/dashboard`)
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      throw new Error('No access token returned')
    }

    const { access_token, refresh_token, expires_in } = tokens

    await supabaseAdmin
      .from('users')
      .update({
        google_calendar_token: access_token,
        google_calendar_refresh_token: refresh_token,
        google_calendar_token_expiry: new Date(Date.now() + expires_in * 1000).toISOString(),
        google_calendar_connected: true,
      })
      .eq('id', userId)

    return NextResponse.redirect(`${origin}/auth/calendar-success?userId=${userId}`)
  } catch (err) {
    console.error('Google Calendar OAuth error:', err)
    return NextResponse.redirect(`${origin}/auth/calendar-error?userId=${userId}`)
  }
}
