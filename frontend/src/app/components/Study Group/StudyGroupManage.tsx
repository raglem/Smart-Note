"use client"

import { useState, useContext } from "react"
import { StudyGroupContext } from "@/app/context/StudyGroupContext"
import { IoIosCheckmarkCircle, IoMdRemoveCircleOutline } from "react-icons/io"
import { FaClock } from "react-icons/fa"
import { StudyGroupType } from "../../../types"

export default function StudyGroupManage({ id, studyGroup }: { id: string, studyGroup: StudyGroupType}){
    const [name, setName] = useState<string>(studyGroup.name)
    const [date, setDate] = useState<Date>(new Date())
    const [time, setTime] = useState<Date>(new Date())
    const [visibility, setVisibility] = useState<"Public" | "Private">("Private")

    // Retrieve context
    const { studyGroups, setStudyGroups, setManagingGroup } = useContext(StudyGroupContext)

    const handleSave = () => {
        const dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes())
        // TODO: Handle API POST
        setStudyGroups((prev) => [...prev, {
            id: "123",
            name,
            dateTime,
            visibility,
            members: []
        }].sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()))
        setManagingGroup(false)
    }

    const handleRemoveMember = (id: string) => {
        // TODO: Handle API

        // Remove member from study group prop
        studyGroup.members = studyGroup.members.filter((m) => m.member.id !== id)

        // Remove member from context
        const newMembers = studyGroup.members.filter((m) => m.member.id !== id)
        setStudyGroups((prev) => prev.map((group) => {
            if(group.id === id){
                return {
                    ...group,
                    members: newMembers
                }
            }
            return group
        }))
    }

    return (
        <div className="overlay">
            <div className="card flex flex-col gap-y-4 pt-8 pb-4 min-w-[300px] w-[50vw] max-w-[768px] bg-secondary">
                <header className="flex flex-row items-center px-2 text-3xl border-b-1 border-b-primary">
                    Manage { studyGroup.name }
                </header>
                <div className="flex flex-col gap-y-4 px-2">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-xl">Name</label>
                        <input type="text" placeholder={ name } id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-xl">Date</label>
                        <input type="date" placeholder="Date" id="date" className="form-input" value={date.toISOString().split('T')[0]} onChange={(e) => setDate(new Date(e.target.value))} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="time" className="text-xl">Time</label>
                        <input type="time" placeholder="Time" id="time" className="form-input" value={time.toTimeString().split(' ')[0]} onChange={(e) => setTime(new Date(e.target.value))} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="visibility" className="text-xl">Visibility</label>
                        <select id="visibility" className="form-input px-0" value={visibility} onChange={(e) => setVisibility(e.target.value as "Public" | "Private")}>
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                    </div>
                </div>
                { studyGroup && <ol className="flex flex-col max-h-[210px] mx-2 border-1 border-y-primary rounded-sm overflow-auto">
                    {studyGroup.members.map((m) => (
                        <li className="flex flex-row justify-between items-center p-2 not-last-of-type:border-b-1 border-b-primary" key={m.member.id}>
                            <div className="flex flex-row items-center gap-x-2">
                                <div>{ m.member.name }</div>
                                { m.status === "Joined" ? <IoIosCheckmarkCircle className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-green-500"/> 
                                        : <FaClock className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-yellow-500"/>}
                            </div>
                            <IoMdRemoveCircleOutline className="icon-responsive text-primary text-xl" onClick={() => handleRemoveMember(m.member.id)}/>
                        </li>
                    ))}
                </ol> }
                <div className="form-btn-toolbar px-2">
                    <button className="form-btn bg-primary text-white" onClick={handleSave} >Save</button>
                    <button className="form-btn bg-white text-primary" onClick={() => setManagingGroup(false)} >Cancel</button>
                </div>
            </div>
        </div>
    )
}