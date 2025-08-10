"use client"

import { useEffect, useRef, useState } from "react"
import { SimpleMemberType } from "@/types"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { IoAddCircle, IoRemoveCircleOutline } from "react-icons/io5"
import { BiCaretDown, BiCaretUp } from "react-icons/bi"
import { UnitType } from "@/types/Sections"
import { toast } from "react-toastify"
import api from "@/utils/api"
import LoadingSpinner from "../LoadingSpinner"

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
    const [matchingMembers, setMatchingMembers] = useState<SimpleMemberType[]>([])
    const [showAddedMembers, setShowAddedMembers] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    // Fetch all the members
    useEffect(() => {
        async function searchMembers(){
            if(formattedMemberQuery.length < 3){
                return
            }
            setLoading(true)
            try{
                const res = await api.get(`/users/members/?search=${memberQuery}`)
                const data = res.data as SimpleMemberType[]

                const formattedMembers: SimpleMemberType[] = data.map((m: SimpleMemberType) => ({
                    id: m.id,
                    member_id: m.member_id,
                    name: m.name
                })).sort((a: SimpleMemberType, b: SimpleMemberType) => a.name.localeCompare(b.name))

                setMatchingMembers(formattedMembers)
            }
            catch(err){
                toast.error("Failed to search for members")
            }
            finally{
                setLoading(false)
            }
            
        }
       searchMembers()
    }, [formattedMemberQuery])

    const handleAddMember = (m: SimpleMemberType) => {
        if(addedMembers.find(addedMember => addedMember.id === m.id)){
            toast.error(`${m.name} is already a member`)
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
            {loading && <div className="flex flex-col justify-center items-center w-full h-[210px] row-gap-2">
                <LoadingSpinner />
                <p className="text-primary">Searching for members...</p>    
            </div>}
            {!loading && <ol className="flex flex-col max-h-[210px] border-1 border-y-primary rounded-sm overflow-auto">
                { formattedMemberQuery.length > 3 && matchingMembers.map((m) => (
                    <li className="flex flex-row justify-between items-center p-2 not-last-of-type:border-b-1 border-b-primary hover:cursor-pointer" key={m.id} onClick={() => handleAddMember(m)}>
                        <div className="flex flex-row justify-between items-center gap-x-2">
                            { m.name }
                        </div>
                        { !addedMembers.find(addedMember => addedMember.id === m.id) ?
                            <IoAddCircle className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-primary"/> :
                            <IoIosCheckmarkCircle className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-green-500"/> 
                        }
                    </li>
                ))}
                { formattedMemberQuery.length > 3 && matchingMembers.length === 0 &&
                    <li className="flex flex-row justify-center p-2">
                        No Members Found
                    </li>
                }
                { formattedMemberQuery.length < 3 && 
                    <li className="flex flex-row justify-center p-2">
                        Please enter at least 3 characters to search for members
                    </li>
                }
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