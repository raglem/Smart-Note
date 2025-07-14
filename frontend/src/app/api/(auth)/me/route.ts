import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'

type AccessTokenPayload = {
  user_id: number,
  username: string,
  token_type: string,
  exp: number,
  iat: number,
}

export async function GET() {
  const cookieStore = await cookies()
  let access = cookieStore.get('access_token')?.value
  let refresh = cookieStore.get('refresh_token')?.value

  // Check there is no access token
  if (!access) {
    // If there is no refresh token, return unauthenticated response
    if(!refresh){
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    // If there is a refresh token, ask for an access token
    else{
      try{
        const res = await fetch(`${process.env.DJANGO_API}/users/token/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh })
        })

        if(!res.ok){
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        
        const data = await res.json()

        const secret = process.env.JWT_SECRET || ''
        const user = jwt.verify(data.access, secret)

        // Write a response with the message and user, and set the new access token 
        const response = NextResponse.json({ message: 'Token refreshed', user })
        response.cookies.set('access_token', data.access, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60, // 1 hour
          secure: process.env.NODE_ENV === 'production',
        })

        return response
      }
      catch(err){
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }
    }
  }

  // If there is an access token, send back a response with the user
  try {
    const secret = process.env.JWT_SECRET || ''
    const decrypted = jwtDecode<AccessTokenPayload>(access)
    const user = {
      userId: decrypted.user_id,
      username: decrypted.username
    }
    return NextResponse.json({ user })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}