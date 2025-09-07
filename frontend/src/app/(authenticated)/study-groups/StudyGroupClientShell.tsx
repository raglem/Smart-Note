"use client"

import { useContext, useEffect } from "react"
import { StudyGroupContext } from "@/app/context/StudyGroupContext"
import StudyGroupCreate from "@/components/StudyGroup/StudyGroupCreate"
import StudyGroupCalendar from "@/components/StudyGroup/StudyGroupCalendar"
import StudyGroupInvite from "@/components/StudyGroup/StudyGroupInvite"
import StudyGroupManage from "@/components/StudyGroup/StudyGroupManage"
import StudyGroupCalendarHeader from "@/components/StudyGroup/StudyGroupCalendarHeader"

export default function StudyGroupClientShell(){
    // Retrieve context to view and manage study groups
    const { 
        showSidebar, setLoadingStudyGroups,
        selectedStudyGroup, creatingGroup,
        invitingGroup, managingGroup 
    } = useContext(StudyGroupContext)

    // Update loading state to false
    useEffect(() => {
        setLoadingStudyGroups(false)
    }, [setLoadingStudyGroups])

    return (
        <>
            { creatingGroup && <StudyGroupCreate /> }
            { (selectedStudyGroup && invitingGroup) && <StudyGroupInvite id={selectedStudyGroup.id} /> }
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