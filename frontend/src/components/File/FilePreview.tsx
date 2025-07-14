"use client"

import { FilePreviewType } from "../../types";

export default function FilePreview({ file, children } : { 
    file: FilePreviewType, 
    children?: React.ReactNode 
}){
    const handleFullPreview = () => {
        // If children is not null (we're removing or editing a file), don't open the preview
        if(children)    return
        window.open(file.previewUrl, "_blank");
    }
    return (
        <div onClick={children ? undefined : handleFullPreview} className={`relative file-wrapper ${children ? '' : 'hover:cursor-pointer hover:opacity-80'}`}>
            <div className="relative">
                <iframe src={file.previewUrl} className="file" />
                { children }
            </div>
            <div className="flex flex-row items-center h-[28px] max-w-full border-box p-2 bg-black text-white text-sm">
                {file.name}
            </div>
        </div>
    )
}