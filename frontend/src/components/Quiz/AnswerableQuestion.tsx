"use client"

import { ChoiceType, MultipleChoiceQuestionType } from "@/types/Quizzes";
import { useEffect, useState } from "react";

export default function AnswerableQuestion({ question, verifyAnswer }: {
    question: MultipleChoiceQuestionType
    verifyAnswer: (questionId: number, result: "Correct" | "Incorrect") => void 
}){
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
    const [shuffledChoices, setShuffledChoices] = useState<ChoiceType[]>([...question.alternate_choices, { id: 0, choice_text: question.correct_answer}])

    useEffect(() => {
        if(selectedChoice !== null) {
            const isCorrect = selectedChoice === 0;
            verifyAnswer(question.id, isCorrect ? "Correct" : "Incorrect");
        }
    }, [selectedChoice])

    // Shuffle choices on component mount to avoid hydration error
    useEffect(() => {
        function shuffleChoices(array: ChoiceType[]): ChoiceType[] {
            const copy = [...array];
            let currentIndex = copy.length;
        
            while (currentIndex !== 0) {
              const randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex--;
        
              const tmp = copy[currentIndex];
              copy[currentIndex] = copy[randomIndex];
              copy[randomIndex] = tmp;
            }
        
            return copy;
          }
        
          setShuffledChoices(
            shuffleChoices([
              ...question.alternate_choices,
              { id: 0, choice_text: question.correct_answer },
            ])
          );
    }, [question])

    const getLetterChoice = (i: number) => {
        if(i === 0) return 'A'
        if(i === 1) return 'B'
        if(i === 2) return 'C'
        if(i === 3) return 'D'
        return 'E. '
    }

    return (
        <div className="flex flex-row gap-x-2 border-b-1 border-b-primary py-4">
            <h2 className="text-2xl">{`${question.order})`}</h2>
            <div className="flex flex-col gap-y-2 w-full">
                <h2 className="text-2xl">{question.question_text}</h2>
                <div className="flex flex-col gap-y-1 w-full">
                    {shuffledChoices.map((choice, i) => (
                        <label key={choice.id} className={`flex flex-row items-center gap-x-2 w-full py-4 px-2 ${choice.id === selectedChoice ? 'border-1 border-primary' : ''}`}>
                            <input 
                                type="radio" name={`question-${question.id}`} 
                                value={choice.choice_text} className="accent-primary appearance-none"
                                onChange={() => setSelectedChoice(choice.id)}
                            />
                            <span className={`py-1 px-2 aspect-square rounded-full font-bold ${choice.id === selectedChoice ? 'text-white bg-primary' : 'text-black border-1 border-primary'} cursor-pointer hover:opacity-80`}>{getLetterChoice(i)}</span>
                            <span>{choice.choice_text}</span>
                        </label>
                    ))}
                </div>
            </div>
            
        </div>
    )
}