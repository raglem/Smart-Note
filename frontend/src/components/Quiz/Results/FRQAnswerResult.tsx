import { FRQAnswerResultType } from "@/types/Quizzes";

export default function FRQAnswerResult({ answer }: { answer: FRQAnswerResultType }){
    return (
        <div className="flex flex-col gap-y-2 w-full py-2">
            <header className="flex flex-row justify-between gap-x-2">
                <h2 className="text-2xl">Q{answer.question.order}: { answer.question.question_text }</h2>
                <span className="text-xl">
                    <span className="text-primary">{ answer.points_awarded }</span>
                    <span className="text-black">/{ answer.total_possible_points }</span>
                </span>
            </header>
            <div className="flex flex-col w-full gap-y-1">
                <label>Your Answer</label>
                <div className="p-2 border-1 border-primary text-md">
                    { answer.user_answer }
                </div>
            </div>
            <div className="flex flex-col w-full gap-y-1">
                <label>Sample Answer</label>
                <div className="p-2 border-1 border-primary text-md">
                    { answer.question.correct_answer }
                </div>
            </div>
            <div className="flex flex-col w-full gap-y-1">
                <label>Rubric</label>
                <div className="flex flex-col gap-y-1 border-1 border-primary p-2">
                    { answer.graded_rubrics.map(graded_rubric => (
                        <div className="flex flex-row items-center w-full gap-x-4 text-xl" key={graded_rubric.id}>
                            <div className="flex flex-row items-center">
                                <span className="text-primary">
                                    {graded_rubric.points_awarded}
                                </span>
                                <span className="text-black">
                                    /{graded_rubric.possible_points}
                                </span>
                            </div>
                            <p className="text-md">
                                Criteria: {answer.question.correct_answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}