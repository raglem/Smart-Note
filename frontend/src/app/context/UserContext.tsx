"use client"

import { createContext, useEffect, useState } from "react";

type UserContextType = {
    username: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>
    userId: number | null,
    setUserId: React.Dispatch<React.SetStateAction<number | null>>
    checkUser: () => Promise<boolean>
}
type MeResponseType = {
    user: {
        userId: number,
        username: string,
    }
}
export const UserContext = createContext({} as UserContextType)

export const UserProvider =({ children }: { children: React.ReactNode }) => {
    async function checkUser() {
        const res = await fetch('/api/me', { credentials: 'include' })
        if (res.status === 401 || !res.ok) {
            // Clear state variables if user is unauthenticated and information cannot be retrieved
            setUserId(null)
            setUsername("")
            return false
        }
        
        // Set state variables if response is successful
        const data = await res.json()
        const { userId, username } = data.user
        setUserId(userId)
        setUsername(username)
        return true
    }
    
    const [username, setUsername] = useState<string>("")
    const [userId, setUserId] = useState<number | null>(null)
    return <UserContext.Provider value={{
        username,
        setUsername,
        userId,
        setUserId,
        checkUser
    }}>
        { children }
    </UserContext.Provider>
}