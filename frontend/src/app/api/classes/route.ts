import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export default async function GET(){
    const cookieStore = await cookies()
    const access = cookieStore.get('access_token')?.value

    if(!access){
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try{
        const res = await fetch(`${process.env.DJANGO_API}/classes/`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}` 
            },
        })

        if(!res.ok){
            return NextResponse.json({ message: 'Failed to fetch classes' }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    }
    catch(err){
        console.error(err)
        return NextResponse.json({ message: 'Server Error' }, { status: 500 })
    }
}