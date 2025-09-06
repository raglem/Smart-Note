"use client"

import ErrorPage from "@/components/ErrorPage"
import QuizzesBoard from "@/components/Quiz/QuizzesBoard"
import { QuizResultSimpleType, QuizSimpleType, QuizType } from "@/types/Quizzes"
import api from "@/utils/api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function QuizPage(){
    const router = useRouter()
    const accessToken = localStorage.getItem('ACCESS_TOKEN')
    const [quizzes, setQuizzes] = useState<QuizSimpleType[]>([])
    const [results, setResults] = useState<QuizResultSimpleType[]>([])
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        fetchQuizzes()
    }, [])


    const fetchQuizzes = async () => {
        if (!accessToken) {
            toast.error('Current user session expired. Please login again')
            router.push('/login')
        }
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
    }

    if(error){
        return (
            <ErrorPage message={"Failed to retrieve quizzes"} />
        )
    }

    return (
        <QuizzesBoard quizzes={quizzes} results={results} />
    )
}