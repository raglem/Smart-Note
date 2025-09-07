"use client"

import { useContext, useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { FileType } from "../../types";
import DeleteConfirmation from "../Class/DeleteConfirmation";
import api from "@/utils/api";
import { ClassContext } from "@/app/context/ClassContext";
import { toast } from "react-toastify";

export default function RemoveFile({ file } : { file: FileType }){
    const { classFields, setClassFields, units, setUnits } = useContext(ClassContext)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
    const removeFileFromClassContext = (id: number) => {
        const classFileIndex = classFields.files.findIndex(f => f.id === id)
        if(classFileIndex !== -1){
            setClassFields((prev) => ({
                ...prev,
                files: prev.files.filter((f: { id: number }) => f.id !== id)
            }));
            return
        }
        for(const unit of units){
            const unitFileIndex = unit.files.findIndex(file => file.id === id)
            if(unitFileIndex !== -1){
                setUnits((prev) => prev.map(u => u.id !== unit.id ? u : {
                    ...u,
                    files: u.files.filter(f => f.id !== id)
                }))
                return
            }
            for (const subunit of unit.subunits){
                const subunitFileIndex = subunit.files.findIndex(file => file.id === id);
                if (subunitFileIndex !== -1) {
                    setUnits((prev) => prev.map(u => u.id !== unit.id ? u : {
                        ...u,
                        subunits: u.subunits.map(su => su.id !== subunit.id ? su : {
                            ...su,
                            files: su.files.filter(f => f.id !== id)
                        })
                    }));
                    return;
                }
            }
        }
    }
    const handleFileDelete = async () => {
        try{
            await api.delete(`/classes/files/${file.id}/`)
            toast.success(`File ${file.name} deleted successfully`)
            removeFileFromClassContext(file.id)
        }
        catch(err){
            toast.error(`Failed to delete file ${file.name}`)
            console.error(err)
        }
        setShowDeleteConfirmation(false)
    }
    return (<>
            { showDeleteConfirmation && <DeleteConfirmation
                deletionType="File"
                name={file.name}
                remove={handleFileDelete}
                close={() => setShowDeleteConfirmation(false)}
            /> }
            <div onClick={() => setShowDeleteConfirmation(true)} className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center hover:cursor-pointer bg-black/20">
                <CiCircleRemove className="h-1/2 w-1/2 icon-responsive text-primary"/>
            </div>
        </>
    )
}