"use client"

import { useState } from "react"
import { ImCloudUpload } from "react-icons/im";
import { FaRegTimesCircle } from "react-icons/fa";

export default function UploadImage({ image, setImage }: 
{ 
    image: File | null, 
    setImage: React.Dispatch<React.SetStateAction<File | null>>
}){
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return
        
        // Set file for api upload
        setImage(e.target.files[0])

        // Create file preview
        setImagePreview(URL.createObjectURL(e.target.files[0]))
    }
    return (
        <div className="relative flex flex-col w-full aspect-[16/9] justify-center items-center border-1 border-primary rounded-lg hover:opacity-80">
            {!image && <label htmlFor="imageUpload" className="hover:cursor-pointer">
                <ImCloudUpload className="text-primary text-5xl" />
                <input 
                    id="imageUpload" type="file" 
                    className="absolute top-0 left-0 right-0 bottom-0 -z-1 opacity-0" 
                    onChange={handleImageUpload}
                />
            </label>}
            {image && <FaRegTimesCircle className="icon-responsive text-red-500 top-0 right-0 m-1"/>}
        </div>
    )
    
}