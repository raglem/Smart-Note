"use client"

import { SimpleMemberType } from "@/types"
import { useEffect, useState } from "react"
import { IoIosAddCircleOutline } from "react-icons/io"
import AddMembers from "./AddMembers"
import { UnitType } from "@/types/Sections"
import api from "@/utils/api"
import { toast } from "react-toastify"

export default function AddClass({ close }: { close: () => void }){
    const [className, setClassName] = useState<string>("")
    const [courseNumber, setCourseNumber] = useState<string | null>(null)
    const [classVisibility, setClassVisibility] = useState<"Public" | "Private">("Public")
    const [currentMemberQuery, setCurrentMemberQuery] = useState<string>("")
    const [addedMembers, setAddedMembers] = useState<SimpleMemberType[]>([])

    const handleClassCreate = async () => {
        type ClassCreateType = {
            name: string,
            course_number?: string,
            units: UnitType[],
            members: number[]
        }
        const body: ClassCreateType = {
            name: className,
            course_number: courseNumber !== null ? courseNumber : undefined,
            units: [],
            members: addedMembers.map(member => member.id)
        }

        try{
            const res = await api.post('/classes/', body)
            toast.success(`Class ${body.name} created successfully`)
        }
        catch(err){
            console.error(err)
        }
        close()
    }
    
    return (
        <div className="overlay">
            <div className="card flex flex-col py-4 gap-y-2 min-w-[300px] w-[50vw] max-w-[768px] bg-secondary">
                <header className="flex flex-row items-center px-2 text-3xl border-b-1 border-b-primary">
                    Add Class
                </header>
                <form className="flex flex-col items-stretch gap-y-4 py-4 px-2" onSubmit={(e) => {e.preventDefault()}}>
                    <div>
                        <label htmlFor="class-name">Name</label>
                        <input 
                            type="text" placeholder="Class Name" id="class-name" required className="form-input"
                            value={className} onChange={(e) => setClassName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="course-number">
                            Course Number &nbsp;
                            <i>(Optional)</i>
                        </label>
                        <input 
                            type="text" placeholder="Course Number" id="course-number" className="form-input"
                            value={courseNumber || ""} onChange={(e) => setCourseNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="class-visibility">
                            Class Visibility
                        </label>
                        <select value={classVisibility} onChange={(e) => setClassVisibility(e.target.value as "Public" | "Private")} className="form-input">
                            <option>Public</option>
                            <option>Private</option>
                        </select>
                    </div>
                    <AddMembers
                        memberQuery={currentMemberQuery} 
                        setMemberQuery={setCurrentMemberQuery} 
                        addedMembers={addedMembers} 
                        setAddedMembers={setAddedMembers} 
                    />
                    <div className="form-btn-toolbar">
                        <button 
                            className="form-btn bg-primary text-white"
                            onClick={handleClassCreate}
                        >
                            Save
                        </button>
                        <button 
                            type="reset" className="form-btn bg-secondary text-primary"
                            onClick={close}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}