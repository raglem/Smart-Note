"use client"

import { createContext, useState } from "react";
import { StudyGroupType } from "../../types";

export const StudyGroupContext = createContext({} as StudyGroupContextType);

export type StudyGroupContextType = {
    studyGroups: StudyGroupType[]
    setStudyGroups: React.Dispatch<React.SetStateAction<StudyGroupType[]>>
    selectedStudyGroup: StudyGroupType | null
    showSidebar: boolean
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedStudyGroup: React.Dispatch<React.SetStateAction<StudyGroupType | null>>
    creatingGroup: boolean
    setCreatingGroup: React.Dispatch<React.SetStateAction<boolean>>
    invitingGroup: boolean
    setInvitingGroup: React.Dispatch<React.SetStateAction<boolean>>
    managingGroup: boolean
    setManagingGroup: React.Dispatch<React.SetStateAction<boolean>>
}

export const StudyGroupProvider = ({ children, initialStudyGroups }: { children: React.ReactNode, initialStudyGroups: StudyGroupType[] }) => {
    const [studyGroups, setStudyGroups] = useState<StudyGroupType[]>(initialStudyGroups);
    const [selectedStudyGroup, setSelectedStudyGroup] = useState<StudyGroupType | null>(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [creatingGroup, setCreatingGroup] = useState(false);
    const [invitingGroup, setInvitingGroup] = useState(false);
    const [managingGroup, setManagingGroup] = useState(false);

    return (
        <StudyGroupContext.Provider
            value={{
                studyGroups,
                setStudyGroups,
                selectedStudyGroup,
                setSelectedStudyGroup,
                showSidebar,
                setShowSidebar,
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
