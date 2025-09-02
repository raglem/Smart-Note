"use client"

import { UserContext } from "@/app/context/UserContext"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { toast } from "react-toastify"

export default function TestUserLogin(){
    const [username, password] = ["test_user", "mypassword"]
    const { setUsername: setUsernameContext, setUserId } = useContext(UserContext)
    const router = useRouter()
    const handleLogin = async () => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        
        if (res.ok) {
            const data = await res.json()
            const { userId, username } = data.user
            // Set user context
            setUserId(userId)
            setUsernameContext(username)

            // Redirect
            router.push('/classes')
        } else {
            toast.error('Something went wrong logging into the demo user')
        }
    }
    return (
        <button 
            className="w-fit py-2 px-5 border-1 border-primary bg-none rounded-full cursor-pointer hover:opacity-80 whitespace-nowrap"
            onClick={handleLogin}
        >
            Try the demo user
        </button>
    )
}