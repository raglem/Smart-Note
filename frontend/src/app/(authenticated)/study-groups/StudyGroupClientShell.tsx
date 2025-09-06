"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { StudyGroupContext } from "@/app/context/StudyGroupContext"
import StudyGroupCreate from "@/components/StudyGroup/StudyGroupCreate"
import StudyGroupCalendar from "@/components/StudyGroup/StudyGroupCalendar"
import StudyGroupInvite from "@/components/StudyGroup/StudyGroupInvite"
import StudyGroupManage from "@/components/StudyGroup/StudyGroupManage"
import { StudyGroupType } from "@/types"
import StudyGroupCalendarHeader from "@/components/StudyGroup/StudyGroupCalendarHeader"

export default function StudyGroupClientShell({ studyGroupsInfo }: { studyGroupsInfo: StudyGroupType[] }){
    const { showSidebar, setShowSidebar } = useContext(StudyGroupContext)
    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const initializedRef = useRef(false)

    const { 
        studyGroups, setStudyGroups, setLoadingStudyGroups,
        selectedStudyGroup, setSelectedStudyGroup, 
        creatingGroup, setCreatingGroup, 
        invitingGroup, managingGroup 
    } = useContext(StudyGroupContext)

    // Update loading state to false
    useEffect(() => {
        setLoadingStudyGroups(false)
    }, [])

    return (
        <>
            { creatingGroup && <StudyGroupCreate /> }
            { (selectedStudyGroup && invitingGroup) && <StudyGroupInvite id={selectedStudyGroup.id} name={selectedStudyGroup.name} studyGroup={selectedStudyGroup} /> }
            { (selectedStudyGroup && managingGroup) && <StudyGroupManage id={selectedStudyGroup.id} studyGroup={selectedStudyGroup}/> }
            <div className={`transform transition-pl duration-300 ease-in-out ${showSidebar ? "lg:pl-[250px]" : "pl-0" } flex flex-col h-full justify-center box-sizing w-full`}>
                <div className="flex flex-col h-full gap-y-4 p-12">
                    <StudyGroupCalendarHeader />
                    <StudyGroupCalendar />
                </div>
            </div>
        </>
    )
}