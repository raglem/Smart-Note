"use client"

import { useState, useContext } from "react"
import { StudyGroupContext } from "@/app/context/StudyGroupContext"

export default function StudyGroupCreate(){
    const [name, setName] = useState<string>("")
    const [date, setDate] = useState<Date>(new Date())
    const [time, setTime] = useState<Date>(new Date())
    const [visibility, setVisibility] = useState<"Public" | "Private">("Private")

    // Retrieve context
    const { setStudyGroups, setCreatingGroup } = useContext(StudyGroupContext)

    const handleCreate = () => {
        const dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes())
        // TODO: Handle API POST
        setStudyGroups((prev) => [...prev, {
            id: "123",
            name,
            dateTime,
            visibility,
            members: []
        }].sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()))
        setCreatingGroup(false)
    }
    return (
        <div className="overlay">
            <div className="card flex flex-col gap-y-4 pt-8 pb-4 min-w-[300px] w-[50vw] max-w-[768px] bg-secondary">
                <header className="flex flex-row items-center px-2 text-3xl border-b-1 border-b-primary">
                    Create Study Group
                </header>
                <div className="flex flex-col gap-y-4 px-2">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-xl">Name</label>
                        <input type="text" placeholder="Name" id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
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
                    <div className="form-btn-toolbar">
                        <button className="form-btn bg-primary text-white" onClick={handleCreate} >Create</button>
                        <button className="form-btn bg-white text-primary" onClick={() => setCreatingGroup(false)} >Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}