import { FRQAnswerResultType } from "@/types/Quizzes";
import FRQRubricGrade from "./FRQRubricGrade";
import { useState } from "react";
import { IoIosCheckmark, IoMdClose } from "react-icons/io";

type GradedRubricType = {
    rubric_id: number,
    points_awarded: number,
    total_possible_points: number,
    criteria: string
}
export default function FRQAnswerResult({ answer, status, setStatus }: { 
    answer: FRQAnswerResultType ,
    status: "Pending" | "Graded",
    setStatus: (newStatus: "Pending" | "Graded") => void
}){
    const rubrics = answer.question.rubrics
    const [gradedRubrics, setGradedRubrics] = useState<GradedRubricType[]>((() => {
        return rubrics.map((rubric) => ({
            rubric_id: rubric.id,
            points_awarded: 0,
            total_possible_points: rubric.possible_points,
            criteria: rubric.reasoning_text
        }))
    }))
    const totalScoreOfRubrics = gradedRubrics.reduce((acc, currentRubric) => {
        return acc + currentRubric.points_awarded
    }, 0)
    const gradeRubric = (rubricId: number, pointsAwarded: number) => {
        setGradedRubrics(prevGradedRubrics =>
            prevGradedRubrics.map(rubric =>
              rubric.rubric_id === rubricId
                ? { ...rubric, points_awarded: pointsAwarded || 0 }
                : rubric
            )
          )
    }
    return (
        <div className="flex flex-col w-full gap-y-2 border-b-1 border-b-primary last-of-type:border-b-0">
            <header className="flex flex-row gap-x-2">
                <h2 className="text-2xl">{`Q${answer.order})`}</h2>
                <h2 className="text-2xl">{answer.question.question_text}</h2>
            </header>
            <div className="flex flex-col w-full gap-y-1">
                <label>Your Answer</label>
                <div className="p-2 border-1 border-primary text-md">
                    { answer.user_answer }
                </div>
            </div>
            <div className="flex flex-col w-full gap-y-1">
                <label>Rubric</label>
                <div className="flex flex-col w-full gap-y-4 p-2 border-1 border-primary">
                    <div className="flex flex-col gap-y-2">
                        { gradedRubrics.map(gradedRubric => (
                            <FRQRubricGrade 
                                awardedPoints={gradedRubric.points_awarded} 
                                setAwardedPoints = {(newPointsAwarded: number) => gradeRubric(gradedRubric.rubric_id, newPointsAwarded)}
                                totalPossiblePoints = {gradedRubric.total_possible_points}
                                criteria = {gradedRubric.criteria} status={status}
                                key={gradedRubric.rubric_id} 
                            />
                        ))}
                    </div>
                    <div className="flex flex-row w-full justify-between items-center py-2 gap-x-4">
                        { status === 'Pending' && 
                            <button 
                                className="flex flex-row items-center gap-x-2 p-2 w-fit border-1 border-primary rounded-md cursor-pointer hover:opacity-80"
                                onClick={() => setStatus("Graded")}
                            >
                                Mark Graded
                                <IoIosCheckmark className="text-3xl"/>
                        </button>}
                        { status === 'Graded' && 
                            <button 
                                className="flex flex-row items-center gap-x-2 p-2 w-fit bg-primary text-white rounded-md cursor-pointer hover:opacity-80" 
                                onClick={() => setStatus("Pending")}
                            >
                                Graded 
                                <IoMdClose className="text-3xl"/>
                        </button>}
                        <h2 className="text-2xl">
                            Total: {totalScoreOfRubrics} / {answer.question.total_possible_points}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}