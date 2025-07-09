"use client"

import { useState } from "react"

import AddUnit from "@/app/components/Class/AddUnit"
import ClassHeader from "../../components/Class/ClassHeader"
import { ClassContext, ClassContextType } from "@/app/context/ClassContext"
import Section from "../../components/Class/Section"
import { ClassType, UnitType } from "../../../../types/Sections"

import { closestCenter, DndContext, DragAbortEvent, DragCancelEvent, DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableItem from "@/app/components/SortableItem"
import { listeners } from "process"

export default function ClassClientShell({ classInfo }:{
    classInfo: ClassType
}){
    const [addMode, setAddMode] = useState<boolean>(false)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [units, setUnits] = useState<UnitType[]>(classInfo.units)
    const [draggingUnit, setDraggingUnit] = useState<boolean>(false)
    const [draggingSubunit, setDraggingSubunit] = useState<boolean>(false)
        
    const value: ClassContextType = {
        addMode,
        setAddMode,
        editMode,
        setEditMode,
        units,
        setUnits,
        draggingUnit,
        setDraggingUnit,
        draggingSubunit,
        setDraggingSubunit
    }

    // Update context a unit is being dragged
    const handleDragStart = (event: DragStartEvent) => {
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
        <ClassContext.Provider value={value}>
            <div className="flex flex-col p-4 gap-y-4 w-full">
                <ClassHeader classInfo={classInfo} />
                <div className="flex flex-col gap-y-4">
                    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <SortableContext items={units} strategy={verticalListSortingStrategy}>
                            {
                                units.map(unit => (
                                    <SortableItem id={unit.id} key={unit.id}>
                                        {({ listeners, attributes, setNodeRef, style }) => 
                                        <div ref={setNodeRef} style={style}>
                                            <Section section={unit} {...listeners} {...attributes} />
                                        </div>
                                        }
                                    </SortableItem>
                                ))
                            }
                        </SortableContext>
                    </DndContext>
                </div>
                { addMode && <AddUnit unit_id={classInfo.id} close={() => setAddMode(false)}/> }
            </div>
        </ClassContext.Provider>
    )
}