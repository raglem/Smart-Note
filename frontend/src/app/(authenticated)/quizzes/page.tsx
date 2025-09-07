"use client"

import ErrorPage from "@/components/ErrorPage"
import LoadingSpinner from "@/components/LoadingSpinner"
import QuizzesBoard from "@/components/Quiz/QuizzesBoard"
import { QuizResultSimpleType, QuizSimpleType, QuizType } from "@/types/Quizzes"
import api from "@/utils/api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function QuizPage(){
    const router = useRouter()
    const [quizzes, setQuizzes] = useState<QuizSimpleType[]>([])
    const [results, setResults] = useState<QuizResultSimpleType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        fetchQuizzes()
    }, [])


    const fetchQuizzes = async () => {
        const accessToken = localStorage.getItem('ACCESS_TOKEN')
        if (!accessToken) {
            toast.error('Current user session expired. Please login again')
            router.push('/login')
        }
        setLoading(true)
        try{
            const [quizzesResponse, resultsResponse] = await Promise.all([
                api.get(`/quizzes/`), api.get(`/quizzes/results/`)
            ])
            const quizzes: QuizSimpleType[] = quizzesResponse.data
            const results: QuizResultSimpleType[] = resultsResponse.data
            setQuizzes(quizzes)
            setResults(results)
        }
        catch(err){
            toast.error('Something went wrong fetching quizzes. Please try again')
            setError(true)
        }
        finally{
            setLoading(false)
        }
    }

    if(error){
        return (
            <ErrorPage message={"Failed to retrieve quizzes"} />
        )
    }

    if(loading){
        return (
            <div className="h-[calc(100vh-150px)] w-full flex justify-center items-center">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <QuizzesBoard quizzes={quizzes} results={results} />
    )
}