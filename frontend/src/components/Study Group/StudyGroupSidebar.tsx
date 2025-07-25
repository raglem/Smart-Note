"use client"

import { useContext, useEffect, useRef } from "react";
import { StudyGroupType } from "@/types";
import { StudyGroupCard } from "./StudyGroupCard"
import { StudyGroupContext } from "@/app/context/StudyGroupContext";
import { MdCloseFullscreen } from "react-icons/md";

export default function StudyGroupSidebar() {
    const { studyGroups, selectedStudyGroup,showSidebar, setShowSidebar } = useContext(StudyGroupContext);

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
            className={`transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'} absolute flex flex-col h-full w-[250px] box-sizing p-4 gap-y-4 bg-secondary border-r-1 border-r-primary overflow-y-auto`}
            ref={sidebarRef}
        >
            <header className="flex flex-row justify-between items-center">
                <h1>My Groups</h1>
                <MdCloseFullscreen className="text-3xl text-primary icon-responsive" onClick={() => setShowSidebar(false)} />
            </header>
            <ul className="flex flex-col w-full items-center gap-y-4">
                {studyGroups.map(group => (
                    <div ref={el => { studyGroupRefs.current[group.id] = el }} key={group.id}>
                        <StudyGroupCard group={group} />
                    </div>
                ))}
            </ul>
        </div>
    )
}