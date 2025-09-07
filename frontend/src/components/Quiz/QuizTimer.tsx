"use client"

import { TimerContext } from "@/app/context/TimerContext"
import { useContext, useEffect } from "react"

export default function QuizTimer() {
    const { timer, setTimer } = useContext(TimerContext)
    useEffect(() => {
        const timerIntervalId = setInterval(() => {
            setTimer(prev => prev + 1)
        }, 1000)
        return () => {
            clearInterval(timerIntervalId)
        }
    }, [setTimer])
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
    return (
        <div className="flex flex-row justify-center items-center py-2 px-4 bg-primary text-white rounded-lg">
            <span className="text-2xl">{ formatTime(timer) }</span>
        </div>
    )
}