"use client"

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { StudyGroupType } from "@/types";
import { StudyGroupCard } from "./StudyGroupCard"
import { StudyGroupContext } from "@/app/context/StudyGroupContext";
import { MdCloseFullscreen } from "react-icons/md";
import { BiCaretLeft, BiCaretRight } from "react-icons/bi";
import { StudyGroupInviteCard } from "./StudyGroupInviteCard";
import useMemberStore from "@/stores/memberStore";
import LoadingSpinner from "../LoadingSpinner";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { StudyGroupDateContext } from "@/app/context/StudyGroupDateContext";

export default function StudyGroupSidebar() {
    // Retrieve member data from MemberStore and retrieve study groups context
    const member = useMemberStore((state) => state.member)
    const fetchMember = useMemberStore((state) => state.fetchMember)

    // Retrieve study group context to change all study group components
    const 
    { 
        studyGroups, loadingStudyGroups, sidebarMode, setSidebarMode,
        selectedStudyGroup, setSelectedStudyGroup,
        showSidebar, setShowSidebar 
    } = useContext(StudyGroupContext);
    const { setMonth, setYear } = useContext(StudyGroupDateContext)

    // Fetch member data if not already available
    const loadingMember = useMemberStore((state) => state.isLoading)
    useEffect(() => {
        if(!member){
            fetchMember()
        }
    }, [])

    // Differentiate between joined and invited study groups (joined study groups are groups users have already approved)
    // Additionally, only show groups in the sidebar that are upcoming
    const joinedStudyGroups = useMemo(() => {
        if(!member) return []
        return studyGroups.filter((sg: StudyGroupType) => 
            sg.members.some(sgMember => sgMember.member.id === member.id && sgMember.status === "Joined") &&
            new Date(sg.datetime) > new Date()
        );
    }, [studyGroups, member])
    const invitedStudyGroups  = useMemo(() => {
        if(!member) return []
        return studyGroups.filter((sg: StudyGroupType) => 
            sg.members.some(sgMember => sgMember.member.id === member.id && sgMember.status === "Invited") &&
            new Date(sg.datetime) > new Date()
        );
    }, [studyGroups, member])

    // Create refs for each study group card to scroll to the selected one
    const studyGroupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const sidebarRef = useRef(null)

    // Scroll to the selected study group
    useEffect(() => {
        if(!selectedStudyGroup) return

        const el = studyGroupRefs.current[selectedStudyGroup?.id];
        const container: HTMLDivElement | any = sidebarRef.current;
        if (el && container && container instanceof HTMLDivElement) {
            const offsetTop: number = el.offsetTop;
            container.scrollTo({
                top: offsetTop - 10,
                behavior: 'smooth',
            });
        }
    }, [selectedStudyGroup]);

    // Reassign the refs when study groups change
    useEffect(() => {
        studyGroups.forEach((sg) => {
            if (!studyGroupRefs.current[sg.id]) {
                studyGroupRefs.current[sg.id] = null;
            }
        });
    }, [studyGroups])

    // Change the selected study group and change to the right month
    const focusStudyGroup = (group: StudyGroupType) => {
        setSelectedStudyGroup(group)
        const studyGroupDate = new Date(group.datetime)
        const month = studyGroupDate.getMonth()
        const year = studyGroupDate.getFullYear()
        setMonth(month)
        setYear(year)
    }

    if(loadingMember || loadingStudyGroups) {
        return (
            <div
                className={`transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'} absolute flex flex-col h-full w-[250px] justify-center items-center p-4 gap-y-4 bg-gray-100 border-r-1 border-r-primary overflow-y-auto`}
                ref={sidebarRef}
            >
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div
            className={`transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'} absolute flex flex-col h-full w-[250px] p-4 gap-y-4 bg-gray-100 border-r-1 border-r-primary overflow-y-auto`}
            ref={sidebarRef}
        >
            <header className="flex flex-row justify-between items-center">
                <h1>{ sidebarMode }</h1>
                <MdCloseFullscreen className="text-3xl text-primary icon-responsive" onClick={() => setShowSidebar(false)} />
            </header>
            {sidebarMode === "My Groups" && <ul className="flex flex-col h-full w-full items-center gap-y-4">
                {joinedStudyGroups.map(group => (
                    <div 
                        className="cursor-pointer"
                        ref={el => { studyGroupRefs.current[group.id] = el }} 
                        onClick={() => focusStudyGroup(group)} key={group.id}>
                        <StudyGroupCard group={group} />
                    </div>
                ))}
                {joinedStudyGroups.length === 0 && <div className="flex flex-col justify-center items-center gap-y-4 h-full">
                        <IoMdCheckmarkCircleOutline className="text-green-500 text-5xl"/>
                        <div className="flex flex-col items-center gap-y-2">
                            <p className="text-lg text-primary text-center font-bold">You're all caught up.</p>
                            <p className="text-md text-primary text-center">No future study groups planned.</p>
                        </div>
                    </div>
                }
            </ul>}
            {sidebarMode === "Invites" && <ul className="flex flex-col h-full w-full items-center gap-y-4">
                {invitedStudyGroups.map(group => (
                    <div ref={el => { studyGroupRefs.current[group.id] = el }} key={group.id}>
                        <StudyGroupInviteCard group={group} />
                    </div>
                ))}
                {invitedStudyGroups.length === 0 && <div className="flex flex-col justify-center items-center gap-y-4 h-full">
                        <IoMdCheckmarkCircleOutline className="text-green-500 text-5xl"/>
                        <div className="flex flex-col items-center gap-y-2">
                            <p className="text-lg text-primary font-bold">You're all caught up.</p>
                            <p className="text-md text-primary">No pending invites.</p>
                        </div>
                    </div>
                }
            </ul>}
            <footer className="flex flex-row justify-center items-center w-full gap-x-4 absolute left-0 bottom-0 h-[30px] pb-4 border-box">
                <BiCaretLeft className="icon-responsive text-primary text-3xl" onClick={() => setSidebarMode("My Groups")}/>
                <BiCaretRight className="icon-responsive text-primary text-3xl" onClick={() => setSidebarMode("Invites")}/>
            </footer>
        </div>
    )
}