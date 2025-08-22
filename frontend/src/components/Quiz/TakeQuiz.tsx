"use client"

import { useEffect, useState } from "react";
import { AnswerType, MultipleChoiceQuestionType, QuestionAnswerType, QuizResultType } from "@/types/Quizzes";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import AnswerableQuestion from "./AnswerableQuestion";
import useMemberStore from "@/stores/memberStore";
import { toast } from "react-toastify";
import api from "@/utils/api";

export default function TakeQuiz({ quiz_id, questions } : {
    quiz_id: number,
    questions: MultipleChoiceQuestionType[]
}){
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [selectedAnswers, setSelectedAnswers] = useState<AnswerType[]>(questions.map(question => ({
        question_id: question.id,
        result: "Incorrect"
    })))
    const paginatedQuestions: MultipleChoiceQuestionType[][] = (() => {
        const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)
        const pages: MultipleChoiceQuestionType[][] = []
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
    }, [])

    const verifyAnswer = (questionId: number, result: "Correct" | "Incorrect") => {
        setSelectedAnswers(prevAnswers => 
            prevAnswers.map(answer => 
                answer.question_id === questionId ? { ...answer, result } : answer
            )
        )
    }
    const submitQuiz = async () => {
        // Calculate the score
        let numberOfCorrectAnswers = 0
        let numberOfWrongAnswers = 0
        const answers: QuestionAnswerType[] = selectedAnswers.map(answer => ({
            question: answer.question_id,
            result: answer.result,
            order: questions.find(q => q.id === answer.question_id)?.order || 0
        }))
        for(const answer of selectedAnswers){
            if(answer.result === "Correct") numberOfCorrectAnswers++
            else numberOfWrongAnswers++
        }

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
            number_of_correct_answers: numberOfCorrectAnswers,
            number_of_questions: numberOfCorrectAnswers + numberOfWrongAnswers,
            answers: answers
        }
        const body = {
            ...quizResult,
            member: quizResult.member_id,
            quiz: quizResult.quiz_id
        }

        try{
            const res = await api.post('/quizzes/results/', body)
            console.log(res.data)
            toast.success('Quiz submitted successfully')
        }
        catch(err){
            console.error(err)
            toast.error("An error occurred while submitting the quiz. Please try again later")
        }
    }
    return (
        <div className="relative flex flex-col h-full gap-y-4">
            <div className="flex flex-col w-full gap-y-2">
                {paginatedQuestions[currentPage].map(question => (
                    <AnswerableQuestion key={question.id} question={question} verifyAnswer={verifyAnswer} />
                ))}
            </div>
            <div className="absolute bottom-0 flex flex-col gap-y-2 w-full">
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