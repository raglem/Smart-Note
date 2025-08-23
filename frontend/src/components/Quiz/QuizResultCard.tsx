"use client"
import { QuizResultSimpleType } from "@/types/Quizzes"
import Link from "next/link";
import { IoIosCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";

export default function QuizResultCard({ result }: {
    result: QuizResultSimpleType
}){
    const score = Math.round(result.number_of_correct_answers/ result.number_of_questions * 10000) / 100; // Round to 2 decimal places
    return (
        <div className="card rounded-md">
            <header className="flex flex-row justify-between items-end bg-primary text-white px-2 py-5">
                <div className="flex flex-row gap-x-2">
                        { score > 70 ? <IoIosCheckmarkCircle className="text-3xl text-green-500" /> : <IoMdCloseCircle className="text-3xl text-red-500" /> }
                        <h2 className="text-2xl">{result.quiz.name}</h2>
                    </div>
                <span className="text-2xl">{score}%</span>
            </header>
            <Link href={`/quizzes/results/${result.id}`}>
                <img src={result.quiz.image} className="object-cover w-full h-50px cursor-pointer"/>
            </Link>
            <div className="flex flex-col px-2 py-2 gap-y-2">
                <div className="flex flex-row justify-between items-center text-md text-gray-600">
                    <span>{ new Date(result.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }</span>
                    <span>Score: { result.number_of_correct_answers }/{ result.number_of_questions }</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {result.quiz.related_units.map(unit => (
                        <div key={unit.id} className="rounded-md bg-primary text-md text-white py-1 px-4">
                            {unit.name}
                        </div>
                    ))}
                    {result.quiz.related_subunits.map(subunit => (
                        <div key={subunit.id} className="rounded-md border-1 border-primary text-md text-primary py-1 px-4">
                            {subunit.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}