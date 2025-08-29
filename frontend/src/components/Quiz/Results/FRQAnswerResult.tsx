import { FRQAnswerResultType } from "@/types/Quizzes";

export default function FRQAnswerResult({ answer }: { answer: FRQAnswerResultType }){
    return (
        // <div className="flex flex-col gap-y-2 w-full py-2">
        //     <header className="flex flex-row justify-between gap-x-2">
        //         <h2 className="text-2xl">{`${answer.order}) `}{ answer.question.question_text }</h2>
        //         {answer.result === 'Correct' && <span className="text-xl">
        //             <span className="text-primary">1</span>
        //             <span className="text-black">/1</span>
        //         </span>}
        //         {answer.result === 'Incorrect' && <span className="text-xl">
        //             <span className="text-primary">0</span>
        //             <span className="text-black">/1</span>
        //         </span>}
        //     </header>
        // </div>
        <div>
            Frq Answer
        </div>
    )
}