"use client"
import { useContext, useEffect, useState } from "react"
import { MultipleChoiceQuestionType } from "@/types/Quizzes"
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { IoIosAdd, IoIosCheckmarkCircle } from "react-icons/io";
import RelatedUnitSubunitsContext from "@/app/context/RelatedUnitsSubunitsContext";
import { SubunitSimpleType, UnitSimpleType } from "@/types/Sections";

export default function MultipleChoiceQuestion({question, setQuestion}:{
    question: MultipleChoiceQuestionType
    setQuestion: (question: MultipleChoiceQuestionType) => void,
}){
    const [questionText, setQuestionText] = useState<string>(question.question_text)
    const [correctAnswer, setCorrectAnswer] = useState<string>(question.correct_answer)
    const [alternateChoices, setAlternateChoices] = useState<string[]>(question.alternate_choices.map(choice => choice.choice_text))

    const { units: unitsPool, subunits: subunitsPool } = useContext(RelatedUnitSubunitsContext)
    const [questionRelatedUnits, setQuestionRelatedUnits] = useState<UnitSimpleType[]>(question.related_units)
    const [questionRelatedSubunits, setQuestionRelatedSubunits] = useState<SubunitSimpleType[]>(question.related_subunits)
    const availableUnits = unitsPool.filter(unit => !questionRelatedUnits.find(u => u.id === unit.id)).sort((a, b) => a.name.localeCompare(b.name))
    const availableSubunits = subunitsPool.filter(subunit => !questionRelatedSubunits.find(s => s.id === subunit.id)).sort((a, b) => a.name.localeCompare(b.name))

    // Go to next input on enter
    useEffect(() => {
        const handleEnterKey = (e: KeyboardEvent) => {
            if (e.key !== 'Enter') return;
        
            const target = e.target as HTMLElement;
        
            if (target.id === 'correct-answer') {
                const firstAlt = document.getElementById('alternate-choice-0');
                firstAlt?.focus();
            }
        
            if (target.id.startsWith('alternate-choice-')) {
                const index = parseInt(target.id.split('-')[2]);
        
                if (index === alternateChoices.length - 1) {
                    setAlternateChoices(prev => {
                        const updated = [...prev, ""];
                        setTimeout(() => {
                            const newInput = document.getElementById(`alternate-choice-${index + 1}`);
                            newInput?.focus();
                        }, 0);
                        return updated;
                    });
                } else {
                    const nextInput = document.getElementById(`alternate-choice-${index + 1}`);
                    nextInput?.focus();
                }
            }
        };
        document.addEventListener('keydown', handleEnterKey)
        return () => document.removeEventListener('keydown', handleEnterKey)
    }, [alternateChoices, question, setQuestion])

    // Update parent component when question changes
    useEffect(() => {
        setQuestion({
            ...question,
            question_text: questionText,
            correct_answer: correctAnswer,
            alternate_choices: alternateChoices.map((choice, i) => ({
                id: question.alternate_choices[i]?.id,
                choice_text: choice
            }))
        })
    }, [question, setQuestion, questionText, correctAnswer, alternateChoices])
    useEffect(() => {
        setQuestion({
            ...question,
            related_units: questionRelatedUnits,
            related_subunits: questionRelatedSubunits
        })
    }, [question, setQuestion, questionRelatedUnits, questionRelatedSubunits])

    return (
        <div className="flex flex-col w-full gap-y-3">
            <div className="flex flex-col w-full">
                <label htmlFor="question-text">Question</label>
                <textarea 
                    id="question-text" value={questionText} 
                    className="flex flex-1 h-xl p-1 text-xl min-w-2 border-1 border-primary outline-none"
                    onChange={e => setQuestionText(e.target.value)}
                />
            </div>
            <div className="flex flex-col w-full gap-y-2">
                <div className="flex flex-wrap gap-2">
                    {questionRelatedUnits.map(unit => (
                        <div className="flex flex-row items-center p-2 bg-primary text-white rounded-md" key={unit.id}>
                            {unit.name}
                            <CiCircleMinus className="inline text-xl ml-2 cursor-pointer" onClick={() => {
                                setQuestionRelatedUnits(prev => prev.filter(u => u.id !== unit.id))
                            }}/>
                        </div>
                    ))}
                    {questionRelatedSubunits.map(subunit => (
                        <div className="flex flex-row items-center p-2 bg-primary text-white rounded-md" key={subunit.id}>
                            {subunit.name}
                            <CiCircleMinus className="inline text-xl ml-2 cursor-pointer" onClick={() => {
                                setQuestionRelatedSubunits(prev => prev.filter(s => s.id !== subunit.id))
                            }}/>
                        </div>
                    ))}
                    {availableUnits.map(unit => (
                        <div className="flex flex-row items-center p-2 bg-white text-primary border-1 border-primary rounded-md" key={unit.id}>
                            {unit.name}
                            <CiCirclePlus className="inline text-xl ml-2 cursor-pointer" onClick={() => {
                                setQuestionRelatedUnits(prev => [...prev, unit].sort((a,b) => a.name.localeCompare(b.name)))
                            }}/>
                        </div>
                    ))}
                    {availableSubunits.map(subunit => (
                        <div className="flex flex-row items-center p-2 bg-white text-primary border-1 border-primary rounded-md" key={subunit.id}>
                            {subunit.name}
                            <CiCirclePlus className="inline text-xl ml-2 cursor-pointer" onClick={() => {
                                setQuestionRelatedSubunits(prev => [...prev, subunit].sort((a,b) => a.name.localeCompare(b.name)))
                            }}/>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-full">
                <label htmlFor="correct-answer">Correct Answer</label>
                <div className="flex flex-row items-center w-full gap-x-2 text-black border-1 border-primary p-1">
                    <input 
                        type="text" id="correct-answer" 
                        className="flex flex-grow outline-none text-xl" 
                        value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)}
                    />
                    <IoIosCheckmarkCircle className="text-3xl text-green-500" />
                </div>
            </div>
            <div className="flex flex-col w-full">
                <label>Alternate Choices</label>
                <div className="flex flex-col w-full gap-y-1">
                    {alternateChoices.map((choice, i) => (
                        <div className="flex flex-row items-center w-full gap-x-2 text-black border-1 border-primary p-1" key={i}>
                            <input id={`alternate-choice-${i}`} className="flex flex-1 text-xl outline-none" value={choice} onChange={(e) => {
                                const newChoices = [...alternateChoices]
                                newChoices[i] = e.target.value
                                setAlternateChoices(newChoices)
                            }}/>
                            <div className="flex flex-row items-center gap-x-0 text-2xl">
                                { i === alternateChoices.length -1 && 
                                    <IoIosAdd 
                                        className="text-3xl text-black icon-responsive" 
                                        onClick={() => { setAlternateChoices(prev => [...prev, ""])}}
                                    /> 
                                }
                                <CiCircleMinus className="text-3xl text-black icon-responsive" onClick={() => {
                                    setAlternateChoices(prev => prev.filter((_, index) => index !== i))
                                }}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}