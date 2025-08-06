import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    const cookieStore = await cookies()
    const body = { refresh: cookieStore.get('refresh_token')?.value }

    if(!body.refresh){
        return NextResponse.json({ error: 'No refresh token found' }, { status: 401 })
    }

    const res = await fetch(`${process.env.DJANGO_API}/users/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    if(!res.ok){
        return NextResponse.json({ error: 'Refresh token not valid' }, { status: 400 })
    }

    const data = await res.json()
    const response = NextResponse.json({ success: true })

    // Set new access token
    response.cookies.set('access_token', data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60, // 1 hour
    })

    return response
}