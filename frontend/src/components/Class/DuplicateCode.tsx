"use client"

import { HiMiniDocumentDuplicate } from "react-icons/hi2"
import { toast } from "react-toastify"

export default function DuplicateCode({ code }: { code: string}){
    const handleDuplicate = () => {
        window.navigator.clipboard.writeText(code)
        toast.success(`${code} copied to clipboard`)
    }
    return (
        <div className="flex items-center gap-x-2 text-2xl md:text-3xl" onClick={handleDuplicate} >
            <span>{ code }</span>
            <HiMiniDocumentDuplicate className="icon-responsive text-primary"/>
        </div>
    )
}