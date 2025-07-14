"use client"
import { useState } from "react";
import { FilePreviewType, SectionEnumType } from "../../types";
import { FaFileUpload } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import FilePreview from "./FilePreview";

export default function FileAdd({ section_id, section, close } : { section_id: string, section: SectionEnumType, close: () => void }){
    const [file, setFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<FilePreviewType|null>(null)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return
        
        // Set file for api upload
        setFile(e.target.files[0])

        // Create file preview
        setFilePreview({
            name: e.target.files[0].name,
            previewUrl: URL.createObjectURL(e.target.files[0])
        })
    }
    const handleFileRemoval = () => {
        setFile(null)
        setFilePreview(null)
    }
    const handleFileAdd = () => {
        // TODO: Add file
        close()
    }
    return (
        <div className="overlay">
            <div className="card flex flex-col py-4 gap-y-2 min-w-[300px] w-[50vw] max-w-[768px] bg-secondary">
                <header className="flex flex-row items-center px-2 text-3xl border-b-1 border-b-primary">Add File</header>
                { !filePreview ? (
                    <label htmlFor="file-input" className="flex h-[200px] w-full justify-center items-center">
                        <FaFileUpload className="icon-responsive text-8xl text-primary" />
                        <input 
                            type="file" id="file-input" 
                            className="opacity-0 absolute top-0 left-0 right-0 bottom-0 -z-1"
                            onChange={handleFileChange}
                        /> 
                    </label>
                ) : (
                    <FilePreview file={filePreview} />
                )}
                { !file ? (
                    <div className="form-btn-toolbar justify-end px-2">
                        <button className="form-btn bg-primary text-white">Add File</button>
                        <button onClick={close} className="form-btn bg-secondary text-primary">Cancel</button>
                    </div>
                    
                ): (
                    <div className="form-btn-toolbar justify-between px-2">
                        <div className="flex flex-row items-center">
                            <label htmlFor="file-input" className="relative">
                                <FaFileUpload className="text-4xl text-primary icon-responsive" />
                                <input 
                                    type="file" id="file-input" 
                                    className="opacity-0 absolute top-0 left-0 right-0 bottom-0 -z-1"
                                    onChange={handleFileChange}
                                /> 
                            </label>
                            <MdDeleteForever className="icon-responsive text-5xl text-primary" onClick={handleFileRemoval} />
                        </div>
                        <div className="flex flex-row items-center gap-x-2">
                            <button className="form-btn bg-primary text-white">Add File</button>
                            <button onClick={close} className="form-btn bg-secondary text-primary">Cancel</button>
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    )
}