"use client"

import { useContext, useEffect, useState } from "react"
import { FreeResponseQuestionRubric, FreeResponseQuestionType } from "@/types/Quizzes"
import RelatedUnitSubunitsContext from "@/app/context/RelatedUnitsSubunitsContext"
import { SubunitSimpleType, UnitSimpleType } from "@/types/Sections"
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci"

export default function FreeResponseQuestion({ question, setQuestion }: {
    question: FreeResponseQuestionType,
    setQuestion: (question: FreeResponseQuestionType) => void
}){
    // Define state variables pertaining to the current component
    const [questionText, setQuestionText] = useState<string>(question.question_text)
    const [correctAnswer, setCorrectAnswer] = useState<string>(question.correct_answer)
    const [rubrics, setRubrics] = useState<FreeResponseQuestionRubric[]>(question.rubrics)
    const totalPossiblePoints: number = (() => {
        let total: number = 0
        rubrics.forEach(rubric => total += rubric.possible_points)
        return total
    })()

    // State variables and handlers for related units and subunits
    const { units: unitsPool, subunits: subunitsPool } = useContext(RelatedUnitSubunitsContext)
    const [questionRelatedUnits, setQuestionRelatedUnits] = useState<UnitSimpleType[]>(question.related_units)
    const [questionRelatedSubunits, setQuestionRelatedSubunits] = useState<SubunitSimpleType[]>(question.related_subunits)
    const availableUnits = unitsPool.filter(unit => !questionRelatedUnits.find(u => u.id === unit.id)).sort((a, b) => a.name.localeCompare(b.name))
    const availableSubunits = subunitsPool.filter(subunit => !questionRelatedSubunits.find(s => s.id === subunit.id)).sort((a, b) => a.name.localeCompare(b.name))

    // Update rubric state variables in current component
    const handleRubricChange = (id: number, field: 'reasoning_text' | 'possible_points', value: string | number) => {
        if(field === 'possible_points') {
            value = Math.max(0, Number(value))
        }
        setRubrics(prev => prev.map(rubric => rubric.id === id ? { ...rubric, [field]: value } : rubric))
    }
    const addRubricCategory = () => {
        setRubrics(prevRubrics => [...prevRubrics,  {
            id: -Math.abs(Math.min(...prevRubrics.map(rubric => rubric.id)))-1,
            reasoning_text: "",
            possible_points: 1,
            question: -1
        }])
    }

    // Update parent component state variable when a question field changes
    useEffect(() => {
        setQuestion({
            ...question,
            question_text: questionText,
            correct_answer: correctAnswer
        })
    }, [questionText, correctAnswer])

    useEffect(() => {
        setQuestion({
            ...question,
            rubrics: rubrics
        })
    }, [rubrics])

    useEffect(() => {
        setQuestion({
            ...question,
            related_units: questionRelatedUnits,
            related_subunits: questionRelatedSubunits
        })
    }, [questionRelatedUnits, questionRelatedSubunits])

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
            <div className="flex flex-col w-full">
                <label htmlFor="question-text">Sample Correct Answer</label>
                <textarea 
                    id="question-text" value={correctAnswer} rows={5}
                    className="flex flex-1 p-1 text-xl min-w-2 border-1 border-primary outline-none"
                    onChange={e => setCorrectAnswer(e.target.value)}
                />
            </div>
            <div className="flex flex-col w-full">
                <label htmlFor="rubric">{`Rubric (${totalPossiblePoints}pts)`}</label>
                <div id="rubric" className="flex flex-col border-1 border-primary">
                    { rubrics.map(rubric => (
                        <div className="flex flex-col gap-y-4 p-4" key={rubric.id}>
                            <div className="flex flex-row justify-between items-center gap-x-4">
                                <label htmlFor={`reasoning-text-${rubric.id}`} className="min-w-[80px]">Reasoning</label>
                                <textarea 
                                    id={`reasoning-text-${rubric.id}`} value={rubric.reasoning_text} 
                                    className="flex w-full h-[100px] p-1 text-xl min-w-2 border-1 border-primary outline-none"
                                    onChange={e => handleRubricChange(rubric.id, 'reasoning_text', e.target.value)}
                                />
                            </div>
                            <div className="flex flex-row items-center gap-x-4">
                                <label htmlFor={`possible-points-${rubric.id}`} className="min-w-[80px]">Points</label>
                                <input 
                                    id={`possible-points-${rubric.id}`} value={rubric.possible_points} type="number" min={0} 
                                    className="flex justify-end w-[80px] h-xl p-1 text-xl min-w-2 border-1 border-primary outline-none"
                                    onChange={e => handleRubricChange(rubric.id, 'possible_points', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-row items-center p-4">
                        <button className="text-md bg-primary text-white rounded-md p-2 cursor-pointer hover:opacity-80" onClick={addRubricCategory}>
                            Add Rubric Category
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}