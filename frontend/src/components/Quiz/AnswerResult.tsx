"use client"

import { MultipleChoiceQuestionType } from "@/types/Quizzes"
import { IoIosCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";

type AnswerResultType = {
    id: number,
    wrong_selected_choice: number | null,
    result: 'Correct' | 'Incorrect',
    order: number,
    question: MultipleChoiceQuestionType
}
export default function AnswerResult({answer}: {answer: AnswerResultType}) {
    const { related_units, related_subunits } = answer.question
    const sortedRelatedUnits = related_units.sort((a, b) => a.name.localeCompare(b.name))
    const sortedRelatedSubunits = related_subunits.sort((a, b) => a.name.localeCompare(b.name))
    return (
        <div className="flex flex-col gap-y-2 w-full py-2">
            <header className="flex flex-row justify-between gap-x-2">
                <h2 className="text-2xl">{`${answer.order}) `}{ answer.question.question_text }</h2>
                {answer.result === 'Correct' && <span className="text-xl">
                    <span className="text-primary">1 &nbsp;</span>
                    <span className="text-black">/ 1</span>
                </span>}
                {answer.result === 'Incorrect' && <span className="text-xl">
                    <span className="text-primary">0 &nbsp;</span>
                    <span className="text-black">/ 1</span>
                </span>}
            </header>
            <ol className="flex flex-col gap-y-2 w-full">
                <li className={`flex flex-row w-full p-2 justify-between items-center ${answer.result === 'Correct' ? 'border-1 border-primary': ''}`}>
                    { answer.question.correct_answer }
                    <IoIosCheckmarkCircle className="text-xl text-green-500" />
                </li>
                { answer.question.alternate_choices.map(choice => (
                    <li className={`flex flex-row justify-between w-full p-2 ${answer.wrong_selected_choice && answer.wrong_selected_choice === choice.id ? 'border-1 border-primary': 'border-b-1 border-b-black last-of-type:border-b-0'}`} key={choice.id}>
                        { choice.choice_text }
                        { answer.wrong_selected_choice && answer.wrong_selected_choice === choice.id && <IoMdCloseCircle className="text-xl text-red-500" /> }
                    </li>
                ))}
            </ol>
            <div className="flex flex-wrap gap-2 py-2">
                { sortedRelatedUnits.map(u => (
                    <div className="rounded-md bg-primary text-white py-1 px-4" key={u.id}>
                        {u.name}
                    </div>
                ))}
                { sortedRelatedSubunits.map(s => (
                    <div className="rounded-md bg-white text-black border-1 border-primary py-1 px-4" key={s.id}>
                        {s.name}
                    </div>
                ))}
            </div>
        </div>
    )
}