"use client"

import { useEffect, useState } from "react";
import { QuizResultSimpleType, QuizSimpleType, QuizType } from "@/types/Quizzes";
import QuizCard from "./QuizCard";
import QuizResultCard from "./QuizResultCard";
import { IoMdAddCircle } from "react-icons/io";
import Link from "next/link";
import { AiOutlineFileDone } from "react-icons/ai";
import Empty from "../Empty";
import LoadingSpinner from "../LoadingSpinner";

type ClassType = {
    id: number,
    name: string,
    image: string
    quizzes: QuizSimpleType[]
}

export default function QuizzesBoard({quizzes, results}: {quizzes: QuizSimpleType[], results: QuizResultSimpleType[]}){
    const [display, setDisplay] = useState<'quizzes' | 'results'>('quizzes')
    const [classGroupedQuizzes, setClassGroupedQuizzes] = useState<ClassType[]>([])
    const [sortedResults, setSortedResults] = useState<QuizResultSimpleType[]>([])
    const pendingResults = sortedResults.filter(result => result.status === 'Pending')
    const gradedResults = sortedResults.filter(result => result.status === 'Graded')
    const [loadingQuizzes, setLoadingQuizzes] = useState<boolean>(true)

    // Update loading state 
    useEffect(() => {
        setLoadingQuizzes(false)
    }, [])

    // On initial render, group quizzes into their respective classes
    useEffect(() => {
        const groupedQuizzes: ClassType[] = []
        quizzes.forEach(quiz => {
            const matchingClass = groupedQuizzes.find(c => c.id === quiz.related_class.id )
            if(!matchingClass){
                groupedQuizzes.push({
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
        groupedQuizzes.sort((a, b) => a.name.localeCompare(b.name))
        setClassGroupedQuizzes(groupedQuizzes)
    }, [quizzes])

    // On initial render, sort results by date
    useEffect(() => {
        setSortedResults(results.sort((a, b) => a.date < b.date ? 1 : -1))
    }, [])

    return (
        <div className="flex flex-col items-center w-full gap-y-8">
            <header className="flex flex-col gap-y-2 md:flex-row justify-between items-center w-full">
                <div className="flex flex-col gap-y-2 items-center md:items-start">
                    <h1 className="text-center m-0 p-0">Quizzes</h1>
                    <Link href="/quizzes/create/">
                        <button className="flex flex-row justify-between items-center gap-x-2 rounded-md text-white bg-primary py-2 px-4 whitespace-nowrap hover:cursor-pointer">
                            <IoMdAddCircle />
                            Create Quiz
                        </button>
                    </Link>
                </div>
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
            {loadingQuizzes && <div className="flex h-[calc(100vh-300px)] justify-center items-center">
                <LoadingSpinner />
            </div>}
            {!loadingQuizzes && ( <>
                {display === 'quizzes' && classGroupedQuizzes.length > 0 && (
                    <div className="flex flex-col w-full gap-y-4">
                        {classGroupedQuizzes.map(classItem => (
                        <div key={classItem.id} className="flex flex-col gap-y-2">
                            <h2 className="text-3xl underline">{classItem.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                            {classItem.quizzes.map(quiz => (
                                <QuizCard quiz={quiz} key={quiz.id} />
                            ))}
                            </div>
                        </div>
                        ))}
                    </div>
                )}

                {display === 'quizzes' && classGroupedQuizzes.length === 0 && (
                    <div className="flex flex-col min-h-[calc(100vh-400px)] w-full justify-center items-center gap-y-2">
                        <Empty message={"No available quizzes."} />
                        <Link href='/quizzes/create/'>
                        <p className="text-primary text-lg hover:underline">
                            Create a quiz yourself to get started
                        </p>
                        </Link>
                    </div>
                )}

                {display === 'results' && sortedResults.length > 0 && (
                    <div className="flex flex-col w-full items-left">
                        <div className="flex flex-col gap-y-8">
                            <div className="flex flex-col gap-y-2">
                                <h2 className="text-3xl underline">Pending Results (Requires Self-Grading)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 w-full">
                                    {pendingResults.map(pendingResult => (
                                    <QuizResultCard result={pendingResult} key={pendingResult.id} />
                                    ))}
                                </div>
                                {pendingResults.length === 0 && (
                                    <div className="flex flex-row gap-x-2 items-center border-1 border-primary rounded-md p-2">
                                    <AiOutlineFileDone className="text-5xl text-primary"/>
                                    <h2 className="text-2xl"> You're all caught up. No quizzes require grading </h2>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <h2 className="text-3xl underline">Graded Results</h2>
                                {gradedResults.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                                    {gradedResults.map(gradedResult => (
                                        <QuizResultCard result={gradedResult} key={gradedResult.id} />
                                    ))}
                                </div>}
                                {gradedResults.length == 0 && <div className="flex justify-center items-center py-4 md:py-8">
                                    <Empty message={"No quiz results to show"} />
                                </div>}
                            </div>
                        </div>
                    </div>
                )}

                {display === 'results' && sortedResults.length === 0 && (
                    <div className="flex flex-col min-h-[calc(100vh-400px)] w-full justify-center items-center">
                        <Empty message={"No quiz results to show"} />
                    </div>
                )}
            </>)}

        </div>
    )
}