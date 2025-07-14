"use client"

import { useEffect, useState, useContext } from "react";
import { ClassContext } from "@/app/context/ClassContext";
import DuplicateCode from "./DuplicateCode";

import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import { FaCheckCircle, FaCog, FaEdit } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { ClassType } from "../../types/Sections";

export default function ClassHeader({ classInfo }: { classInfo: ClassType }) {
    // Gather context
    const { setAddMode, editMode, setEditMode } = useContext(ClassContext)

    // State for toolbar and clicking out
    const [showToolbar, setShowToolbar] = useState<boolean>(false)
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

    const openToolbar = () => {
        // If editing, toolbar should be disabled
        if(editMode) return
        setShowToolbar(true)
    }
    const openEditMode = () => {
        setEditMode(true)
        setShowToolbar(false)
    }

    return (
        <header className="flex flex-row justify-between items-center text-3xl">
            <div className="flex items-center gap-x-4">
                <div className="relative">
                    {!editMode &&
                        <FaCog className="hover:cursor-pointer hover:opacity-80 text-2xl text-primary" onClick={openToolbar}/>
                    }
                    {editMode &&
                        <FaCheckCircle className="hover:cursor-pointer hover:opacity-80 text-2xl text-primary" onClick={() => setEditMode(false)}/>
                    }
                    {showToolbar &&
                        <div id="toolbar" className="absolute top-[120%] left-0 min-w-fit w-40 bg-white border-1 border-primary text-[1.2rem] shadow-md z-1">
                            <div className="flex flex-row justify-between items-center p-2 border-b-1 border-b-primary hover:opacity-80 hover:cursor-pointer" onClick={() => setAddMode(true)}>
                                <span>Add Unit</span>
                                <IoIosAddCircleOutline className="hover:cursor-pointer hover:opacity-80" />
                            </div>
                            <div className="flex flex-row justify-between items-center p-2 border-b-1 border-b-primary hover:opacity-80 hover:cursor-pointer" onClick={openEditMode}>
                                <span>Edit</span>
                                <FaEdit className="hover:cursor-pointer hover:opacity-80" />
                            </div>
                            <div className="flex flex-row justify-between items-center p-2 hover:opacity-80 hover:cursor-pointer" onClick={openEditMode}>
                                <span>Delete Class</span>
                                <MdDeleteForever className="hover:cursor-pointer hover:opacity-80" />
                            </div>
                        </div>
                    }
                </div>
                {
                    classInfo.course_number ? (
                        <div>
                            { classInfo.name } | { classInfo.course_number}
                        </div>
                    ) : (
                        <div>
                            { classInfo.name }
                        </div>
                    )
                }
            </div>
            <div className="flex flex-row items-end justify-end">
                <span className="text-2xl text-primary">Join Code: &nbsp; </span>
                <DuplicateCode code={classInfo.join_code} />
            </div>
        </header>
    )
}