"use client"

import api from "@/utils/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"

export default function TestUserLogin(){
    const [username, password] = ["test_user", "mypassword"]
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const handleLogin = async () => {
        setLoading(true)
        const delayTimer = setTimeout(() => {
            toast.error('Initial response may be delayed up to a minute due to server spinup. Thank you for your patience')
        }, 5000);
        try{
            const res = await api.post('/users/login/', { username, password })
            clearTimeout(delayTimer)
            toast.success(`${username} login successful`)
            localStorage.setItem('ACCESS_TOKEN', res.data.access)
            
            // Reset fields
            router.push('/classes/')
        }
        catch{
            toast.error('Something went wrong logging into the test_user. Please try again')
        }
        finally{
            clearTimeout(delayTimer)
            setLoading(false)
        }
    }
    return (
        <button 
            className="flex flex-row items-center gap-x-4 w-fit py-2 px-5 border-1 border-primary bg-none rounded-full cursor-pointer hover:opacity-80 whitespace-nowrap"
            onClick={handleLogin}
        >
            Try the demo user
            {loading && <SmallLoadingSpinner />}
        </button>
    )
}

function SmallLoadingSpinner(){
    return (<div className="flex items-center justify-center">
        <div
          className="
            inline-block
            h-6 w-6
            aspect-square
            animate-spin
            rounded-full
            border-4
            border-solid
            border-current
            border-r-transparent
            align-[-0.125em]
            text-primary
            motion-reduce:animate-[spin_1.5s_linear_infinite]
          "
          role="status">
          <span
            className="
              !absolute
              !-m-px
              !h-px
              !w-px
              !overflow-hidden
              !whitespace-nowrap
              !border-0
              !p-0
              ![clip:rect(0,0,0,0)]
            "
          >Loading...</span>
        </div>
      </div>)
}