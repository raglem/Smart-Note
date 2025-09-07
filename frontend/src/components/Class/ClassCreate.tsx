"use client"

import { useState } from "react"
import useClassesStore from "@/stores/classesStore"
import AddMembers from "./AddMembers"
import { FilePreviewType, SimpleMemberType } from "@/types"

import api from "@/utils/api"
import checkForValidCharacters from "@/utils/checkForValidCharacters"
import { FaUpload } from "react-icons/fa6";
import { toast } from "react-toastify"
import LoadingSpinner from "../LoadingSpinner"

export default function ClassCreate({ close }: { close: () => void }){
    const [className, setClassName] = useState<string>("")
    const [courseNumber, setCourseNumber] = useState<string | null>(null)

    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<FilePreviewType | null>(null)

    const [currentMemberQuery, setCurrentMemberQuery] = useState<string>("")
    const [addedMembers, setAddedMembers] = useState<SimpleMemberType[]>([])

    const [loading, setLoading] = useState<boolean>(false)

    const addClass = useClassesStore(state => state.addClass)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files ? e.target.files[0] : null
        if(!newFile) return

        setImage(newFile)
        setImagePreview({
            name: newFile.name,
            previewUrl: URL.createObjectURL(newFile)
        })
    }

    const handleClassCreate = async () => {
        // Validate inputs
        if(className.length < 3 ){
            toast.error("Class name must be at least 3 characters long")
            return
        }
        if(!checkForValidCharacters(className)){
            toast.error("Class name contains invalid characters")
            return
        }
        if(!image){
            toast.error("Please upload a class image")
            return
        }

        const fd = new FormData()
        fd.append('name', className)
        fd.append('image', image)

        if(courseNumber !== null) fd.append('course_number', courseNumber)
        if(addedMembers.length > 0){
            addedMembers.forEach((m) => {
                fd.append('members', m.id.toString())
            })
        }

        setLoading(true)
        try{
            const res = await api.post('/classes/', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            const newClass = res.data
            addClass(newClass)
            toast.success(`Class ${fd.get('name')} created successfully`)
        }
        catch(err){
            console.error(err)
        }
        finally{
            setLoading(false)
        }
        close()
    }
    
    return (
        <div className="overlay">
            <div className="card flex flex-col gap-y-2 min-w-[300px] w-[50vw] max-w-[768px] bg-white border-1 border-primary">
                <header className="flex flex-row items-center pt-4 pb-2 px-4 text-3xl bg-primary text-white">
                    <h1>Add Class</h1>
                </header>
                <form className="flex flex-col items-stretch gap-y-4 p-4" onSubmit={(e) => {e.preventDefault()}}>
                    <div className="flex flex-row gap-x-4 items-center w-full">
                        <div className="flex flex-col justify-end h-full w-full">
                            <label htmlFor="class-name">Name</label>
                            <input 
                                type="text" placeholder="Class Name" id="class-name" required className="form-input"
                                value={className} onChange={(e) => setClassName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col justify-end h-full w-full">
                            <label htmlFor="course-number">
                                Course Number &nbsp;
                                <i>(Optional)</i>
                            </label>
                            <input 
                                type="text" placeholder="Course Number" id="course-number" className="form-input"
                                value={courseNumber || ""} onChange={(e) => setCourseNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="class-image">
                            Image
                        </label>
                        {!image &&  <label htmlFor="class-image">
                            <div className="relative flex flex-col justify-center items-center gap-y-2 w-full h-[150px] border-1 border-black rounded-md bg-white hover:cursor-pointer">
                                <FaUpload className="hover:opacity-80 hover:cursor-pointer text-5xl text-primary" />
                                <p className="text-center text-primary text-xl">Upload a class image</p>
                                <input 
                                    type="file" id="class-image" className="absolute opacity-0 h-full w-full -z-1"
                                    onChange={(e) => handleImageChange(e)}
                                />
                            </div>
                        </label>}
                        {image && imagePreview && 
                            <div className="relative flex flex-col justify-center items-center gap-y-2 w-full h-[150px] border-1 border-black rounded-md">
                                <img src={imagePreview.previewUrl} alt={imagePreview.name} className="object-cover h-full"/>
                            </div>
                        }
                    </div>
                    <AddMembers
                        memberQuery={currentMemberQuery} 
                        setMemberQuery={setCurrentMemberQuery} 
                        addedMembers={addedMembers} 
                        setAddedMembers={setAddedMembers} 
                    />
                    {loading && <div className="flex justify-center items-center w-full">
                        <LoadingSpinner />
                    </div>}
                    <div className="form-btn-toolbar">
                        <button 
                            className="form-btn border-0 bg-primary text-white"
                            onClick={handleClassCreate}
                        >
                            Create
                        </button>
                        <button 
                            type="reset" className="form-btn border-1 border-primary bg-white text-primary"
                            onClick={close}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}