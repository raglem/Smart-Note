"use client"

import { useState } from "react"
import ClassHeader from "../../../../components/Class/ClassHeader"
import Section from "../../../../components/Class/Section"
import { ClassType } from "../../../../types/Sections"
export default function ClassClientShell({ classInfo }:{
    classInfo: ClassType
}){
    const [editMode, setEditMode] = useState<boolean>(false)
    return (
        <div className="flex flex-col p-4 gap-y-4 w-full">
            <ClassHeader 
                classInfo={{
                    name: classInfo.name,
                    course_number: classInfo.course_number,
                    join_code: classInfo.join_code
                }} 
                editMode={editMode}
                setEditMode={setEditMode}
            />
            <div className="flex flex-col gap-y-4">
                {
                    classInfo.units.map((unit) => (
                        <Section key={unit.id} section={unit} editMode={editMode} />
                    ))
                }
            </div>
        </div>
    )
}