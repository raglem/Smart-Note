import { NextResponse } from "next/server"

export async function POST(){
    const response = NextResponse.json({ message: 'Logged out' })
    response.cookies.set('access_token', '', { maxAge: 0 })
    response.cookies.set('refresh_token', '', { maxAge: 0 })
    return response
}