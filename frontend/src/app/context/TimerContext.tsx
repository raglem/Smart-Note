"use client"

import { createContext, useState } from "react"

const TimerContext = createContext<{ timer: number, setTimer: React.Dispatch<React.SetStateAction<number>> }>({} as { timer: number, setTimer: React.Dispatch<React.SetStateAction<number>> })

const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    const [timer, setTimer] = useState<number>(0)

    return (
        <TimerContext.Provider value={{ timer, setTimer }}>
            {children}
        </TimerContext.Provider>
    )
}

export { TimerContext, TimerProvider}