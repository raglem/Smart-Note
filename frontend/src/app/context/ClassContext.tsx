"use client"

import { createContext, useState } from "react";
import api from "@/utils/api";
import axios from 'axios'
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
        id: 0,
        name: "",
        join_code: "",
        owner: {
            id: 0,
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
        // type FileCreate = {
        //     name: string,
        //     file: FileType,
        //     section_id: number,
        //     section_type: "Class" | "Unit" | "Subunit"
        // }
        // // Function to call api route to create files
        // const handleBulkFileCreation = async (new_files: FileCreate[]) => {
        //     async function fileFromPath(path: string, name: string) {
        //         const response = await fetch(path);
        //         const blob = await response.blob();
        //         const filename = path.split('/').pop();
        //         return new File([blob], name, { type: blob.type });
        //     }

        //     const fd = new FormData()
        //     for(let i=0; i<new_files.length; i++){
        //         const retrievedFile = await fileFromPath(new_files[i].file.file, file.name)
        //         fd.append(`files[${i}][name]`, new_files[i].name)
        //         fd.append(`files[${i}][file]`, retrievedFile)
        //         fd.append(`files[${i}][section_id]`, )
        //     }

        // }
        // Helper to change the order 
        // Unlike the name field of a unit or subunit which is changed at the component level, the order key is overwrriten inside the context
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
        // TODO: Handle PUT request to backend
        // Validate class fields
        if(!classFields)    return

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

