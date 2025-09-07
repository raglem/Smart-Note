"use client"
import { useContext } from "react"
import { useRouter } from "next/navigation"
import { UserContext } from "@/app/context/UserContext"
import { IoIosLogOut } from "react-icons/io"

export default function Logout(){
    const router = useRouter()
    const { setUserId, setUsername } = useContext(UserContext)
    const handleLogout = async () => {
        const res = await fetch('/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })

        if(!res.ok){
            console.error('Logout failed')
        }
        setUserId(null)
        setUsername("")
        localStorage.clear()
        router.push('/login')
    }

    return (
        <button onClick={handleLogout}>
            <IoIosLogOut className="h-10 w-10 hover:cursor-pointer hover:opacity-80"/>
        </button>
    )
}