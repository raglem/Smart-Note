"use client"

import { useEffect, useRef, useState } from "react"
import { SimpleMemberType } from "@/types"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { IoAddCircle, IoRemoveCircleOutline } from "react-icons/io5"
import { BiCaretDown, BiCaretUp } from "react-icons/bi"
import { UnitType } from "@/types/Sections"

type AddMembersProps = {
    memberQuery: string,
    setMemberQuery: (query: string) => void,
    addedMembers: SimpleMemberType[],
    setAddedMembers: (members: SimpleMemberType[]) => void,
}

export default function AddMembers({ 
    memberQuery, setMemberQuery, 
    addedMembers, setAddedMembers 
}: AddMembersProps) {
    const formattedMemberQuery = memberQuery.trim().toLowerCase()
    const members = useRef<SimpleMemberType[]>([])
    const [matchingMembers, setMatchingMembers] = useState<SimpleMemberType[]>([])
    const [showAddedMembers, setShowAddedMembers] = useState<boolean>(false)

    // Fetch all the members
    useEffect(() => {
        // TODO: Retrieve matching members
        const data = [
            { id: 1, name: "John Doe" },
            { id: 2, name: "Jane Smith" },
            { id: 3, name: "Alice Johnson" },
            { id: 4, name: "Bob Brown" }
        ].sort((a, b) => a.name.localeCompare(b.name))
        members.current = data
    }, [])

    // Update matching members when the user edits the member query
    useEffect(() => {
        setMatchingMembers(members.current.filter(m => m.name.trim().toLowerCase().includes(formattedMemberQuery)))
    }, [formattedMemberQuery])

    const handleAddMember = (m: SimpleMemberType) => {
        if(addedMembers.find(addedMember => addedMember.id === m.id)){
            // TODO: Alert user member is already added
            return
        }
        setAddedMembers([...addedMembers, m].sort((a, b) => a.name.localeCompare(b.name)))
    }
    const handleRemoveMember = (id: number) => {
        setAddedMembers(addedMembers.filter(m => m.id !== id))
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-col">
                <label htmlFor="members">
                    Members
                </label>
                <input 
                    type="text" placeholder="Search Member" id="subunit-input" className="form-input"
                    value={memberQuery} onChange={(e) => setMemberQuery(e.target.value)}
                />
            </div>
            {matchingMembers.length > 0 && <ol className="flex flex-col max-h-[210px] border-1 border-y-primary rounded-sm overflow-auto">
                {matchingMembers.map((m) => (
                    <li className="flex flex-row justify-between items-center p-2 not-last-of-type:border-b-1 border-b-primary hover:bg-primary hover:text-white" key={m.id} onClick={() => handleAddMember(m)}>
                        <div className="flex flex-row justify-between items-center gap-x-2">
                            { m.name }
                        </div>
                        { !addedMembers.find(addedMember => addedMember.id === m.id) ?
                            <IoAddCircle className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-primary"/> :
                            <IoIosCheckmarkCircle className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-green-500"/> 
                        }
                    </li>
                ))}
            </ol> }
            <div className="flex flex-col max-h-[210px] bg-gray-300 border-1 border-y-primary overflow-auto">
                <div className="flex flex-row justify-between items-center p-2 bg-primary text-white">
                    Added Members
                    {showAddedMembers ? <BiCaretUp className="icon-responsive" onClick={() => setShowAddedMembers(false)}/> : 
                        <BiCaretDown className="icon-responsive" onClick={() => setShowAddedMembers(true)}/>}
                </div>
                {showAddedMembers && (
                    <ol>
                        {addedMembers.length === 0 ? (
                            <li className="flex flex-row justify-center p-2">
                                No Members Added
                            </li>
                        ) : (
                            addedMembers.map((m) => (
                                <li className="flex flex-row justify-between items-center p-2 not-last-of-type:border-b-1" key={m.id}>
                                    <div className="flex flex-row items-center gap-x-2">
                                        { m.name }
                                    </div>
                                    <IoRemoveCircleOutline className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-primary" onClick={() => handleRemoveMember(m.id)}/> 
                                </li>
                            ))
                        )}
                    </ol>
                )}
            </div>
        </div>
    )
}