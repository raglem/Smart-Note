"use client"

import { createContext, useState } from "react";
import api from "@/utils/api";
import { UnitType } from "../../types/Sections";
import { FileType, SimpleMemberType } from "@/types";

export const ClassContext = createContext({} as ClassContextType);

type ClassFields = {
    id: number,
    name: string,
    course_number?: string,
    join_code: string,
    owner: SimpleMemberType,
    members: SimpleMemberType[],
    files: FileType[]
}

export type ClassContextType = {
    classFields: ClassFields,
    setClassFields: React.Dispatch<React.SetStateAction<ClassFields>>,
    addMode: boolean;
    setAddMode: React.Dispatch<React.SetStateAction<boolean>>;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    units: UnitType[];
    setUnits: React.Dispatch<React.SetStateAction<UnitType[]>>;
    draggingUnit: boolean;
    setDraggingUnit: React.Dispatch<React.SetStateAction<boolean>>;
    draggingSubunit: boolean;
    setDraggingSubunit: React.Dispatch<React.SetStateAction<boolean>>;
    handleSave: () => Promise<void>
};

export const ClassContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [classFields, setClassFields] = useState<ClassFields>({
        id: -1,
        name: "",
        join_code: "",
        owner: {
            id: -1,
            member_id: -1,
            name: ""
        },
        members: [],
        files: [],
    })
    const [addMode, setAddMode] = useState<boolean>(false)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [units, setUnits] = useState<UnitType[]>([])
    const [draggingUnit, setDraggingUnit] = useState<boolean>(false)
    const [draggingSubunit, setDraggingSubunit] = useState<boolean>(false)
    const handleSave = async () => {
        const handleUnitSubunitOrderValidation = () => {
            return units.map((unit, i) => {
                const formattedSubunits = unit.subunits.map((subunit, i) => {
                    return {
                        ...subunit, 
                        order: i+1
                    }
                })
                return {
                    ...unit, 
                    order: i+1,
                    subunits: formattedSubunits
                }
            })
        }
        // Validate order of units and subunits
        const formattedUnits = handleUnitSubunitOrderValidation()
        const body = {
            ...classFields,
            units: formattedUnits
        }

        try{
            const res = await api.put(`/classes/${body.id}/`, body)
            const data = res.data
            
            // Reset context
            setClassFields({
                id: data.id,
                name: data.name,
                course_number: data.course_number,
                join_code: data.join_code,
                owner: data.owner,
                members: data.members,
                files: data.files
            })
            setUnits(data.units.sort((a: UnitType, b: UnitType) => a.order - b.order))
        }
        catch(err){
            console.error(err)
        }
    }

    return <ClassContext.Provider value={{
        classFields,
        setClassFields,
        addMode,
        setAddMode,
        editMode,
        setEditMode,
        units,
        setUnits,
        draggingUnit,
        setDraggingUnit,
        draggingSubunit,
        setDraggingSubunit,
        handleSave
    }}>
        { children }
    </ClassContext.Provider>
}

