"use client"

import { useEffect, useState, useContext } from "react";
import { ClassContext } from "@/app/context/ClassContext";
import DuplicateCode from "./DuplicateCode";

import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import { FaCheckCircle, FaCog, FaEdit } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { ClassDetailType } from "../../types/Sections";
import LeaveClass from "./LeaveClass";
import { toast } from "react-toastify";

export default function ClassHeader({ classInfo }: { classInfo: ClassDetailType }) {
    // Gather context
    const { classFields, setClassFields, setAddMode, editMode, setEditMode, handleSave } = useContext(ClassContext)

    // State for toolbar and clicking out
    const [showToolbar, setShowToolbar] = useState<boolean>(false)
    const [name, setName] = useState<string>(classInfo.name)
    const [courseNumber, setCourseNumber] = useState<string>(classInfo.course_number || "")

    // State for deleting a class
    const [showDelete, setShowDelete] = useState<boolean>(false)
    useEffect(() => {
        const closeToolbar = (e: MouseEvent) => {
            // If showToolbar is false, do nothing
            if(showToolbar === false) return

            const toolbar = document.getElementById("toolbar");
            const target = e.target as HTMLElement;

            // If clicked inside toolbar, do nothing
            if (toolbar && toolbar.contains(target)) return;
            setShowToolbar(false);
        }
        document.addEventListener("click", closeToolbar)
        return () => {
            document.removeEventListener("click", closeToolbar)
        }
    }, [showToolbar])

    const handleBlurForNameAndCourseNumber = () => {
        // Check name
        if(name.length < 3){
            toast.error("Class name must be at least 3 characters long")
            return
        }

        if(!classFields){
            toast.error("Class fields have not been loaded yet. Please try again.")
            return
        }

        setClassFields({
            ...classFields,
            name: name,
            course_number: courseNumber,
        });
    }

    const openToolbar = () => {
        // If editing, toolbar should be disabled
        if(editMode) return
        setShowToolbar(true)
    }
    const openEditMode = () => {
        setEditMode(true)
        setShowToolbar(false)
    }
    const closeEditMode = async () => {
        await handleSave()
        setEditMode(false)
        setShowToolbar(false)
    }

    return (
        <>
            {showDelete && <LeaveClass close = {() => setShowDelete(false)}/>}
            <header className="flex flex-row justify-between items-center text-3xl">
                <div className="flex items-center gap-x-4">
                    <div className="relative">
                        {!editMode &&
                            <FaCog className="hover:cursor-pointer hover:opacity-80 text-2xl text-primary" onClick={openToolbar}/>
                        }
                        {editMode &&
                            <FaCheckCircle className="hover:cursor-pointer hover:opacity-80 text-2xl text-primary" onClick={closeEditMode}/>
                        }
                        {showToolbar &&
                            <div id="toolbar" className="absolute top-[120%] left-0 min-w-fit w-40 bg-white border-1 border-primary text-[1.2rem] shadow-md z-1">
                                <div className="flex flex-row justify-between items-center p-2 border-b-1 border-b-primary hover:opacity-80 hover:cursor-pointer" onClick={openEditMode}>
                                    <span>Edit Class</span>
                                    <FaEdit className="hover:cursor-pointer hover:opacity-80" />
                                </div>
                                <div className="flex flex-row justify-between items-center p-2 border-b-1 border-b-primary hover:opacity-80 hover:cursor-pointer" onClick={() => setAddMode(true)}>
                                    <span>Add Unit</span>
                                    <IoIosAddCircleOutline className="hover:cursor-pointer hover:opacity-80" />
                                </div>
                                <div className="flex flex-row justify-between items-center p-2 hover:opacity-80 hover:cursor-pointer" onClick={() => setShowDelete(true)}>
                                    <span>Leave Class</span>
                                    <MdDeleteForever className="hover:cursor-pointer hover:opacity-80" />
                                </div>
                            </div>
                        }
                    </div>
                    {
                        !editMode ? (
                            courseNumber.length > 0 ? (
                                <div>
                                    { name } | { courseNumber }
                                </div>
                            ) : (
                                <div>
                                    { name }
                                </div>
                            )
                        ) : (
                            <div className="flex flex-row gap-x-4">
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="text-sm italic">Name</label>
                                    <input 
                                        type="text" className="border-1 border-primary px-1 text-[1.5rem]" 
                                        id="name" value={name} required
                                        onChange={(e) => setName(e.target.value)}
                                        onBlur={handleBlurForNameAndCourseNumber}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="course number" className="text-sm italic">Course Number (Optional)</label>
                                    <input 
                                        type="text" className="border-1 border-primary px-1 text-[1.5rem]" 
                                        id="course number" value={courseNumber} 
                                        onChange={(e) => setCourseNumber(e.target.value)}
                                        onBlur={handleBlurForNameAndCourseNumber}
                                    />
                                </div>
                            </div>
                        )
                    }

                </div>
                {!editMode && <div className="flex flex-row items-end justify-end">
                    <span className="text-2xl text-primary">Join Code: &nbsp; </span>
                    <DuplicateCode code={classInfo.join_code} />
                </div>}
            </header>
        </>
    )
}