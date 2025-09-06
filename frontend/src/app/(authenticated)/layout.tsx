"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import jwt, { JwtPayload } from "jsonwebtoken"
import { toast } from "react-toastify";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN')
        if(!token || isTokenExpired(token)){
            toast.error('Current user session expired. Please login again')
            router.push('/login')
        }
    }, [])

    function isTokenExpired(token: string): boolean {
        try {
            const decoded = jwt.decode(token) as JwtPayload | null;
            if (!decoded || !decoded.exp) return true; // invalid token
        
            const now = Math.floor(Date.now() / 1000); // current time in seconds
            return decoded.exp < now;
        } catch (e) {
            return true; // treat decode errors as expired
        }
    }

    return (
        <>
            { children }
        </>
    )
  }