"use client"

import { useEffect } from "react"
import { MultipleChoiceQuestionType } from "@/types/Quizzes"
import MultipleChoiceQuestion from "./MultipleChoiceQuestion"
import { CiSquareChevDown, CiSquareChevUp, CiTrash } from "react-icons/ci"

export default function Questions({questions, setQuestions}: {
    questions: MultipleChoiceQuestionType[],
    setQuestions: React.Dispatch<React.SetStateAction<MultipleChoiceQuestionType[]>>
}){
    useEffect(() => {
        if(questions.length === 0){
            setQuestions([{
                id: -1,
                question_text: "New Question",
                related_units: [],
                related_subunits: [],
                order: 1,
                correct_answer: "",
                alternate_choices: [{
                    id: -1,
                    choice_text: ""
                }]
            }])
        }
    }, [])
    const setQuestion = (updatedQuestion: MultipleChoiceQuestionType) => {
        setQuestions(prevQuestions => prevQuestions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q))
    }
    const addQuestion = () => {
        setQuestions(prevQuestions => [...prevQuestions, {
            id: -Math.abs(Math.min(...prevQuestions.map(q => q.id))),
            question_text: "New Question",
            related_units: [],
            related_subunits: [],
            order: prevQuestions.length + 1,
            correct_answer: "",
            alternate_choices: [{
                id: -1,
                choice_text: ""
            }]
        }])
    }
    const removeQuestion = (removedQuestionId: number) => {
        setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== removedQuestionId))
    }
    const reorderQuestion = (questionId: number, direction: 'up' | 'down') => {
        setQuestions(prevQuestions => {
            const questionIndex = prevQuestions.findIndex(q => q.id === questionId)
            const newIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1
            if(newIndex < 0 || newIndex >= questions.length){
                return prevQuestions
            }
            const reorderedQuestions = [...prevQuestions]
            const temp = reorderedQuestions[questionIndex]
            reorderedQuestions[questionIndex] = reorderedQuestions[newIndex]
            reorderedQuestions[newIndex] = temp
            return reorderedQuestions
        })
    }
    return (
        <div className="flex flex-col w-full gap-y-5">
            <h2 className="text-3xl">Questions</h2>
            <div className="flex flex-col w-full gap-y-8">
                {questions.map((question, i) => (
                    <div key={question.id} className="flex flex-col w-full gap-y-2">
                        <div className="flex flex-row w-full justify-between items-center">
                            <label className="pt-4 text-2xl">Q{i + 1}</label>
                            <div className="flex flex-row">
                                <CiSquareChevUp className="text-3xl text-black cursor-pointer hover:opacity-80" onClick={() => reorderQuestion(question.id, 'up')}/>
                                <CiSquareChevDown className="text-3xl text-black cursor-pointer hover:opacity-80" onClick={() => reorderQuestion(question.id, 'down')}/>
                                <CiTrash className="text-3xl text-black cursor-pointer hover:opacity-80" onClick={() => removeQuestion(question.id)}/>
                            </div>
                        </div>
                        <MultipleChoiceQuestion 
                            question={question} setQuestion={setQuestion}
                            key={question.id} 
                        />
                    </div>
                ))}
            </div>
            <button className="p-2 bg-primary text-white rounded-md w-fit cursor-hover" onClick={addQuestion}>
                Add Question
            </button>
        </div>
    )
}