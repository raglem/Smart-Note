"use client"
import { useState } from "react";
import { FRQAnswerResultType, MCQAnswerResultType } from "@/types/Quizzes";
import { FaCaretDown, FaCaretLeft, FaCaretRight, FaCaretUp } from "react-icons/fa";
import MCQAnswerResult from "../Results/MCQAnswerResult";
import FRQAnswerGrade from "./FRQAnswerGrade";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type GradedStatusType = {
    answer_id: number,
    status: "Pending" | "Graded"
    points_awarded: number,
}
export default function GradeQuiz({ quizId, multipleChoiceAnswers, multipleChoicePoints, freeResponseAnswers }: 
{ 
    quizId: number
    multipleChoiceAnswers: MCQAnswerResultType[]
    multipleChoicePoints: number,
    freeResponseAnswers: FRQAnswerResultType[]
}){
    // State variables
    const [viewMCQs, setViewMCQs] = useState<boolean>(false)
    const [currentMCQPage, setCurrentMCQPage] = useState<number>(0)
    const [statuses, setStatuses] = useState<GradedStatusType[]>(freeResponseAnswers.map(answer => ({ answer_id: answer.id, status: "Pending", points_awarded: 0 })))

    // Computed properties
    const sortedMCQs = multipleChoiceAnswers.sort((a,b) => a.order - b.order)
    const paginatedMCQAnswers: MCQAnswerResultType[][] = (() => {
        const pages: MCQAnswerResultType[][] = []
        const answersPerPage = 5
        for(let i=0; i<sortedMCQs.length; i+=answersPerPage){
            pages.push(sortedMCQs.slice(i, i+answersPerPage))
        }
        return pages
    })()
    const allGraded: boolean = statuses.every(statusObj => statusObj.status === "Graded");

    const router = useRouter()

    // Functions
    const setStatus = (answer_id: number, newStatus: "Pending" | "Graded") => {
        setStatuses(prevStatuses => prevStatuses.map(prevStatus => prevStatus.answer_id === answer_id ? {
            ...prevStatus,
            status: newStatus
        } : prevStatus))
    }
    const handleSubmitGrading = async () => {
        const formattedAnswers = freeResponseAnswers.map(answer => ({
            answer: answer.id,
            graded_rubrics: answer.question.rubrics.map(rubric => {
                const foundGradedStatus = statuses.find(status => status.answer_id === answer.id)
                return {
                    rubric: rubric.id,
                    points_awarded: foundGradedStatus?.points_awarded || 0
                }
            })}))
        try{
            const res = await api.post('/quizzes/grade/', { answers: formattedAnswers })
            console.log(res.data)
            toast.success("Quiz submitted and graded successfully")
            router.push('/quizzes/')
        }
        catch(err){
            console.error(err)
            toast.error("An error occcurred while submitting your graded quiz")
        }
    }
    return (
        <div className="flex flex-col w-full gap-y-8">
            <div className="flex flex-row justify-between items-center w-full border-1 border-primary bg-white p-2" onClick={() => setViewMCQs(prev => !prev)}>
                <h2 className="text-2xl">
                    <span>View Graded MCQs | MCQ Score: &nbsp;</span>
                    <span className="text-primary">{ multipleChoicePoints }</span>
                    <span>/{ multipleChoiceAnswers.length }</span>
                </h2>
                {viewMCQs && <FaCaretDown className="icon-responsive"/>}
                {!viewMCQs && <FaCaretUp className="icon-responsive" />}
            </div>
            {viewMCQs && <div className="flex flex-col p-4 w-full border-1 border-primary border-t-0 bg-white">
                { paginatedMCQAnswers[currentMCQPage].map(answer => (
                    <MCQAnswerResult answer={answer} key={answer.id} />
                ))}
                <nav className="flex flex-row w-full justify-center items-center gap-x-2">
                    <FaCaretLeft className="text-primary text-3xl" onClick={() => {
                        if(currentMCQPage > 0) setCurrentMCQPage(prev => prev - 1)
                    }}/>
                    <button className="border-1 border-primary text-black py-1 px-3">
                        {currentMCQPage + 1}
                    </button>
                    <FaCaretRight className="text-primary text-3xl" onClick={() => {
                        if(currentMCQPage < paginatedMCQAnswers.length) setCurrentMCQPage(prev => prev + 1)
                    }}/>
                </nav>
            </div>}
            <div className="flex flex-col w-full gap-y-2">
                <h1>To Be Graded: </h1>
                {freeResponseAnswers.map(answer => {
                    const foundStatus = statuses.find(status => status.answer_id === answer.id)
                    return foundStatus && 
                    <FRQAnswerGrade 
                        answer={answer} 
                        status={foundStatus.status} 
                        setStatus={(newStatus: "Pending" | "Graded") => setStatus(answer.id, newStatus)} 
                        key={answer.id} 
                    />
                })}
            </div>
            <div className="flex flex-row justify-end w-full">
                <button 
                    disabled={!allGraded}
                    className={`p-2 bg-primary rounded-md text-white text-2xl ${allGraded ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-80'}`}
                    onClick={handleSubmitGrading}
                >
                    Submit Grade
                </button>
            </div>
        </div>
    )
}