"use client"

import { useEffect, useState } from "react";
import { FRQAnswerType, MCQAnswerType, QuestionType, QuizResultType, FormattedAnswerType } from "@/types/Quizzes";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import MCQAnswerableQuestion from "./MCQAnswerableQuestion";
import useMemberStore from "@/stores/memberStore";
import { toast } from "react-toastify";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import FRQAnswerableQuestion from "./FRQAnswerableQuestion";

export default function TakeQuiz({ quiz_id, questions } : {
    quiz_id: number,
    questions: QuestionType[]
}){
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [MCQAnswers, setMCQAnswers] = useState<MCQAnswerType[]>(questions.filter(question => question.question_category === 'MultipleChoice').map(question => ({
        question_id: question.id,
        wrong_selected_choice: null,
        result: 'Incorrect',
        answer_category: "MultipleChoice"
    })))
    const [FRQAnswers, setFRQAnswers] = useState<FRQAnswerType[]>(questions.filter(question => question.question_category === 'FreeResponse').map(question => ({
        question_id: question.id,
        user_answer: "",
        total_possible_points: question.total_possible_points,
        answer_category: "FreeResponse"
    })))
    const paginatedQuestions: QuestionType[][] = (() => {
        const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)
        const pages: QuestionType[][] = []
        const questionsPerPage = 5
        for(let i=0; i<questions.length; i+=questionsPerPage){
            pages.push(sortedQuestions.slice(i, i+questionsPerPage))
        }
        return pages
    })()

    const member = useMemberStore(state => state.member)
    const fetchMember = useMemberStore(state => state.fetchMember)

    useEffect(() => {
        fetchMember()
    }, [fetchMember])

    const router = useRouter()

    const verifyMCQAnswer = (questionId: number, selectedChoice: number | null, result: "Correct" | "Incorrect") => {
        setMCQAnswers(prevAnswers => 
            prevAnswers.map(answer => 
                answer.question_id === questionId ? { ...answer, wrong_selected_choice: selectedChoice, result } : answer
            )
        )
    }
    const saveFRQAnswer = (questionId: number, userAnswer: string) => {
        setFRQAnswers(prevAnswers => 
            prevAnswers.map(answer => 
                answer.question_id === questionId ? { ...answer, user_answer: userAnswer } : answer
            )
        )
    }
    const submitQuiz = async () => {
        // Format the request data to be sent to the api
        const mcq_answers: FormattedAnswerType[] = MCQAnswers.map((answer, i) => ({
            ...answer,
            question: answer.question_id,
            order: i+1
        }))
        const frq_answers: FormattedAnswerType[] = FRQAnswers.map((answer, i) => ({
            ...answer,
            question: answer.question_id,
            order: i+1
        }))

        // Calculate the score
        let awardedPoints = 0
        let totalPossiblePoints = 0
        mcq_answers.forEach((answer) => {
            if("result" in answer && answer.result === 'Correct'){
                awardedPoints += 1
            }
            totalPossiblePoints += 1
        })
        FRQAnswers.forEach((answer) => {
            totalPossiblePoints += answer.total_possible_points
        })

        // Retrieve member information to append to the request body
        if(!member || !member.id) {
            console.log(member)
            toast.error("Could not retrieve member information. Please login or try again later")
            return
        }

        // Prepare request body with the quiz result
        const quizResult: QuizResultType = {
            id: -1,
            member_id: member.id,
            quiz_id: quiz_id,
            points_awarded: awardedPoints,
            total_possible_points: totalPossiblePoints,
            mcq_answers,
            frq_answers
        }
        const body = {
            ...quizResult,
            member: quizResult.member_id,
            quiz: quizResult.quiz_id
        }

        try{
            await api.post('/quizzes/submit/', body)
            toast.success('Quiz submitted successfully')
            router.push('/quizzes/')
        }
        catch(err){
            console.error(err)
            toast.error("An error occurred while submitting the quiz. Please try again later")
        }
    }
    return (
        <div className="relative flex flex-col h-full gap-y-4">
            <div className="flex flex-col min-h-[calc(100vh-450px)] w-full gap-y-2">
                {paginatedQuestions[currentPage].map(question => 
                    question.question_category === "MultipleChoice" ? (
                        <MCQAnswerableQuestion key={`MCQ${question.id}`} question={question} verifyAnswer={verifyMCQAnswer} />
                    ) : question.question_category === "FreeResponse" ? (
                        <FRQAnswerableQuestion key={`FRQ${question.id}`} question={question} saveAnswer={saveFRQAnswer} />
                    ) : null
                )}
            </div>
            <div className="bottom-0 flex flex-col gap-y-2 w-full">
                {currentPage === paginatedQuestions.length-1 && <div className="flex flex-row justify-end items-center">
                    <button className="p-2 rounded-md text-white bg-primary cursor-pointer hover:opacity-80" onClick={submitQuiz}>
                        Submit Quiz
                    </button>
                </div>}
                <nav className="flex flex-row w-full justify-center items-center gap-x-2">
                    <FaCaretLeft className="text-primary text-3xl" onClick={() => {
                        if(currentPage > 0) setCurrentPage(prev => prev - 1)
                    }}/>
                    <button className="border-1 border-primary text-black py-1 px-3">
                        {currentPage + 1}
                    </button>
                    <FaCaretRight className="text-primary text-3xl" onClick={() => {
                        if(currentPage < paginatedQuestions.length) setCurrentPage(prev => prev + 1)
                    }}/>
                </nav>
            </div>
        </div>
    )
}