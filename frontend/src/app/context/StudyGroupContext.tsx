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

export const StudyGroupProvider = ({ children }: { children: React.ReactNode }) => {
    const [studyGroups, setStudyGroups] = useState<StudyGroupType[]>([
        {
            id: "1",
            name: "Math Study Group",
            dateTime: new Date(),
            visibility: "Public",
            members: [
                { member: { id: "m1", name: "Alice" }, status: "Joined" },
                { member: { id: "m2", name: "Bob" }, status: "Invited" }
            ]
        },
        {
            id: "2",
            name: "Science Study Group",
            dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            visibility: "Private",
            members: [
                { member: { id: "m3", name: "Carol" }, status: "Joined" },
                { member: { id: "m4", name: "David" }, status: "Invited" }
            ]
        },
        {
            id: "3",
            name: "Math Study Group",
            dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
            visibility: "Public",
            members: [
                { member: { id: "m1", name: "Alice" }, status: "Joined" },
                { member: { id: "m2", name: "Bob" }, status: "Invited" }
            ]
        },
        {
            id: "4",
            name: "Science Study Group",
            dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
            visibility: "Private",
            members: [
                { member: { id: "m3", name: "Carol" }, status: "Joined" },
                { member: { id: "m4", name: "David" }, status: "Invited" }
            ]
        },
        {
            id: "5",
            name: "Math Study Group",
            dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
            visibility: "Public",
            members: [
                { member: { id: "m1", name: "Alice" }, status: "Joined" },
                { member: { id: "m2", name: "Bob" }, status: "Invited" }
            ]
        },
        {
            id: "6",
            name: "Science Study Group",
            dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
            visibility: "Private",
            members: [
                { member: { id: "m3", name: "Carol" }, status: "Joined" },
                { member: { id: "m4", name: "David" }, status: "Invited" }
            ]
        }
    ]);
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
