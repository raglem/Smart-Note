"use client"
import { useState } from "react";
import { SectionEnumType } from "../../types";
import { IoIosAddCircleOutline } from "react-icons/io";
import FileAddForm from "./FileAddForm";
export default function FileAdd({ section_id, section } : { section_id: string, section: SectionEnumType }){
    const [showFile, setShowFile] = useState<boolean>(false)
    return (
        <>
            {showFile && <FileAddForm 
                section_id={section_id} 
                section={section}
                close={() => setShowFile(false)}
            />}
            {/* Use padding of parent container to account for the bottom name div in FilePreview and maintain same height */}
            <div className="relative py-[14px] flex justify-center items-center border-1 border-black" onClick={() => setShowFile(true)}>
                <div className="file" />
                <IoIosAddCircleOutline className="absolute h-1/2 w-1/2 icon-responsive"/>
            </div>
        </>
    )
}