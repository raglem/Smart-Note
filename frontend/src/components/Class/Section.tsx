"use client"

import { useContext, useEffect, useMemo, useState } from "react";
import { isUnitType, SectionType, SubunitType, UnitType } from "../../types/Sections"
import { FaCaretUp, FaCaretDown, FaTrashAlt } from "react-icons/fa";

import FilePreview from "../File/FilePreview";
import RemoveFile from "../File/RemoveFile";
import { GiHamburgerMenu } from "react-icons/gi";
import FileAdd from "../File/FileAdd";

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../SortableItem";
import { ClassContext } from "@/app/context/ClassContext";
import api from "@/utils/api";
import AddSubunit from "./AddSubunit";
import { toast } from "react-toastify";

export default function Section({ sectionId, sectionType, ...dragProps }: { 
    sectionId: number, 
    sectionType: 'Unit' | 'Subunit'
    // Accept attributes and listeners from SortableItem
    [key: string]: any,
}) {
    // Gather context for editMode
    const { units, setUnits, editMode, draggingUnit, draggingSubunit, setDraggingUnit, setDraggingSubunit } = useContext(ClassContext)

    // Find section from context
    let section: UnitType | SubunitType | undefined = sectionType === 'Unit'
    ? units.find(u => u.id === sectionId)
    : units
        .flatMap(u => u.subunits.map(s => ({ ...s, parentUnitId: u.id })))
        .find(s => s.id === sectionId);

    // If section is not found, populate with dummy values and later return error
    if(!section){
        toast.error(`Something went wrong loading all units and subunits. Please try again`)
        section = {
            id: -1,
            class_id: -1,
            name: "",
            course_number: "",
            order: -1,
            members: [],
            subunits: [],
            files: []
        }
    }

    const [name, setName] = useState<string>(section.name)

    // State for sub-sections
    const [openSubsection, setOpenSubsection] = useState<boolean>(false)
    const [subsections, setSubsections] = useState<SectionType[] | null>((() => {
        if(isUnitType(section)){
            return section.subunits
        }
        return null
    })())

    // Very important: Trigger rerender of subsection if units change
    useEffect(() => {
        if (isUnitType(section)) {
          const updatedUnit = units.find(u => u.id === section.id);
          if (updatedUnit) {
            setSubsections(updatedUnit.subunits);
          }
        }
      }, [units, section]);

    // Determine whether to reveal subsection based on whether the user is opening the subsection and/or is currently dragging
    const showSubsection = useMemo(() => {
        if (sectionType === "Subunit") {
          if (draggingSubunit) return false;
          return openSubsection;
        } else {
          if (draggingUnit) return false;
          return openSubsection;
        }
    }, [sectionType, draggingSubunit, draggingUnit, openSubsection]);
      
    const toggleSubsection = () => {
        setDraggingUnit(false)
        setDraggingSubunit(false)
        setOpenSubsection(!openSubsection)
    }

    // Update context when section name is changed
    const handleNameBlur = (name: string) => {
        if(sectionType === "Unit"){
            setUnits(units.map(unit => unit.id !== section.id ? unit : 
                {
                    ...unit,
                    name: name,
                }
            ))
        }
        else{
            setUnits(units.map(unit => !unit.subunits.find(subunit => subunit.id === section.id) ? unit : 
                {
                    ...unit,
                    subunits: unit.subunits.map(subunit => subunit.id !== section.id ? subunit : 
                        {
                            ...subunit,
                            name: name,
                        }
                    )
                }
            ))
        }
    }

    const handleSectionDelete = async () => {
        const lowercaseSectionType = sectionType === 'Unit' ? 'unit' : 'subunit'

        try{
            await api.delete(`/classes/${lowercaseSectionType}s/${section.id}/`)
            // Update context with removed unit/subunit
            if(sectionType === 'Unit'){
                setUnits(units.filter(unit => unit.id !== section.id))
            }
            else{
                setUnits(units.map(unit => !unit.subunits.find(subunit => subunit.id === section.id) ? unit : {
                    ...unit,
                    subunits: unit.subunits.filter(subunit => subunit.id !== section.id)
                }))
            }
        }
        catch(err){
            console.error(err)
        }
    }

    // Update context a subunit is being dragged
    const handleDragPending = () => {
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
    }

    if(section.id === -1){
        return (
            <div className="flex flex-row w-full p-2">
                Error fetching section...
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-row justify-between items-center gap-x-2">
                {<div>
                    {
                    openSubsection ? (
                        <FaCaretUp className="icon-responsive w-4" onClick={() => toggleSubsection()} />
                    ): (
                        <FaCaretDown className="icon-responsive w-4" onClick={() => toggleSubsection()} />
                    )
                    }
                    </div>
                }
                <div className={`flex w-full pt-2 justify-between items-center border-b-1 border-b-primary text-${sectionType === "Unit" ? "2xl" : "xl"}`}>
                    {!editMode ? 
                        <span>{ name }</span>
                        : <input 
                            type="text" value={name} 
                            className="my-2 px-1 border-1 border-primary" 
                            onChange={(e) => setName(e.target.value)} 
                            onBlur={(e) => handleNameBlur(e.target.value)}
                        />
                    }
                    {editMode &&
                        <div className="flex flex-row items-center gap-x-4">
                            <FaTrashAlt className="icon-responsive text-primary" onClick={handleSectionDelete}/>
                            <GiHamburgerMenu {...dragProps} className="icon-responsive w-4 text-primary" />
                        </div>
                    }
                </div>
            </div>
            {showSubsection && (
                <div className="relative flex flex-col gap-y-2 pl-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {section.files.map((note) => (
                            <FilePreview file={note} key={note.id}>
                                { editMode && <RemoveFile file={ note } /> }
                            </FilePreview>
                        ))}
                        {!editMode && <FileAdd section_id={section.id} section={sectionType} />}
                    </div>
                    {subsections && <div className="flex flex-col gap-y-4">
                        <DndContext collisionDetection={closestCenter} onDragPending={handleDragPending} onDragEnd={handleDragEnd}>
                            <SortableContext items={subsections} strategy={verticalListSortingStrategy}>
                                {subsections.map((subunit) => (
                                    <SortableItem id={subunit.id} key={subunit.id}>
                                    {({ setNodeRef, listeners, attributes, style }) => 
                                        <div ref={setNodeRef} style={style}>
                                            <Section sectionId={subunit.id} sectionType="Subunit" {...listeners} {...attributes}/>
                                        </div>
                                    }
                                    </SortableItem>
                                ))}
                            </SortableContext>
                        </DndContext>
                        {(editMode && sectionType === "Unit") && 
                            <AddSubunit unit={section.id} order={subsections.length + 1}/>
                        }
                    </div>}
                </div>
            )}
        </div> 
    )
}