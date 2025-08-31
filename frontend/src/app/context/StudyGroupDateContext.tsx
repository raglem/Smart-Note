"use client"

import { createContext, useState } from "react"

type StudyGroupDateContextType = {
    year: number,
    month: number,
    setYear: React.Dispatch<React.SetStateAction<number>>,
    setMonth: React.Dispatch<React.SetStateAction<number>>
}

export const StudyGroupDateContext = createContext({} as StudyGroupDateContextType)

export const StudyGroupDateProvider = ({ children }: { children: React.ReactNode }) => {
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [month, setMonth] = useState<number>(new Date().getMonth())

    return (
        <StudyGroupDateContext value={{
            year,
            setYear,
            month, 
            setMonth,
        }}>
            { children }
        </StudyGroupDateContext>
    )
}