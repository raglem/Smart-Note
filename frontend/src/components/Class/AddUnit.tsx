"use client"

import { useContext, useEffect, useState } from "react";
import SortableItem from "../SortableItem";

import { closestCenter, DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { ClassContext } from "@/app/context/ClassContext";
import api from "@/utils/api";
import { UnitType } from "@/types/Sections";
import { toast } from "react-toastify";

export default function AddUnit({ class_id, close }: { class_id: number, close: () => void }) {
    const { units, setUnits } = useContext(ClassContext)
    const [unitName, setUnitName] = useState<string>("")
    const [subunit, setSubunit] = useState<string>("")
    const [subunits, setSubunits] = useState<string[]>([])
    // Handle input enters
    useEffect(() => {
        const handleEnter = (event: KeyboardEvent) => {
            const unitInput = document.getElementById("unit-input")
            const subunitInput = document.getElementById("subunit-input")
            if (event.key === "Enter") {
                const active = document.activeElement
                if(active === unitInput){
                    unitInput?.blur();
                }
                if(active === subunitInput){
                    handleSubunitAdd()
                }
            }
        }
        document.addEventListener("keydown", handleEnter)
        return () => {
            document.removeEventListener("keydown", handleEnter)
        }
    })
    // Edits subunits portion of form
    const handleSubunitAdd = () => {
        if(subunits.includes(subunit)){
            toast.error(`Subunit with name ${subunit} already exists`)
            return
        }
        setSubunits([...subunits, subunit])
        setSubunit("")
    }
    const handleSubunitRemove = (deletedSubunit: string) => {
        setSubunits(subunits.filter(subunit => subunit !== deletedSubunit))
    }
    const handleSubunitDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = subunits.findIndex((id) => id === active.id);
        const newIndex = subunits.findIndex((id) => id === over.id);

        setSubunits(arrayMove(subunits, oldIndex, newIndex));
    }

    // Handles form submission or cancel
    const handleUnitCreate = async () => {
        if(unitName.trim() === "" || unitName.length < 3){
            toast.error("Unit name must be at least 3 characters long")
            return
        }
        
        type unitRequestBody = {
            name: string,
            class_field: number,
            order: number,
            subunits: {
                name: string,
                order: number,
            }[]
        }
        const body: unitRequestBody = {
            name: unitName,
            class_field: class_id,
            order: units.length,
            subunits: subunits.map((subunit, i) => {
                return {
                    name: subunit,
                    order: i+1,
                }
            })
        }

        try{
            const res = await api.post('/classes/units/', body)
            const newUnit: UnitType = res.data
            // Add unit to class context
            setUnits([...units, newUnit])
        }
        catch(err){
            console.error(err)
        }
        close()
    }
    const handleCancel = () => {
        close()
    }
    return (
        <div className="overlay">
            <div className="card pt-8 min-w-[300px] w-[50vw] max-w-[768px] bg-secondary">
                <header className="flex flex-row items-center px-2 text-3xl border-b-1 border-b-primary">
                    Add Unit
                </header>
                <form className="flex flex-col items-stretch gap-y-4 py-4 px-2" onSubmit={(e) => {e.preventDefault()}}>
                    <input 
                        type="text" placeholder="Unit Name" id="unit-input" required className="form-input"
                        value={unitName} onChange={(e) => setUnitName(e.target.value)}
                    />
                    <div className="form-input-wrapper">
                        <input 
                            type="text" placeholder="Add Subunit" id="subunit-input" className="form-input p-0 border-0"
                            value={subunit} onChange={(e) => setSubunit(e.target.value)}
                        />
                        <IoIosAddCircleOutline className="icon-responsive" onClick={handleSubunitAdd}/>
                    </div>
                    {subunits.length > 0 && <div className="flex flex-col w-full">
                        <h3>Subunits</h3>
                        <DndContext collisionDetection={closestCenter} onDragEnd={handleSubunitDragEnd}>
                            <SortableContext items={subunits} strategy={verticalListSortingStrategy}>
                                <ol className="flex flex-col border-1 border-y-primary rounded-sm">
                                    {
                                        subunits.map((currentSubunit, i) => (
                                            <SortableItem id={i} key={i}>
                                                {i < subunits.length - 1 ? ({ listeners, attributes, setNodeRef, style }) => 
                                                    <li ref={setNodeRef} style={style} className="flex flex-row justify-between items-center p-2 border-b-1 border-b-primary" key={i}>
                                                        {currentSubunit}
                                                        <span className="flex flex-row items-center gap-x-2">
                                                            <GiHamburgerMenu {...attributes} {...listeners} className="icon-responsive cursor-grab" />
                                                            <IoIosRemoveCircleOutline className="icon-responsive" onClick={() => handleSubunitRemove(currentSubunit)}/>
                                                        </span>
                                                    </li> : ({ listeners, attributes, setNodeRef, style }) => 
                                                    <li ref={setNodeRef} style={style} className="flex flex-row justify-between items-center p-2" key={i}>
                                                        {currentSubunit}
                                                        <span className="flex flex-row items-center gap-x-2">
                                                            { i!=0 && <GiHamburgerMenu {...attributes} {...listeners} className="icon-responsive cursor-grab" />}
                                                            <IoIosRemoveCircleOutline className="icon-responsive" onClick={() => handleSubunitRemove(currentSubunit)}/>
                                                        </span>
                                                    </li>
                                                }
                                            </SortableItem>
                                        ))
                                    }
                                </ol>
                            </SortableContext>
                        </DndContext>
                    </div>
                    }
                    <div className="form-btn-toolbar">
                        <button onClick={handleUnitCreate} className="form-btn bg-primary text-white">Save</button>
                        <button onClick={handleCancel} className="form-btn bg-secondary text-primary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}