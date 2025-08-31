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
        <div className="card rounded-md">
            <header className="flex flex-row justify-between items-end bg-primary text-white px-2 py-5">
                <h2 className="text-3xl hover:underline">{quiz.name}</h2>
                <div className="flex flex-row items-center gap-x-2">
                    { member && member.id === quiz.owner.id && <Link href="/quizzes/update/">
                        <FaPencilAlt className="icon-responsive text-white"/>
                    </Link>}
                    <span className="text-xl whitespace-nowrap">{quiz.total_questions} Qs</span>
                </div>
            </header>
            <Link href={`/quizzes/${quiz.id}`}>
                <img src={quiz.image} className="object-cover w-full h-50px cursor-pointer"/>
            </Link>
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
    )
}