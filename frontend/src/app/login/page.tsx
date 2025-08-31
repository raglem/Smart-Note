"use client"

import { useRouter } from "next/navigation";
import { useContext, Suspense, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function Page(){
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
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
        console.error('Login failed')
      }
    }
    return (
        <main className="flex items-center justify-center md:h-screen w-full">
          <div className="relative mx-auto flex w-full max-w-[768px] flex-col space-y-2.5 p-4 md:-mt-32 card border-1 border-primary">
            <h1 className="text-3xl">Login</h1>
            <input 
                type="text" placeholder="Username" className="form-input" 
                value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <input 
                type="password" placeholder="Password" className="form-input" 
                value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button className="form-btn bg-primary text-white"onClick={handleLogin}>Login</button>
          </div>
        </main>
      );
}