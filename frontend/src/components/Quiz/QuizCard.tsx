"use client"

import useMemberStore from "@/stores/memberStore";
import { QuizSimpleType, QuizType } from "@/types/Quizzes";
import Link from "next/link";
import { useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";

export default function QuizCard({ quiz }: { quiz: QuizSimpleType }){
    const member = useMemberStore(state => state.member)
    const fetchMember = useMemberStore(state => state.fetchMember)
    useEffect(() => {fetchMember()}, [])
    return (
        <div className="card rounded-md flex flex-col">
            <header className="flex flex-row justify-between items-end bg-primary text-white px-2 py-5">
                <Link href={`/quizzes/${quiz.id}`}>
                    <h2 className="text-3xl hover:underline"> {quiz.name} </h2>
                </Link>
                <span className="text-xl whitespace-nowrap">{quiz.total_questions} Qs</span>
            </header>
            <Link href={`/quizzes/${quiz.id}`}>
                <img src={quiz.image} className="object-cover w-full h-50px cursor-pointer hover:opacity-80"/>
            </Link>
            <div className="flex flex-col justify-center h-full">
                <div className="px-2 py-5 flex flex-wrap gap-2">
                    {quiz.related_units.map(unit => (
                        <div key={unit.id} className="rounded-md bg-primary text-md text-white py-1 px-4">
                            {unit.name}
                        </div>
                    ))}
                    {quiz.related_subunits.map(subunit => (
                        <div key={subunit.id} className="rounded-md border-1 border-primary text-md text-primary py-1 px-4">
                            {subunit.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}