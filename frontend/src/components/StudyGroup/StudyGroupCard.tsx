"use client"

import { useContext, useEffect, useState } from "react";

import { StudyGroupContext } from "@/app/context/StudyGroupContext";

import { FaCog, FaClock } from "react-icons/fa";
import { StudyGroupType } from "../../types";
import { IoIosCheckmarkCircle } from "react-icons/io";
import StudyGroupToolbar from "./StudyGroupToolbar";

export function StudyGroupCard({ group }: { group: StudyGroupType }) {
    // Context to handle study group forms
    const { 
        selectedStudyGroup, setSelectedStudyGroup, 
        showSidebar, setShowSidebar,
        setInvitingGroup, 
        setManagingGroup 
    } = useContext(StudyGroupContext)

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

    const handleToolbar = () => {
        if(selectedStudyGroup && selectedStudyGroup.id === group.id){
            setShowToolbar(!showToolbar)
        }
    }

    group.members.sort((a,b) => {
        if(a.status !== b.status){
            return a.status === "Joined" ?  -1 : 1
        }
        else{
            return a.member.name.localeCompare(b.member.name)
        }
    })
    return (
        <>
            <div className={`card flex flex-col py-2 gap-y-2 w-full ${ selectedStudyGroup?.id === group.id ? "bg-primary text-white" : "bg-white text-primary"}`}>
                <header className={`flex flex-row items-center py-2 px-4 gap-x-4 border-b-1 ${ selectedStudyGroup?.id === group.id ? "border-b-white" : "border-b-primary"}`}>
                    <div className="relative">
                        <FaCog className="hover:cursor-pointer text-3x" onClick={handleToolbar}/>
                        {showToolbar && 
                            <StudyGroupToolbar 
                                group={group}
                                closeToolbar={() => setShowToolbar(false)}
                            />
                        }
                    </div>
                    <div>
                        <h1 className={`text-${group.name.length > 15 ? "sm" : "xl"} m-0`}>{ group.name }</h1>
                        <i className="text-xs">{ new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(group.datetime)) }</i>
                    </div>
                </header>
                <ul className="flex flex-col px-2">
                    {
                        group.members.map(current => (
                            <li className={`not-last-of-type:border-b-1 ${ selectedStudyGroup?.id === group.id ? "border-b-white" : "border-b-primary"}`} key={current.id}>
                                <div className="flex flex-row justify-between items-center p-2">
                                    <div>{ current.member.name }</div>
                                    { current.status === "Joined" ? <IoIosCheckmarkCircle className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-green-500"/> 
                                        : <FaClock className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-yellow-500"/>}
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}