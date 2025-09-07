"use client"

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import ErrorPage from "@/components/ErrorPage";
import GradeQuiz from "@/components/Quiz/SelfGrade/GradeQuiz";
import Results from "@/components/Quiz/Results/Results";
import { FRQAnswerResultType, MCQAnswerResultType, QuizResultDetailType } from "@/types/Quizzes";
import { toast } from "react-toastify";
import api from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function QuizResultPage(){
    const params = useParams()
    const id = params.id
    const router = useRouter()

    const [quizResult, setQuizResult] = useState<QuizResultDetailType | null>(null)
    const { formattedMCQs, formattedFRQs, sortedAnswers } = useMemo(() => {
        if (!quizResult) {
            return {
            formattedMCQs: null,
            formattedFRQs: null,
            sortedAnswers: null,
            };
        }
        
        const formattedMCQs: MCQAnswerResultType[] = quizResult.mcq_answers.map(answer => ({
            ...answer,
            answer_category: "MultipleChoice",
        }));
        
        const formattedFRQs: FRQAnswerResultType[] = quizResult.frq_answers.map(answer => ({
            ...answer,
            answer_category: "FreeResponse",
        }));
        
        const sortedAnswers = [...formattedMCQs, ...formattedFRQs].sort((a, b) => a.order - b.order);
        
        return { formattedMCQs, formattedFRQs, sortedAnswers };
    }, [quizResult]);
    const [error, setError] = useState<boolean>(false)
    
    useEffect(() => {
        const fetchQuizResult = async () => {
            const accessToken = localStorage.getItem('ACCESS_TOKEN')
            if (!accessToken) {
                toast.error('Current user session expired. Please login again')
                router.push('/login')
            }
    
            try{
                const res = await api.get(`/quizzes/results/${id}`)
                const data = res.data as QuizResultDetailType
                setQuizResult(data)
            }
            catch(err){
                console.error(err)
                toast.error('Something went wrong fetching the quiz result. Please try again')
                setError(true)
            }
        }

        fetchQuizResult()
    }, [id, router])

    if(error){
        return (
            <ErrorPage message={"Failed to retrieve quizzes"} />
        )
    }

    if(!quizResult || !formattedMCQs || !formattedFRQs){
        return (
            <div className="h-[calc(100vh-150px)] w-full flex justify-center items-center">
                <LoadingSpinner />
            </div>
        )
    }
    
    return (
        <div className="flex flex-col h-full w-full max-w-[1280px] gap-y-5">
            <header className={`flex flex-col gap-4 pb-4 border-b-1 border-b-primary ${quizResult.status === 'Pending' && 'border-b-0'}`}>
                {quizResult.status === 'Graded' && <h1 className="font-normal text-4xl">Quiz Result | {quizResult.quiz.name}</h1>}
                {quizResult.status === 'Pending' && <h1 className="font-normal text-4xl">Self-Grade Quiz | {quizResult.quiz.name}</h1>}
                <h3 className="font-normal text-2xl">{ quizResult.quiz.related_class.name } | Made by { quizResult.quiz.owner.name } </h3>
                <div className="flex flex-wrap gap-2">
                    {quizResult.quiz.related_units.map(unit => (
                        <div key={unit.id} className="bg-primary text-white rounded-xl py-1 px-4">
                            {unit.name}
                        </div>
                    ))}
                    {quizResult.quiz.related_subunits.map(subunit => (
                        <div key={subunit.id} className="flex flex-row items-center border-1 border-primary bg-white text-black rounded-xl py-1 px-4">
                            {subunit.name}
                        </div>
                    ))}
                </div>
            </header>
            {quizResult.status === 'Graded' && <Results answers={sortedAnswers} />}
            {quizResult.status === 'Pending' && 
                <GradeQuiz 
                    multipleChoiceAnswers={formattedMCQs} multipleChoicePoints={quizResult.points_awarded} 
                    freeResponseAnswers={formattedFRQs}
                />}
        </div>
    )
}