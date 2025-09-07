"use client"

import { useContext, useEffect, useState } from "react";

import { StudyGroupContext } from "@/app/context/StudyGroupContext";

import { FaCog, FaClock } from "react-icons/fa";
import { StudyGroupType } from "../../types";
import { IoIosCheckmarkCircle } from "react-icons/io";
import StudyGroupToolbar from "./StudyGroupToolbar";
import api from "@/utils/api";
import { toast } from "react-toastify";

export function StudyGroupInviteCard({ group }: { group: StudyGroupType }) {
    const { setStudyGroups } = useContext(StudyGroupContext);

    group.members.sort((a,b) => {
        if(a.status !== b.status){
            return a.status === "Joined" ?  -1 : 1
        }
        else{
            return a.member.name.localeCompare(b.member.name)
        }
    })

    const handleInvite = async (action: "accept" | "decline") => {
        const status = action === "accept" ? "Joined" : "Declined";
        try{
            const res = await api.post(`/study-groups/accept-decline/${group.id}/`, { status })
            const new_member_data = res.data.member
            console.log(new_member_data)

            // Handle the member declining the invite
            if(action === "decline"){
                const studyGroup = group;
                studyGroup.members = studyGroup.members.filter(member => member.member.id !== new_member_data.member.id);
                // Update the context with the modified study group
                setStudyGroups(prev => prev.map(sg => sg.id !== studyGroup.id ? sg : studyGroup));
                return;
            }

            // Handle the member accepting the invite
            const studyGroup = group;
            studyGroup.members = studyGroup.members.map(member => member.member.id !== new_member_data.member.id ? member : {
                ...new_member_data,
            });
            // Update the context with the modified study group
            setStudyGroups(prev => prev.map(sg => sg.id !== studyGroup.id ? sg : studyGroup));
        }
        catch(err){
            toast.error("Failed to respond to invite. Please try again")
            console.error(err);
        }
    }
    return (
        <>
            <div className="card flex flex-col py-2 gap-y-2 min-w-full bg-white text-primary">
                <header className="flex flex-row items-center pt-4 pb-2 px-4  gap-x-4 border-b-1 border-b-primary">
                    <h1 className={`text-${group.name.length > 15 ? "sm" : "xl"} m-0`}>{ group.name }</h1>
                    <i className="text-xs text-right">{ new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(group.datetime)) }</i>
                </header>
                <ul className="flex flex-col px-2">
                    {
                        group.members.map(current => (
                            <li className="border-b-1 border-b-primary" key={current.id}>
                                <div className="flex flex-row justify-between items-center p-2">
                                    <div>{ current.member.name }</div>
                                    { current.status === "Joined" ? <IoIosCheckmarkCircle className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-green-500"/> 
                                        : <FaClock className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-yellow-500"/>}
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <div className="flex flex-row justify-end items-center p-2 gap-x-2">
                    <button className="btn bg-primary text-white rounded-md px-2 py-1 hover:cursor-pointer hover:opacity-80" onClick={() => handleInvite("accept")}> Accept </button>
                    <button className="btn bg-white text-primary border-1 border-primary rounded-md px-2 py-1 hover:cursor-pointer hover:opacity-80" onClick={() => handleInvite("decline")}> Decline </button>
                </div>
            </div>
        </>
    )
}