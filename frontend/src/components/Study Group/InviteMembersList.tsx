"use client"

import { useContext, useState, useEffect } from "react"
import { SimpleMemberType, StudyGroupMemberType, StudyGroupType } from "@/types"
import { StudyGroupContext } from "@/app/context/StudyGroupContext"
import LoadingSpinner from "../LoadingSpinner"
import api from "@/utils/api"

import { IoIosCheckmarkCircle, IoMdPersonAdd } from "react-icons/io"
import { FaClock } from "react-icons/fa"

export default function MembersList({ studyGroupId, classMembers }: { 
    studyGroupId: number, 
    classMembers: SimpleMemberType[],
}) {
    const { studyGroups, setStudyGroups } = useContext(StudyGroupContext)

    const sortedClassMembers = classMembers.sort((a, b) => a.name.localeCompare(b.name))
    const invitedMembers = studyGroups.find((sg: StudyGroupType) => sg.id === studyGroupId)?.members || []

    const handleInvite = async (id: number) => {
        try{
            const memberToInvite: SimpleMemberType | undefined = classMembers.find(member => member.id === id)

            // Check if the user does not exist and has not been invited already
            if(!memberToInvite || invitedMembers.find(sgMember => sgMember.member.id === id)) return

            console.log('SENDING REQUEST')

            const res = await api.post(`/study-groups/invite/${studyGroupId}/`, { id })
            console.log(res)
            const data = res.data as StudyGroupMemberType

            updateStudyGroupContextWithNewMember(data)
        }
        catch(err){
            console.error(err)
            // TODO: Alert user an error has occurred
        }
    }

    // Update the invited members in the context and study groups state
    const updateStudyGroupContextWithNewMember = (newMember: StudyGroupMemberType) => {
        const studyGroup = studyGroups.find((sg: StudyGroupType) => sg.id === studyGroupId)

        if(!studyGroup) return
        const updatedStudyGroup = {
            ...studyGroup,
            members: [...studyGroup.members, newMember]
        };
        setStudyGroups((prev) => prev.map((sg) => sg.id === studyGroup.id ? updatedStudyGroup : sg));
    }

    return (
        <ol className="flex flex-col max-h-[210px] border-1 border-y-primary rounded-sm overflow-auto">
            {classMembers.length > 0 && sortedClassMembers.map((classMember) => (
                <li className="flex flex-row justify-between items-center p-2 not-last-of-type:border-b-1 border-b-primary" key={classMember.id}>
                    <span>{classMember.name}</span>
                    {
                        !invitedMembers.find((invitedMember) => invitedMember.member.id === classMember.id) ? (
                            <IoMdPersonAdd className="icon-responsive text-primary text-xl" onClick={() => handleInvite(classMember.id)}/>
                        ) : (
                            invitedMembers.find((studyGroupMember) => studyGroupMember.member.id === classMember.id)?.status === "Joined" ? (
                                <IoIosCheckmarkCircle className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-green-500"/>
                            ) : (
                                <FaClock className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-yellow-500"/>
                            )
                        )
                    }
                </li>
            ))}
        </ol>
    )
}