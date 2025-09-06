"use client"

import api from "@/utils/api";
import { createContext, useEffect, useState } from "react";

type UserContextType = {
    username: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>
    userId: number | null,
    setUserId: React.Dispatch<React.SetStateAction<number | null>>
    checkUser: () => Promise<boolean>
}
export const UserContext = createContext({} as UserContextType)

export const UserProvider =({ children }: { children: React.ReactNode }) => {
    async function checkUser() {
        // If there is no access token, return
        const token = localStorage.getItem('ACCESS_TOKEN')
        if(!token)  return false

        try{
            const res = await api.get('/users/members/me/')
            const data = res.data
            // Set state variables if response is successful
            const { id, name } = data
            setUserId(id)
            setUsername(name)
            return true
        }
        catch(err){
            console.error(err)
            setUserId(null)
            setUsername("")
            return false
        }
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