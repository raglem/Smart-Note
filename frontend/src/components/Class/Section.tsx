"use client"

import { useContext, useMemo, useState } from "react";
import { isSubunitType, isUnitType, SectionType, UnitType } from "../../types/Sections"
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

import FilePreview from "../File/FilePreview";
import RemoveFile from "../File/RemoveFile";
import { GiHamburgerMenu } from "react-icons/gi";
import FileAdd from "../File/FileAdd";

import { closestCenter, DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../SortableItem";
import { ClassContext } from "@/app/context/ClassContext";

export default function Section({ section, ...dragProps }: { 
    section: SectionType, 
    // Accept attributes and listeners from SortableItem
    [key: string]: any,
}) {
    // Gather context for editMode
    const { units, setUnits, editMode, draggingUnit, draggingSubunit, setDraggingSubunit } = useContext(ClassContext)

    // State for sub-sections
    const [openSubsection, setOpenSubsection] = useState<boolean>(false)
    const [subsections, setSubsections] = useState<SectionType[] | null>(isUnitType(section) ? section.subunits: null )

    // Determine section type
    const [sectionType, setSectionType] = useState<string | null>(isUnitType(section) ? "Unit" : isSubunitType(section) ? "Subunit" : null);

    // Determine whether to reveal subsection based on whether the user is opening the subsection and/or is currently dragging
    const showSubsection = (() => {
        if(sectionType === "Subunit"){
            if(draggingSubunit) return false
            return openSubsection
        }
        else{
            if(draggingUnit) return false
            return openSubsection
        }
    })

    const toggleSubsection = (id:string) => {
        setOpenSubsection(!openSubsection)
    }

    // Update context a subunit is being dragged
    const handleDragStart = (event: DragStartEvent) => {
        setDraggingSubunit(true)
    }

    // Reorder subunits and update context
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if(!over)   return
        if(!subsections)    return

        const oldIndex = subsections.findIndex((section) => section.id === active.id)
        const newIndex = subsections.findIndex((section) => section.id === over.id)

        const newSubunits = arrayMove(subsections, oldIndex, newIndex)
        setSubsections(newSubunits)
        setDraggingSubunit(false)

        // Update units context
        setUnits(units.map((unit: UnitType) => {
            if(unit.id !== section.id){
                return unit
            }
            // Add unit_id to subunits
            const editedSubunits = newSubunits.map((subunit: SectionType) => {
                return {
                    ...subunit,
                    unit_id: unit.id
                }
            })
            unit.subunits = editedSubunits
            return unit
        }))

        console.log(units)
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-row justify-between items-center gap-x-2">
                {<div>
                    {
                    openSubsection ? (
                        <FaCaretUp className="icon-responsive w-4" onClick={() => toggleSubsection(section.id)} />
                    ): (
                        <FaCaretDown className="icon-responsive w-4" onClick={() => toggleSubsection(section.id)} />
                    )
                    }
                    </div>
                }
                <div className={`flex w-full py-2 justify-between items-center border-b-1 border-b-primary text-${sectionType === "Unit" ? "2xl" : "xl"}`}>
                    <span>{ section.name }</span>
                    {editMode &&
                        <GiHamburgerMenu {...dragProps} className="icon-responsive w-4" />
                    }
                </div>
            </div>
            {showSubsection() && (
                <div className="relative flex flex-col gap-y-2 pl-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {section.note_category.notes.map((note) => (
                            <FilePreview file={ note.file } key={note.id}>
                                { editMode && <RemoveFile id={note.id}file={ note.file } /> }
                            </FilePreview>
                        ))}
                        {editMode && 
                            <FileAdd section_id={section.id} section={sectionType === "Unit" ? "Subunit" : "Unit"} />
                        }
                    </div>
                    {subsections && <div>
                        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragAbort={() => setDraggingSubunit(false)} onDragEnd={handleDragEnd}>
                            <SortableContext items={subsections} strategy={verticalListSortingStrategy}>
                                {subsections.map((subunit) => (
                                    <SortableItem id={subunit.id} key={subunit.id}>
                                    {({ setNodeRef, listeners, attributes, style }) => 
                                        <div ref={setNodeRef} style={style}>
                                            <Section section={subunit} {...listeners} {...attributes}/>
                                        </div>
                                    }
                                    </SortableItem>
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>}
                </div>
            )}
        </div> 
    )
}