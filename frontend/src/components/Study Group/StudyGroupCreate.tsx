"use client"

import { useState, useContext } from "react"
import { StudyGroupContext } from "@/app/context/StudyGroupContext"
import api from "@/utils/api"
import { StudyGroupType } from "@/types"
import { toast } from "react-toastify"

export default function StudyGroupCreate(){
    const [name, setName] = useState<string>("")
    const [datetime, setDatetime] = useState<Date>(new Date())
    const [visibility, setVisibility] = useState<"Public" | "Private">("Private")

    // Retrieve context
    const { setStudyGroups, setCreatingGroup } = useContext(StudyGroupContext)

    const handleCreate = async () => {
        const body = {
            name,
            datetime,
            visibility: "Public",
            members: []
        }
        if(name.trim() === "" || name.length < 3){
            toast.error("Study group name must be at least 3 characters long")
            return
        }
        try{
            const res = await api.post('/study-groups/', body)
            const data = res.data as StudyGroupType
            setStudyGroups((prev) => [...prev, data].sort((a: StudyGroupType, b:StudyGroupType) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()))
        }
        catch(err){
            console.error(err)
        }
        setCreatingGroup(false)
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month, day] = e.target.value.split('-').map(Number);
        const newDate = new Date(datetime);
        newDate.setFullYear(year);
        newDate.setMonth(month - 1);
        newDate.setDate(day);
        setDatetime(newDate);
    };
    
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        const newDate = new Date(datetime);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        setDatetime(newDate);
    };

    // Get the local datetime
    const formattedLocalDate = `${datetime.getFullYear()}-${pad(datetime.getMonth() + 1)}-${pad(datetime.getDate())}`
    const formattedLocalTime = `${pad(datetime.getHours())}:${pad(datetime.getMinutes())}`;
    function pad(num: number): string {
        return num.toString().padStart(2, '0');
    }

    return (
        <div className="overlay">
            <div className="card flex flex-col gap-y-4 min-w-[300px] w-[50vw] max-w-[768px] bg-white border-1 border-primary">
                <header className="flex flex-row items-center pt-4 pb-2 px-4 bg-primary text-white text-3xl border-b-1 border-b-primary">
                    Create Study Group
                </header>
                <div className="flex flex-col gap-y-4 p-4">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-xl">Name</label>
                        <input type="text" placeholder="Name" id="name" className="form-input border-1 border-primary" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-xl">Date</label>
                        <input type="date" placeholder="Date" id="date" className="form-input border-1 border-primary" value={formattedLocalDate} onChange={handleDateChange} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="time" className="text-xl">Time</label>
                        <input type="time" placeholder="Time" id="time" className="form-input border-1 border-primary" value={formattedLocalTime} onChange={handleTimeChange} />
                    </div>
                    <div className="form-btn-toolbar">
                        <button className="form-btn bg-primary text-white border-0" onClick={handleCreate} >Create</button>
                        <button className="form-btn bg-white text-primary border-1 border-primary" onClick={() => setCreatingGroup(false)} >Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}