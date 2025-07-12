"use client"

import { useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { FilePreviewType } from "../../../types";
import DeleteConfirmation from "../Class/DeleteConfirmation";

export default function RemoveFile({ id, file } : { id: string,file: FilePreviewType }){
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
    const handleFileDelete = () => {
        // TODO: Delete File
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
                <CiCircleRemove className="h-1/2 w-1/2 icon-responsive"/>
            </div>
        </>
    )
}