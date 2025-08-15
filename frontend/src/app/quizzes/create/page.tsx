"use client"

import { useEffect, useState } from "react";
import useClassesStore from "@/stores/classesStore";
import useUnitsStore from "@/stores/unitsStore";
import { ClassType, UnitSimpleType, SubunitSimpleType } from "@/types/Sections";
import UploadImage from "@/components/Quiz/UploadImage";
import SelectClass from "@/components/Quiz/SelectClass";
import LoadingSpinner from "@/components/LoadingSpinner";
import SelectUnitsSubunits from "@/components/Quiz/SelectUnitsSubunits";
import CannotSelectUnitsSubunits from "@/components/Quiz/CannotSelectUnitsSubunits";

export default function CreatePage(){
    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
    const [selectedUnits, setSelectedUnits] = useState<UnitSimpleType []>([]);
    const [selectedSubunits, setSelectedSubunits] = useState<SubunitSimpleType []>([]);

    const units = useUnitsStore(state => state.units)
    const subunits = useUnitsStore(state => state.subunits)
    const fetchUnitsAndSubunits = useUnitsStore(state => state.fetchUnitsAndSubunits)
    const loadingUnitsSubunits = useUnitsStore(state => state.isLoading)
    useEffect(() => {
        if(!selectedClass)  return
        fetchUnitsAndSubunits(selectedClass.id)
    }, [selectedClass])

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
        </div>
    )
}