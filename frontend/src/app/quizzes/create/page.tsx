"use client"

import { useState } from "react";
import { ClassType, UnitSimpleType, SubunitSimpleType } from "@/types/Sections";
import UploadImage from "@/components/Quiz/UploadImage";
import SelectClass from "@/components/Quiz/SelectClass";
import SelectUnitsSubunits from "@/components/Quiz/SelectUnitsSubunits";
import CannotSelectUnitsSubunits from "@/components/Quiz/CannotSelectUnitsSubunits";
import { toast } from "react-toastify";
import api from "@/utils/api";
import checkForValidCharacters from "@/utils/checkForValidCharacters";
import { useRouter } from "next/navigation";

export default function CreatePage(){
    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
    const [selectedUnits, setSelectedUnits] = useState<UnitSimpleType []>([]);
    const [selectedSubunits, setSelectedSubunits] = useState<SubunitSimpleType []>([]);
    const router = useRouter();

    async function handleQuizCreate(){
        if(name.trim().length < 3 || !checkForValidCharacters(name)){
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

        try{
            const res = await api.post('/quizzes/', fd, {
                headers: { 'Content-Type': 'multipart/form-data'}
            })
            console.log(res.data)
            toast.success("Quiz created successfully")
            // router.push('/quizzes')
        }
        catch(err){
            console.error(err)
            toast.error("An error occurred while creating your quiz")
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
                <div className="flex flex-col w-full gap-y-2">
                    <div>
                        <label htmlFor="quiz-name">Classes</label>
                        <SelectClass selected={selectedClass} setSelected={setSelectedClass}/>
                    </div>
                    {selectedClass ? <SelectUnitsSubunits 
                        selectedUnits={selectedUnits} setSelectedUnits={setSelectedUnits}
                        selectedSubunits={selectedSubunits} setSelectedSubunits={setSelectedSubunits}
                        classId = {selectedClass.id}
                    /> : <CannotSelectUnitsSubunits />}
                </div>
            </div>
            <div className="flex flex-row justify-end items-center">
                <button className="p-2 rounded-md bg-primary text-2xl text-white cursor-pointer" onClick={handleQuizCreate}>
                    Create Quiz
                </button>
            </div>
        </div>
    )
}