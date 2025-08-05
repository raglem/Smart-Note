"use client"

import { useContext, useEffect, useRef, useState } from "react";
import { StudyGroupType } from "@/types";
import { StudyGroupCard } from "./StudyGroupCard"
import { StudyGroupContext } from "@/app/context/StudyGroupContext";
import { MdCloseFullscreen } from "react-icons/md";
import { BiCaretLeft, BiCaretRight } from "react-icons/bi";
import { StudyGroupInviteCard } from "./StudyGroupInviteCard";

export default function StudyGroupSidebar() {
    const { studyGroups, selectedStudyGroup,showSidebar, setShowSidebar } = useContext(StudyGroupContext);

    const [currentTab, setCurrentTab] = useState<"My Groups" | "Invites">("My Groups")

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

    return (
        <div
            className={`transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'} absolute flex flex-col h-full w-[250px] p-4 gap-y-4 bg-secondary border-r-1 border-r-primary overflow-y-auto`}
            ref={sidebarRef}
        >
            <header className="flex flex-row justify-between items-center">
                <h1>{ currentTab }</h1>
                <MdCloseFullscreen className="text-3xl text-primary icon-responsive" onClick={() => setShowSidebar(false)} />
            </header>
            {currentTab === "My Groups" && <ul className="flex flex-col w-full items-center gap-y-4">
                {studyGroups.map(group => (
                    <div ref={el => { studyGroupRefs.current[group.id] = el }} key={group.id}>
                        <StudyGroupCard group={group} />
                    </div>
                ))}
            </ul>}
            {currentTab === "Invites" && <ul className="flex flex-col w-full items-center gap-y-4">
                {studyGroups.map(group => (
                    <div ref={el => { studyGroupRefs.current[group.id] = el }} key={group.id}>
                        <StudyGroupInviteCard group={group} />
                    </div>
                ))}
            </ul>}
            <footer className="flex flex-row justify-center items-center w-full gap-x-4 absolute left-0 bottom-0 h-[30px] pb-4 border-box">
                <BiCaretLeft className="icon-responsive text-primary text-3xl" onClick={() => setCurrentTab("My Groups")}/>
                <BiCaretRight className="icon-responsive text-primary text-3xl" onClick={() => setCurrentTab("Invites")}/>
            </footer>
        </div>
    )
}