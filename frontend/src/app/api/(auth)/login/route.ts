import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

type AccessTokenPayload = {
  user_id: number,
  username: string,
  token_type: string,
  exp: number,
  iat: number,
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const res = await fetch(`${process.env.DJANGO_API}/users/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  console.log(res)

  if (!res.ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const data = await res.json()

  const decrypted = jwtDecode<AccessTokenPayload>(data.access)
  const user = {
    userId: decrypted.user_id,
    username: decrypted.username
  }
  const response = NextResponse.json({ success: true, user  })

  // Set cookies
  response.cookies.set('access_token', data.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  })

  response.cookies.set('refresh_token', data.refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 // 1 day
  })

  return response
}
