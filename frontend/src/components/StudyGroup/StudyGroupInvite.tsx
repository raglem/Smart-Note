'use client'

import { useContext, useEffect, useState } from "react";
import useClassesStore from "@/stores/classesStore";
import { StudyGroupContext } from "@/app/context/StudyGroupContext";
import { ClassType } from "@/types/Sections";

import { TbFaceIdError } from "react-icons/tb";
import InviteMembersList from "./InviteMembersList";
import { toast } from "react-toastify";

export default function StudyGroupInvite({ id }: { id: number }) {
    // Retrieve classes from zustand store
    const classes = useClassesStore((state) => state.classes)
    const error = useClassesStore((state) => state.error)
    const fetchClasses = useClassesStore((state) => state.fetchClasses)

    useEffect(() => {
        fetchClasses()
    }, [fetchClasses])

    const { setInvitingGroup } = useContext(StudyGroupContext)

    const [selectedClassId, setSelectedClassId] = useState<number | null>((classes && classes.length > 0) ? classes[0].id : null)
    const selectedClass: ClassType = classes.find(c => c.id === selectedClassId) || classes[0]

    if(error){
        toast.error("Failed to load class members. Please try again")
        return
    }
    if(!classes || classes.length === 0){
        return (
            <div className="overlay">
                <div className="card flex flex-col gap-y-2 min-w-[300px] w-[50vw] max-w-[768px] bg-white">
                    <header className="flex flex-row items-center pt-4 pb-2 px-4 text-3xl bg-primary text-white">
                        Invite to Study Group
                    </header>
                    <div className="flex flex-row p-4 gap-x-2">
                        <TbFaceIdError className="text-primary text-5xl"/>
                        <p>
                            {`You're not in any classes.`} <br/>
                            Join a class to invite members to your study group.
                        </p>
                    </div>
                    <div className="flex flex-row justify-end px-2">
                        <button className="form-btn py-1 px-4 bg-primary text-white" onClick={() => setInvitingGroup(false)}>Close</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="overlay">
            <div className="card flex flex-col gap-y-2 min-w-[300px] w-[50vw] max-w-[768px] bg-white">
                <header className="flex flex-row items-center pt-4 pb-2 px-4 text-3xl bg-primary text-white">
                    Invite to Study Group
                </header>
                <div className="flex flex-col p-4 gap-y-2">
                    <div className="flex flex-col py-2">
                        <label htmlFor="name">
                            <h3 className="m-0">Choose Class: </h3>
                        </label>
                        <select 
                            id="name"
                            className="form-input border-1 border-primary" value={selectedClassId || ''} 
                            onChange={(e) => setSelectedClassId(parseInt(e.target.value))}
                        >
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <InviteMembersList
                        studyGroupId={id}
                        classMembers={selectedClass.members}
                    />
                </div>
                <div className="form-btn-toolbar pt-0 px-4 pb-8">
                    <button className="form-btn py-1 px-4 bg-primary text-white border-0" onClick={() => setInvitingGroup(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}