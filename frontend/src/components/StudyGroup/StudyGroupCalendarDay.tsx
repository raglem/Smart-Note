"use client"

import { StudyGroupContext } from "@/app/context/StudyGroupContext";
import useMemberStore from "@/stores/memberStore";
import { StudyGroupType } from "@/types";
import { useContext, useEffect } from "react";

export default function StudyGroupCalendarDay({ events }: { events: StudyGroupType[] }){
    const { studyGroups, setShowSidebar, setSidebarMode, selectedStudyGroup, setSelectedStudyGroup } = useContext(StudyGroupContext)

    // Retrieve member state to check if mode should be switched to "My Groups" or "Invited"
    const member = useMemberStore((state) => state.member)
    const fetchMember = useMemberStore((state) => state.fetchMember)
    useEffect(() => {fetchMember()}, [fetchMember])

    const handleSelect = (groupId: number) => {
        if(selectedStudyGroup && selectedStudyGroup.id === groupId){
            setSelectedStudyGroup(null)
            return
        }
        const studyGroup = studyGroups.find(sg => sg.id === groupId) || null
        setSelectedStudyGroup(studyGroup)
        setShowSidebar(true)
        if(member && studyGroup){
            if(studyGroup.members.some(sgMember => sgMember.member.id === member.id && sgMember.status === "Joined")){
                console.log("Setting tab to my groups")
                setSidebarMode("My Groups")
            }
            else{
                console.log("Setting tab to my invites")
                setSidebarMode("Invites")
            }
        }
    }
    return (
        <div className="flex flex-col gap-y-2 h-full">
            {
                events.map((event, i) => (
                    <div key={i} className={`flex flex-col 2xl:flex-row justify-between items-center rounded-md ${selectedStudyGroup?.id === event.id ? "bg-primary text-white" : "bg-white text-primary border-1 border-primary rounded-md"} px-2 py-1 cursor-pointer hover:opacity-80 `} onClick={() => handleSelect(event.id)}>
                        <div className="text-md"> {event.name} </div>
                        <i className="text-xs whitespace-nowrap">{`${event.datetime.getHours() % 12 || 12}:${event.datetime.getMinutes() < 10 ? '0' + event.datetime.getMinutes() : event.datetime.getMinutes()} ${event.datetime.getHours() < 12 ? 'AM' : 'PM'}`}</i>
                    </div>
                ))
            }
        </div>
    )
}