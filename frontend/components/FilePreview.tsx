"use client"

import { FilePreviewType } from "../types"

export default function FilePreview({ params } : {
    params: FilePreviewType
}){
    const handleFullPreview = () => {
        window.open(params.previewUrl, "_blank");
    }
    return (
        <div onClick={handleFullPreview} className="file-wrapper hover:cursor-pointer hover:opacity-80">
            <iframe src={params.previewUrl} className="file h-[80%]" />
            <div className="h-[20%] max-w-full border-box p-2 bg-black text-white text-sm">
                {params.name}
            </div>
        </div>
    )
}