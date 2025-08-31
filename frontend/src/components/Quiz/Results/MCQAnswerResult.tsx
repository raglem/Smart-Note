"use client"

import { MCQAnswerResultType } from "@/types/Quizzes"
import { IoIosCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";

export default function MCQAnswerResult({answer}: {answer: MCQAnswerResultType}) {
    const { related_units, related_subunits } = answer.question
    const sortedRelatedUnits = related_units.sort((a, b) => a.name.localeCompare(b.name))
    const sortedRelatedSubunits = related_subunits.sort((a, b) => a.name.localeCompare(b.name))
    return (
        <div className="flex flex-col gap-y-2 w-full py-2">
            <header className="flex flex-row justify-between gap-x-2">
                <h2 className="text-2xl">Q{answer.question.order}: { answer.question.question_text }</h2>
                {answer.result === 'Correct' && <span className="text-xl">
                    <span className="text-primary">1</span>
                    <span className="text-black">/1</span>
                </span>}
                {answer.result === 'Incorrect' && <span className="text-xl">
                    <span className="text-primary">0</span>
                    <span className="text-black">/1</span>
                </span>}
            </header>
            <div>
                <label>Correct Answer</label>
                <li className={`flex flex-row w-full p-2 justify-between items-center rounded-md ${answer.result === 'Correct' ? 'border-1 border-primary': 'border-1 border-black'}`}>
                    { answer.question.correct_answer }
                    <IoIosCheckmarkCircle className="text-xl text-green-500" />
                </li>
            </div>
            <div>
                <label>Alternate Choices</label>
                <ol className="flex flex-col gap-y-2 w-full">
                { answer.question.alternate_choices.map(choice => (
                    <li className={`flex flex-row justify-between w-full p-2 rounded-md ${answer.wrong_selected_choice && answer.wrong_selected_choice === choice.id ? 'border-1 border-primary': 'border-1 border-black'}`} key={choice.id}>
                        { choice.choice_text }
                        { answer.wrong_selected_choice && answer.wrong_selected_choice === choice.id && <IoMdCloseCircle className="text-xl text-red-500" /> }
                    </li>
                ))}
            </ol>
            </div>
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