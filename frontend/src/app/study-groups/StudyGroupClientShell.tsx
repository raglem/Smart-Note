"use client"

import { useContext, useRef, useState } from "react"
import { StudyGroupContext } from "../context/StudyGroupContext"
import StudyGroupCreate from "../../components/Study Group/StudyGroupCreate"
import StudyGroupCalendar from "../../components/Study Group/StudyGroupCalendar"
import StudyGroupInvite from "../../components/Study Group/StudyGroupInvite"
import StudyGroupManage from "../../components/Study Group/StudyGroupManage"
import { StudyGroupType } from "@/types"
import { MdMenu } from "react-icons/md"
import StudyGroupCalendarHeader from "@/components/Study Group/StudyGroupCalendarHeader"

export default function StudyGroupClientShell({ studyGroupsInfo }: { studyGroupsInfo: StudyGroupType[] }){
    const { showSidebar, setShowSidebar } = useContext(StudyGroupContext)
    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const initializedRef = useRef(false)

    const { 
        studyGroups, setStudyGroups, 
        selectedStudyGroup, setSelectedStudyGroup, 
        creatingGroup, setCreatingGroup, 
        invitingGroup, managingGroup 
    } = useContext(StudyGroupContext)

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