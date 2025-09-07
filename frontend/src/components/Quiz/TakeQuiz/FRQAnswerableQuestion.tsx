"use client"

import { FreeResponseQuestionType } from "@/types/Quizzes"
import { useEffect, useState } from "react"

export default function FRQAnswerableQuestion({ question, saveAnswer }: { 
    question: FreeResponseQuestionType, saveAnswer: (questionId: number, userAnswer: string) => (void) 
}){
    const [userAnswer, setUserAnswer] = useState<string>("")
    useEffect(() => {
        saveAnswer(question.id, userAnswer)
    }, [userAnswer, question, saveAnswer])
    return (
        <div className="flex flex-row gap-x-2 border-b-1 border-b-primary py-4">
            <h2 className="text-2xl">{`${question.order})`}</h2>
            <div className="flex flex-col gap-y-2 w-full">
                <header className="flex flex-row justify-between items-center gap-x-2">
                    <h2 className="text-2xl">{question.question_text}</h2>
                    <h2 className="text-2xl">{question.total_possible_points}pts</h2>
                </header>
                <textarea 
                    id="question-text" value={userAnswer} 
                    className="flex h-[200px] p-1 text-xl min-w-2 border-1 border-primary outline-none"
                    onChange={e => setUserAnswer(e.target.value)}
                />
            </div>
        </div>
    )
}