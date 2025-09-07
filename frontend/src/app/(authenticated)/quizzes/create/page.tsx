"use client"

import { useState, createContext } from "react";
import UploadImage from "@/components/Quiz/UploadImage";
import SelectClass from "@/components/Quiz/SelectClass";
import SelectUnitsSubunits from "@/components/Quiz/SelectUnitsSubunits";
import CannotSelectUnitsSubunits from "@/components/Quiz/CannotSelectUnitsSubunits";
import Questions from "@/components/Quiz/CreateQuiz/Questions";
import api from "@/utils/api";
import { toast } from "react-toastify";
import checkForValidCharacters from "@/utils/checkForValidCharacters";
import { ClassType, UnitSimpleType, SubunitSimpleType } from "@/types/Sections";
import { QuestionType } from "@/types/Quizzes";
import RelatedUnitSubunitsContext from "@/app/context/RelatedUnitsSubunitsContext";
import ValidateQuestions from "@/utils/validateQuestions";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CreatePage(){
    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
    const [selectedUnits, setSelectedUnits] = useState<UnitSimpleType []>([]);
    const [selectedSubunits, setSelectedSubunits] = useState<SubunitSimpleType []>([]);
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter()

    async function handleQuizCreate(){
        if(name.trim().length < 3){
            toast.error("Quiz name must be at least 3 characters long and contain only valid characters")
            return

        }
        if(!image){
            toast.error("Image upload is required")
            return
        }
        if(!selectedClass){
            toast.error("Class selection is reqquired")
            return
        }

        const questionValidation: { message: string, valid: boolean} = ValidateQuestions(questions)
        if(!questionValidation.valid){
            toast.error(questionValidation.message)
            return

        }

        // Format form data for quiz request
        const fd = new FormData()
        fd.append("name", name)
        fd.append("image", image)
        fd.append("related_class", selectedClass.id.toString())
        
        if(selectedUnits.length > 0){
            selectedUnits.forEach((unit) => {
                fd.append('related_units', unit.id.toString())
            })
        }

        if(selectedSubunits.length > 0){
            selectedSubunits.forEach((subunit) => {
                fd.append('related_subunits', subunit.id.toString())
            })
        }

        setLoading(true)
        try{
            const quizRes = await api.post('/quizzes/', fd, {
                headers: { 'Content-Type': 'multipart/form-data'}
            })

            // Format json data for questions request
            const orderedQuestions = questions.map((q, i) => ({ ...q, order: i+1}))
            const mcqQuestions = orderedQuestions.filter(q => q.question_category === "MultipleChoice").map((q, i) => ({
                ...q,
                id: undefined,
                related_units: q.related_units.map(u => u.id),
                related_subunits: q.related_subunits.map(s => s.id)
            }))
            const frqQuestions = orderedQuestions.filter(q => q.question_category === "FreeResponse").map((q, i) => ({
                ...q,
                id: undefined,
                related_units: q.related_units.map(u => u.id),
                related_subunits: q.related_subunits.map(s => s.id),
                rubrics: q.rubrics.map(r => ({
                    ...r, 
                    id: undefined,
                    question: undefined,
                }))
            }))
            const requestBody = {
                mcq_questions: {
                    quiz: quizRes.data.id,
                    questions: mcqQuestions
                },
                frq_questions: {
                    quiz: quizRes.data.id,
                    questions: frqQuestions
                },
            }

            const questionsRes = await api.post('/quizzes/questions/bulk-create/', requestBody)
            toast.success("Quiz created successfully")
            router.push('/quizzes')
        }
        catch(err){
            console.error(err)
            toast.error("An error occurred while creating your quiz")
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-full max-w-[1280px] gap-y-5">
            <h1 className="font-normal">Create Quiz</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-xl">
                <div className="flex flex-col w-full gap-y-2">
                    <div>
                        <label htmlFor="quiz-name">Quiz Name</label>
                        <input 
                            type="text" className="w-full border-1 border-primary outline-none p-2" 
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="quiz-name">Image</label>
                        <UploadImage image={image} setImage={setImage} />
                    </div>
                </div>
                <div className="flex flex-col w-full gap-y-4">
                    <div>
                        <label htmlFor="quiz-name">Class</label>
                        <SelectClass selected={selectedClass} setSelected={setSelectedClass}/>
                    </div>
                    {selectedClass ? <SelectUnitsSubunits 
                        selectedUnits={selectedUnits} setSelectedUnits={setSelectedUnits}
                        selectedSubunits={selectedSubunits} setSelectedSubunits={setSelectedSubunits}
                        classId = {selectedClass.id}
                    /> : <CannotSelectUnitsSubunits />}
                </div>
            </div>
            <RelatedUnitSubunitsContext.Provider value={{units: selectedUnits, subunits: selectedSubunits}}>
                <Questions questions={questions} setQuestions={setQuestions} />
            </RelatedUnitSubunitsContext.Provider>
            {loading && <div className="flex justify-center items-center w-full p-2">
                <LoadingSpinner />
            </div>}
            <div className="flex flex-row justify-end items-center">
                <button className="p-2 rounded-md bg-primary text-xl text-white cursor-pointer" onClick={handleQuizCreate}>
                    Create Quiz
                </button>
            </div>
        </div>
    )
}