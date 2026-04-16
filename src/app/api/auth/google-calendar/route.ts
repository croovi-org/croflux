import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.events openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: userId,
  })

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  return NextResponse.redirect(googleAuthUrl)
}
