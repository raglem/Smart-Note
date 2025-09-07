"use client"

import { createContext, useEffect, useState } from "react";
import { StudyGroupType } from "../../types";

export const StudyGroupContext = createContext({} as StudyGroupContextType);

export type StudyGroupContextType = {
    studyGroups: StudyGroupType[]
    setStudyGroups: React.Dispatch<React.SetStateAction<StudyGroupType[]>>
    loadingStudyGroups: boolean,
    setLoadingStudyGroups: React.Dispatch<React.SetStateAction<boolean>>
    selectedStudyGroup: StudyGroupType | null
    showSidebar: boolean
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedStudyGroup: React.Dispatch<React.SetStateAction<StudyGroupType | null>>
    sidebarMode: "My Groups" | "Invites"
    setSidebarMode: React.Dispatch<React.SetStateAction<"My Groups" | "Invites">>,
    creatingGroup: boolean
    setCreatingGroup: React.Dispatch<React.SetStateAction<boolean>>
    invitingGroup: boolean
    setInvitingGroup: React.Dispatch<React.SetStateAction<boolean>>
    managingGroup: boolean
    setManagingGroup: React.Dispatch<React.SetStateAction<boolean>>
}

export const StudyGroupProvider = ({ children, initialStudyGroups }: { children: React.ReactNode, initialStudyGroups: StudyGroupType[] }) => {
    const [studyGroups, setStudyGroups] = useState<StudyGroupType[]>(initialStudyGroups);
    const [loadingStudyGroups, setLoadingStudyGroups] = useState<boolean>(true)
    const [selectedStudyGroup, setSelectedStudyGroup] = useState<StudyGroupType | null>(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [sidebarMode, setSidebarMode] = useState<"My Groups" | "Invites">("My Groups")
    const [creatingGroup, setCreatingGroup] = useState(false);
    const [invitingGroup, setInvitingGroup] = useState(false);
    const [managingGroup, setManagingGroup] = useState(false);

    // Ensure studyGroups is properly updated when the parent passes a new value for initialStudyGroups into the provider
    useEffect(() => {
        setStudyGroups(initialStudyGroups)
      }, [initialStudyGroups])

    return (
        <StudyGroupContext.Provider
            value={{
                studyGroups,
                setStudyGroups,
                loadingStudyGroups, 
                setLoadingStudyGroups,
                selectedStudyGroup,
                setSelectedStudyGroup,
                showSidebar,
                setShowSidebar,
                sidebarMode,
                setSidebarMode,
                creatingGroup,
                setCreatingGroup,
                invitingGroup,
                setInvitingGroup,
                managingGroup,
                setManagingGroup
            }}
        >
            {children}
        </StudyGroupContext.Provider>
    );
};
