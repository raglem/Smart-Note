"use client"

import { useContext, useEffect } from "react"

import AddUnit from "@/components/Class/AddUnit"
import ClassHeader from "@/components/Class/ClassHeader"
import { ClassContext } from "@/app/context/ClassContext"
import Section from "@/components/Class/Section"
import { ClassDetailType } from "@/types/Sections"

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableItem from "@/components/SortableItem"
import FilePreview from "@/components/File/FilePreview"
import FileAdd from "@/components/File/FileAdd"

export default function ClassClientShell({ classInfo }:{
    classInfo: ClassDetailType
}){
    // Use context
    const { 
        setClassFields, 
        addMode, setAddMode, 
        editMode, 
        units, setUnits, 
        setDraggingUnit 
    } = useContext(ClassContext)

    // Set the context of the units when the page is first rendered
    useEffect(() => {
        setClassFields({
            id: classInfo.id,
            name: classInfo.name,
            course_number: classInfo?.course_number,
            join_code: classInfo.join_code,
            owner: classInfo.owner,
            members: classInfo.members,
            files: classInfo.files,
        })
        setUnits(classInfo.units.sort((a, b) => a.order - b.order))
    }, [classInfo, setClassFields, setUnits])

    // Update context a unit is being dragged
    const handleDragStart = () => {
        setDraggingUnit(true)
    }

    // Reorder units and update context 
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = units.findIndex((unit) => unit.id === active.id);
        const newIndex = units.findIndex((unit) => unit.id === over.id);

        setUnits(arrayMove(units, oldIndex, newIndex));
        setDraggingUnit(false)
    }

    return (
        <>
            <div className="flex flex-col p-4 gap-y-4 w-full">
                <ClassHeader classInfo={classInfo} />
                <div className="flex flex-col gap-y-4">
                    <DndContext collisionDetection={closestCenter} onDragStart={() => handleDragStart()} onDragEnd={handleDragEnd}>
                        <SortableContext items={units} strategy={verticalListSortingStrategy}>
                            {
                                units.map(unit => (
                                    <SortableItem id={unit.id} key={unit.id}>
                                        {({ listeners, attributes, setNodeRef, style }) => 
                                        <div ref={setNodeRef} style={style}>
                                            <Section sectionId={unit.id} sectionType="Unit" {...listeners} {...attributes} />
                                        </div>
                                        }
                                    </SortableItem>
                                ))
                            }
                        </SortableContext>
                    </DndContext>
                </div>
                <div className="flex flex-col w-full gap-y-4">
                    <div className="p-2 text-xl w-full bg-primary text-white rounded-md">
                        <h2>Class Files</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {classInfo.files.map(f => (
                            <FilePreview file={f} key={f.id}></FilePreview>
                        ))}
                        {!editMode && <FileAdd section_id={classInfo.id} section="Class" />}
                    </div>
                </div>
            </div>
            { addMode && <AddUnit class_id={classInfo.id} close={() => setAddMode(false)}/> }
        </>
    )
}