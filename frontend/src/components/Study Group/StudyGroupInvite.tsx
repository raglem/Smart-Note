'use client'

import { useContext, useEffect, useState } from "react";
import useClassesStore from "@/stores/classesStore";
import { StudyGroupContext } from "@/app/context/StudyGroupContext";
import { StudyGroupType } from "../../types";
import { ClassType } from "@/types/Sections";
import LoadingSpinner from "../LoadingSpinner";

import { FaClock, FaPlusCircle } from "react-icons/fa";
import { IoIosCheckmarkCircle, IoMdPersonAdd } from "react-icons/io";
import { TbFaceIdError } from "react-icons/tb";
import InviteMembersList from "./InviteMembersList";
import { toast } from "react-toastify";

export default function StudyGroupInvite({ id, name, studyGroup }: { id: number, name: string, studyGroup: StudyGroupType}) {
    // Retrieve classes from zustand store
    const classes = useClassesStore((state) => state.classes)
    const isLoading = useClassesStore((state)=> state.isLoading)
    const error = useClassesStore((state) => state.error)
    const fetchClasses = useClassesStore((state) => state.fetchClasses)

    useEffect(() => {
        fetchClasses()
    }, [])

    const { setStudyGroups, setInvitingGroup } = useContext(StudyGroupContext)

    const [selectedClassId, setSelectedClassId] = useState<number | null>((classes && classes.length > 0) ? classes[0].id : null)
    const selectedClass: ClassType = classes.find(c => c.id === selectedClassId) || classes[0]

    if(error){
        toast.error("Failed to load class members. Please try again")
        return
    }
    if(!classes || classes.length === 0){
        return (
            <div className="overlay">
                <div className="card flex flex-col gap-y-2 py-4 min-w-[300px] w-[50vw] max-w-[768px] bg-secondary">
                    <header className="flex flex-row items-center px-2 text-3xl border-b-1 border-b-primary">
                        Invite to Study Group
                    </header>
                    <div className="flex flex-row px-2 gap-x-2">
                        <TbFaceIdError className="text-primary text-5xl"/>
                        <p>
                            You're not in any classes. <br/>
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
            <div className="card flex flex-col gap-y-2 pt-8 pb-4 min-w-[300px] w-[50vw] max-w-[768px] bg-secondary">
                <header className="flex flex-row items-center px-2 text-3xl border-b-1 border-b-primary">
                    Invite to Study Group
                </header>
                <div className="flex flex-col px-2 gap-y-2">
                    <div className="flex flex-col py-2">
                        <label htmlFor="name">
                            <h3 className="m-0">Choose Class: </h3>
                        </label>
                        <select 
                            id="name"
                            className="form-input" value={selectedClassId || ''} 
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
                <div className="form-btn-toolbar p-2">
                    <button className="form-btn py-1 px-4 bg-primary text-white" onClick={() => setInvitingGroup(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}