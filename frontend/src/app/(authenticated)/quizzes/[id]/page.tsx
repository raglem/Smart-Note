"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ErrorPage from "@/components/ErrorPage";
import TakeQuiz from "@/components/Quiz/TakeQuiz/TakeQuiz";
import QuizTimer from "@/components/Quiz/QuizTimer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FreeResponseQuestionType, MultipleChoiceQuestionType, QuestionType, QuizType } from "@/types/Quizzes";
import { TimerProvider } from "@/app/context/TimerContext";
import api from "@/utils/api";
import { toast } from "react-toastify";

export default function Page(){
    const router = useRouter()
    const params = useParams()
    const id = params.id    

    const [quiz, setQuiz] = useState<QuizType | null>(null)
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {fetchQuiz()}, [])

    const fetchQuiz = async () => {
        const accessToken = localStorage.getItem('ACCESS_TOKEN')
        if(!accessToken){
            toast.error('Current user session expired. Please login again')
            router.push('/login')
        }
        
        try{
            const res = await api.get(`/quizzes/${id}`)
            const data = res.data as QuizType
            const formattedMultipleChoiceQuestions: MultipleChoiceQuestionType[] = data.mcq_questions.map(mcq => ({
                ...mcq,
                question_category: "MultipleChoice"
            }))
            const formattedFreeResponseQuestions: FreeResponseQuestionType[] = data.frq_questions.map(frq => ({
                ...frq,
                question_category: "FreeResponse"
            }))
            setQuiz(data)
            setQuestions([...formattedMultipleChoiceQuestions, ...formattedFreeResponseQuestions])
        }
        catch(err){
            toast.error('Something went wrong fetching the class. Please try again')
            setError(true)
        }
    }

    if(error){
        return (
            <ErrorPage message={"Failed to retrieve quiz"} />
        )
    }

    if(!quiz){
        return (
            <div className="h-[calc(100vh-150px)] w-full flex justify-center items-center">
                <LoadingSpinner />
            </div>
        )
    }
    
    return (
        <div className="flex flex-col h-full w-full max-w-[1280px] gap-y-5">
            <TimerProvider>
                <div className="flex flex-row justify-between items-start w-full">
                    <div className="flex flex-col gap-y-4">
                        <h1 className="font-normal text-4xl">{quiz.name}</h1>
                        <h3 className="text-xl">{quiz.related_class.name} | Made by {quiz.owner.name}</h3>
                        <div className="flex flex-wrap gap-2">
                            {quiz.related_units.map(unit => (
                                <div key={unit.id} className="bg-primary text-white rounded-xl py-1 px-4">
                                    {unit.name}
                                </div>
                            ))}
                            {quiz.related_subunits.map(subunit => (
                                <div key={subunit.id} className="flex flex-row items-center border-1 border-primary bg-white text-black rounded-xl py-1 px-4">
                                    {subunit.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-row justify-end">
                        <QuizTimer />
                    </div>
                </div>
                <TakeQuiz quiz_id={quiz.id} questions={questions} />
            </TimerProvider>
        </div>
    )
}