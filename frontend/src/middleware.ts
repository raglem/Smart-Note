import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function middleware(request: NextRequest){
    const access = request.cookies.get('access_token')?.value
    const refresh = request.cookies.get('refresh_token')?.value

    // Check for access token
    if(!access){
        // If there is no refresh token, immediately redirect to login
        if(!refresh){
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // If there is a refresh token, ask for an access token
        else{
            try{
                const res = await fetch(`${process.env.DJANGO_API}/users/token/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh })
                })
        
                if(!res.ok){
                    return NextResponse.redirect(new URL('/login', request.url))
                }
                
                const data = await res.json()
                // Set the new access token in the response
                const response = NextResponse.next()
                response.cookies.set('access_token', data.access, {
                    httpOnly: true,
                    path: '/',
                    maxAge: 60 * 60, // 1 hour
                    secure: process.env.NODE_ENV === 'production',
                })
                return response
            }
            catch(err){
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/classes/:path*', '/study-groups/:path*']
}