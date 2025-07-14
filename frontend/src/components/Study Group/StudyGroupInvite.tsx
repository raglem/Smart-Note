import { use, useContext, useState } from "react";
import { StudyGroupType } from "../../types";

import { FaClock, FaPlusCircle } from "react-icons/fa";
import { IoIosCheckmarkCircle, IoMdPersonAdd } from "react-icons/io";
import { StudyGroupContext } from "@/app/context/StudyGroupContext";

export default function StudyGroupInvite({ id, name, studyGroup }: { id: string, name: string, studyGroup: StudyGroupType}) {
    // TODO: Fetch classes
    // TODO: Edge case, user has no classes
    const classes = [
        {
            id: "class1",
            name: "Mathematics 101",
            members: [
                { id: "m1", name: "Alice" },
                { id: "m2", name: "Bob" },
                { id: "m10", name: "Caleb" }
            ]
        },
        {
            id: "class2",
            name: "Physics 202",
            members: [
                { id: "m3", name: "Carol" },
                { id: "m4", name: "David" }
            ]
        },
        {
            id: "class3",
            name: "Chemistry 303",
            members: [
                { id: "m5", name: "Eve" },
                { id: "m6", name: "Frank" }
            ]
        }
    ]

    const { setInvitingGroup } = useContext(StudyGroupContext)

    const [selectedClassId, setSelectedClassId] = useState<string>(classes[0].id)
    const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0]

    const handleInvite = (id: string) => {
        // TODO: Handle invite
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
                            className="form-input" value={selectedClassId} 
                            onChange={(e) => setSelectedClassId(e.target.value)}
                        >
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <ol className="flex flex-col max-h-[210px] border-1 border-y-primary rounded-sm overflow-auto">
                        {selectedClass.members.map((classMember) => (
                            <li className="flex flex-row justify-between items-center p-2 not-last-of-type:border-b-1 border-b-primary" key={classMember.id}>
                                <span>{classMember.name}</span>
                                {
                                    !studyGroup.members.find((studyGroupMember) => studyGroupMember.member.id === classMember.id) ? (
                                        <IoMdPersonAdd className="icon-responsive text-primary text-xl" onClick={() => handleInvite(classMember.id)}/>
                                    ) : (
                                        studyGroup.members.find((studyGroupMember) => studyGroupMember.member.id === classMember.id)?.status === "Joined" ? (
                                            <IoIosCheckmarkCircle className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-green-500"/>
                                        ) : (
                                            <FaClock className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-yellow-500"/>
                                        )
                                    )
                                }
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="form-btn-toolbar p-2">
                    <button className="form-btn py-1 px-4 bg-primary text-white" onClick={() => setInvitingGroup(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}