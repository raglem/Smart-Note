"use client"

import { StudyGroupContext } from "@/app/context/StudyGroupContext";
import { StudyGroupType } from "@/types";
import { setGlobal } from "next/dist/trace";
import { useContext } from "react";

export default function StudyGroupCalendarDay({ events }: { events: StudyGroupType[] }){
    const { studyGroups, setShowSidebar, selectedStudyGroup, setSelectedStudyGroup } = useContext(StudyGroupContext)
    const handleSelect = (groupId: string) => {
        if(selectedStudyGroup?.id === groupId){
            setSelectedStudyGroup(null)
            return
        }
        setSelectedStudyGroup(studyGroups.find(sg => sg.id === groupId) || null)
        setShowSidebar(true)
    }
    return (
        <div className="flex flex-col gap-y-2 h-full">
            {
                events.map((event, i) => (
                    <div key={i} className={`flex flex-col xl:flex-row justify-between items-center rounded-md ${selectedStudyGroup?.id === event.id ? "bg-primary text-white" : "bg-white text-primary border-1 border-primary rounded-md"} px-2 py-1 cursor-pointer hover:opacity-80 `} onClick={() => handleSelect(event.id)}>
                        <div className="text-md"> {event.name} </div>
                        <i className="text-xs whitespace-nowrap">{`${event.dateTime.getHours() % 12 || 12}:${event.dateTime.getMinutes() < 10 ? '0' + event.dateTime.getMinutes() : event.dateTime.getMinutes()} ${event.dateTime.getHours() < 12 ? 'AM' : 'PM'}`}</i>
                    </div>
                ))
            }
        </div>
    )
}