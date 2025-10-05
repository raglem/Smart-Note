"use client"

import { useEffect } from "react"
import { QuestionType } from "@/types/Quizzes"
import MultipleChoiceQuestion from "./MultipleChoiceQuestion"
import { CiSquareChevDown, CiSquareChevUp } from "react-icons/ci"
import { IoTrash } from "react-icons/io5";
import FreeResponseQuestion from "./FreeResponseQuestion"

export default function Questions({questions, setQuestions}: {
    questions: QuestionType[],
    setQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>
}){
    useEffect(() => {
        if(questions.length === 0){
            setQuestions([{
                id: -1,
                question_text: "",
                question_category: "MultipleChoice",
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
    const setQuestion = (updatedQuestion: QuestionType) => {
        setQuestions(prevQuestions => prevQuestions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q))
    }
    const addQuestion = (questionCategory: 'MultipleChoice' | 'FreeResponse') => {
        if(questionCategory === 'MultipleChoice'){
            setQuestions(prevQuestions => [...prevQuestions, {
                id: -Math.abs(Math.min(...prevQuestions.map(q => q.id)))-1,
                question_text: "",
                question_category: "MultipleChoice",
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
        if(questionCategory === 'FreeResponse'){
            setQuestions(prevQuestions => [...prevQuestions, {
                id: -Math.abs(Math.min(...prevQuestions.map(q => q.id)))-1,
                question_text: "",
                question_category: "FreeResponse",
                related_units: [],
                related_subunits: [],
                order: prevQuestions.length + 1,
                correct_answer: "",
                total_possible_points: 1,
                rubrics: [{
                    id: -1,
                    reasoning_text: "",
                    possible_points: 1,
                    question: -1
                }]
            }])
        }
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
                                <IoTrash className="text-3xl text-red-500 cursor-pointer hover:opacity-80" onClick={() => removeQuestion(question.id)}/>
                            </div>
                        </div>
                        { question.question_category === 'MultipleChoice' && 
                            <MultipleChoiceQuestion 
                                question={question} setQuestion={setQuestion}
                                key={question.id} 
                            />
                        }
                        { question.question_category === 'FreeResponse' && 
                            <FreeResponseQuestion 
                                question={question} setQuestion={setQuestion}
                                key={question.id} 
                            />
                        }
                        
                    </div>
                ))}
            </div>
            <div className="flex flex-row w-full gap-x-2">
                <button className="p-2 bg-primary text-white rounded-md w-fit cursor-pointer hover:opacity-80" onClick={() => addQuestion("MultipleChoice")}>
                    New MCQ
                </button>
                <button className="p-2 bg-white text-black border-1 border-primary rounded-md w-fit cursor-pointer hover:opacity-80" onClick={() => addQuestion("FreeResponse")}>
                    New FRQ
                </button>
            </div>
            
        </div>
    )
}