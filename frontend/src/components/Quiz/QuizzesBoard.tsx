"use client"

import { useEffect, useState } from "react";
import { QuizResultSimpleType, QuizType } from "@/types/Quizzes";
import QuizCard from "./QuizCard";
import QuizResultCard from "./QuizResultCard";

type ClassType = {
    id: number,
    name: string,
    image: string
    quizzes: QuizType[]
}

export default function QuizzesBoard({quizzes, results}: {quizzes: QuizType[], results: QuizResultSimpleType[]}){
    const [display, setDisplay] = useState<'quizzes' | 'results'>('quizzes')
    const [classGroupedQuizzes, setClassGroupedQuizzes] = useState<ClassType[]>([])
    const [sortedResults, setSortedResults] = useState<QuizResultSimpleType[]>([])
    useEffect(() => {
        const tmp: ClassType[] = []
        quizzes.forEach(quiz => {
            const matchingClass = tmp.find(c => c.id === quiz.related_class.id )
            if(!matchingClass){
                tmp.push({
                    id: quiz.related_class.id,
                    name: quiz.related_class.name,
                    image: quiz.related_class.image,
                    quizzes: [quiz]
                })
            }
            else{
                matchingClass.quizzes.push(quiz)
            }
        })
        tmp.sort((a, b) => a.name.localeCompare(b.name))
        setClassGroupedQuizzes(tmp)
    }, [quizzes])
    useEffect(() => {
        setSortedResults(results.sort((a, b) => a.date < b.date ? 1 : -1))
    }, results)
    return (
        <div className="flex flex-col items-center w-full gap-y-8">
            <header className="flex flex-row justify-between items-center w-full">
                <h1 className="text-5xl">Quizzes</h1>
                <div className="flex flex-row items-center w-fit bg-white rounded-md border-1 border-primary">
                    <button 
                        className={`p-2 ${display==='quizzes' ? 'bg-primary text-white' : 'text-black'} cursor-pointer hover:opacity-80`} 
                        onClick={() => setDisplay('quizzes')}
                    >
                        Quizzes
                    </button>
                    <button 
                        className={`p-2 ${display==='results' ? 'bg-primary text-white' : 'text-black'} cursor-pointer hover:opacity-80`} 
                        onClick={() => setDisplay('results')}
                    >
                        Results
                    </button>
                </div>
            </header>
            {display==='quizzes' && <div className="flex flex-col w-full gap-y-4">
                {classGroupedQuizzes.map(classItem => (
                    <div key={classItem.id} className="flex flex-col gap-y-2">
                        <h2 className="text-3xl underline">{classItem.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                            {classItem.quizzes.map((quiz: QuizType) => (
                                <QuizCard quiz={quiz} key={quiz.id} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>}
            {display==='results' && <div className="flex flex-col w-full items-left gap-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl">
                    {sortedResults.map((result: QuizResultSimpleType) => (
                        <QuizResultCard result={result} key={result.id} />
                    ))}
                </div>
            </div>}
        </div>
    )
}