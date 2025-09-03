"use client"
import { useContext, useState } from "react";
import { FilePreviewType, FileType, SectionEnumType } from "../../types";
import { FaFileUpload } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import FilePreview from "./FilePreview";
import api from "@/utils/api";
import { ClassContext } from "@/app/context/ClassContext";
import { toast } from "react-toastify";

export default function FileAdd({ section_id, section, close } : { section_id: number, section: SectionEnumType, close: () => void }){
    const { setClassFields, units, setUnits } = useContext(ClassContext)
    const [file, setFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<FileType|null>(null)
    const [isPDF, setIsPDF] = useState<boolean>(false)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return
        
        // Set file for api upload
        setFile(e.target.files[0])

        // Create file preview
        setFilePreview({
            id: 0,
            name: e.target.files[0].name,
            file: URL.createObjectURL(e.target.files[0]),
            updated_at: (new Date).toString()
        })

        setIsPDF(e.target.files[0].name.toLowerCase().endsWith(".pdf"))
    }
    const handleFileRemoval = () => {
        setFile(null)
        setFilePreview(null)
    }
    const handleFileSave = async () => {
        if(!filePreview || !file){
            toast.error("No file selected")
            return
        }
        const fd = new FormData()
        fd.append('name', filePreview.name)
        fd.append('file', file)
        fd.append('section_id', section_id.toString())
        fd.append('section_type', section)

        try{
            const res = await api.post('/classes/files/create/', fd, {
                headers: { 'Content-Type': 'multipart/form-data'}
            })
            const data: FileType = res.data

            // Update Class Context with added file
            if(section === "Class"){
                setClassFields(prev => ({
                    ...prev,
                    files: [...prev.files, {
                        id: data.id,
                        file: data.file,
                        name: data.name,
                        updated_at: data.name
                    }].sort((a,b) => a.name.localeCompare(b.name))
                }))
            }
            else if(section === "Unit"){
                setUnits((prev) => prev.map(u => u.id !== section_id ? u : ({
                    ...u,
                    files: [...u.files, {
                        id: data.id,
                        file: data.file,
                        name: data.name,
                        updated_at: data.name
                    }].sort((a,b) => a.name.localeCompare(b.name))
                })))
            }
            else if(section === "Subunit"){
                const unitWithSubunit = units.find(u => u.subunits.find(s => s.id === section_id))
                if(!unitWithSubunit) return
                setUnits((prev) => prev.map(u => u.id !== unitWithSubunit.id ? u : ({
                    ...u,
                    subunits: u.subunits.map(s => s.id !== section_id ? s : ({
                        ...s,
                        files: [...s.files, {
                            id: data.id,
                            file: data.file,
                            name: data.name,
                            updated_at: data.name
                        }].sort((a,b) => a.name.localeCompare(b.name))
                    }))
                })))
            }
        }
        catch(err){
            console.error(err)
        }
        close()
    }
    return (
        <div className="overlay">
            <div className="card flex flex-col gap-y-2 min-w-[300px] w-[50vw] max-w-[768px] border-1 border-primary bg-white z-1">
                <header className="flex flex-row items-center pt-4 pb-2 px-4 text-3xl bg-primary text-white">Add File</header>
                <div className="flex flex-col w-full justify-center items-center">
                    { !filePreview ? (
                        <label htmlFor="file-input" className="relative flex h-[200px] w-full justify-center items-center">
                            <FaFileUpload className="icon-responsive text-8xl text-primary" />
                            <input 
                                type="file" id="file-input" 
                                className="opacity-0 absolute top-0 left-0 right-0 bottom-0 -z-1"
                                onChange={handleFileChange}
                            /> 
                        </label>
                    ) : (
                        <FilePreview file={filePreview} isPDF={isPDF} />
                    )}
                </div>
                <form>
                    { !file ? (
                        <div className="form-btn-toolbar justify-end p-4">
                            <button className="form-btn border-0 bg-primary text-white hover:cursor-not-allowed opacity-80 whitespace-nowrap">Save File</button>
                            <button onClick={close} className="form-btn border-1 border-primary text-primary bg-white cursor-pointer hover:opacity-80">Cancel</button>
                        </div>
                        
                    ): (
                        <div className="form-btn-toolbar justify-between p-4">
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
                                <button className="form-btn border-0 bg-primary text-white whitespace-nowrap cursor-pointer hover:opacity-80" onClick={handleFileSave}>Save File</button>
                                <button onClick={close} className="form-btn bg-white border-1 border-primary text-primary cursor-pointer hover:opacity-80">Cancel</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}