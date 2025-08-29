"use client"

import { useState } from "react"
import { AnswerResultType } from "@/types/Quizzes"
import MCQAnswerResult from "./MCQAnswerResult"
import FRQAnswerResult from "./FRQAnswerResult"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import Link from "next/link"

export default function Results({ answers }: { answers: AnswerResultType[]}){
    const [currentPage, setCurrentPage] = useState<number>(0)
    const paginatedAnswers: AnswerResultType[][] = (() => {
        const pages: AnswerResultType[][] = []
        const answersPerPage = 5
        for(let i=0; i<answers.length; i+=answersPerPage){
            pages.push(answers.slice(i, i+answersPerPage))
        }
        return pages
    })()
    return (
        <div className="flex flex-col h-full w-full gap-y-8">
            <div className="flex flex-col min-h-[calc(100vh-450px)] w-full gap-y-4">
                { paginatedAnswers[currentPage].map(answer => 
                    answer.answer_category === 'MultipleChoice' ? <div className="flex w-full border-b-1 border-primary" key={answer.id}>
                        <MCQAnswerResult answer={answer} />
                    </div> : (answer.answer_category === 'FreeResponse' ? <div className="flex w-full border-b-1 border-primary" key={answer.id}>
                        <FRQAnswerResult answer={answer} />
                    </div> : null)
                )}
            </div>
            <div className="flex flex-col gap-y-2 w-full">
                <div className="flex flex-row justify-end items-center">
                    <Link href="/quizzes">
                        <button className="p-2 rounded-md text-white bg-primary cursor-pointer hover:opacity-80">
                            Back To Quizzes
                        </button>
                    </Link>
                </div>
                <nav className="flex flex-row w-full justify-center items-center gap-x-2">
                    <FaCaretLeft className="text-primary text-3xl" onClick={() => {
                        if(currentPage > 0) setCurrentPage(prev => prev - 1)
                    }}/>
                    <button className="border-1 border-primary text-black py-1 px-3">
                        {currentPage + 1}
                    </button>
                    <FaCaretRight className="text-primary text-3xl" onClick={() => {
                        if(currentPage < paginatedAnswers.length) setCurrentPage(prev => prev + 1)
                    }}/>
                </nav>
            </div>
        </div>
    )
}