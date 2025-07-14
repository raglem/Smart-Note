"use client"

import { HiMiniDocumentDuplicate } from "react-icons/hi2"

export default function DuplicateCode({ code }: { code: string}){
    const handleDuplicate = () => {
        window.navigator.clipboard.writeText(code)
    }
    return (
        <div className="flex items-end gap-x-2">
            <span>{ code }</span>
            <HiMiniDocumentDuplicate onClick={handleDuplicate} className="icon-responsive text-4xl text-primary"/>
        </div>
    )
}