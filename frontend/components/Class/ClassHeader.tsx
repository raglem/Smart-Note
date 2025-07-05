"use client"

import { useEffect, useState } from "react";
import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import { FaCheckCircle, FaCog, FaEdit } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
export default function ClassHeader({ classInfo, editMode, setEditMode }: { 
    classInfo: {
        name: string,
        course_number?: string,
        join_code: string
    },
    editMode: boolean,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}){
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
                        <FaCog className="hover:cursor-pointer hover:opacity-80 text-2xl text-primary" onClick={() => openToolbar}/>
                    }
                    {editMode &&
                        <FaCheckCircle className="hover:cursor-pointer hover:opacity-80 text-2xl text-primary" onClick={() => setEditMode(false)}/>
                    }
                    {showToolbar &&
                        <div id="toolbar" className="absolute top-[100%] left-0 min-w-fit bg-white border-1 border-primary text-[1.2rem] shadow-md z-1">
                            <div className="flex flex-row justify-betweeen items-center p-2 gap-x-6 border-b-1 border-b-primary hover:opacity-80 hover:cursor-pointer">
                                <span>Add</span>
                                <IoIosAddCircleOutline className="hover:cursor-pointer hover:opacity-80" />
                            </div>
                            <div className="flex flex-row justify-betweeen items-center p-2 gap-x-6 hover:opacity-80 hover:cursor-pointer" onClick={openEditMode}>
                                <span>Edit</span>
                                <FaEdit className="hover:cursor-pointer hover:opacity-80" />
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
            <div className="flex items-end gap-x-2">
                <span className="text-xl">Join Code:</span>
                <span>{ classInfo.join_code }</span>
                <HiMiniDocumentDuplicate className="icon-responsive text-4xl text-primary"/>
            </div>
        </header>
    )
}