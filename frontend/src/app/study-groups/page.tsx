"use client"

import { useContext, useState } from "react"
import { StudyGroupContext } from "../context/StudyGroupContext"
import StudyGroupCreate from "../../components/Study Group/StudyGroupCreate"
import StudyGroupCalendar from "../../components/Study Group/StudyGroupCalendar"
import StudyGroupInvite from "../../components/Study Group/StudyGroupInvite"
import StudyGroupManage from "../../components/Study Group/StudyGroupManage"
import { StudyGroupType } from "@/types"
import { MdMenu } from "react-icons/md"

export default function Page(){
    const dummy: StudyGroupType = {
        id: "1",
        name: "Math Study Group",
        dateTime: new Date(),
        visibility: "Public",
        members: [
            { member: { id: "m1", name: "Alice" }, status: "Joined" },
            { member: { id: "m2", name: "Bob" }, status: "Invited" }
        ]
    }
    const { showSidebar, setShowSidebar } = useContext(StudyGroupContext)
    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const { studyGroups, selectedStudyGroup, creatingGroup, setCreatingGroup, invitingGroup, managingGroup } = useContext(StudyGroupContext)
    return (
        <>
            { creatingGroup && <StudyGroupCreate /> }
            { invitingGroup && <StudyGroupInvite id={dummy.id} name={dummy.name} studyGroup={dummy} /> }
            { managingGroup && <StudyGroupManage id={dummy.id} studyGroup={dummy}/> }
            <div className={`transform transition-pl duration-300 ease-in-out ${showSidebar ? "lg:pl-[250px]" : "pl-0" } flex flex-col h-full justify-center box-sizing w-full`}>
                <div className="flex flex-col h-full gap-y-4 p-12">
                    <header className="flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center gap-x-4 text-3xl text-primary">
                            { !showSidebar && <MdMenu className="icon-responsive" onClick={() => setShowSidebar(true)}/> }
                            <h2 >{new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month, 1))} / {year}</h2>
                        </div>
                        <button className="flex py-2 px-4 bg-primary text-white rounded-md cursor-pointer hover:opacity-80" onClick={() => setCreatingGroup(!creatingGroup)}>Create Study Group</button>
                    </header>
                    <StudyGroupCalendar 
                        selectedMonth={month} 
                        selectedYear={year} 
                        setSelectedMonth={setMonth} 
                        setSelectedYear={setYear}
                    />
                </div>
            </div>
        </>
    )
}