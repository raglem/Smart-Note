"use client"

import Link from "next/link";
import { IoPeopleSharp } from "react-icons/io5";
import { ClassType } from "@/types/Sections";
import { toast } from "react-toastify";

export default function ClassCard({ classItem }: { classItem: ClassType }){
    const handleCopyJoinCode = () => {
        navigator.clipboard.writeText(classItem.join_code)
            .then(() => {
                toast.success(`Join code ${classItem.join_code} copied to clipboard`);
            })
    }
    return (
        <div className="card flex flex-col justify-between gap-y-4 rounded-2xl">
            <Link href={`/classes/${classItem.id}`}>
                <img 
                    className="w-full h-64 object-cover rounded-t-2xl cursor-pointer hover:opacity-80"
                    src={ classItem.image }
                    alt={`${classItem.name} Image`}
                />
            </Link>
            <header className="flex flex-row justify-between items-center p-2">
                <div className="flex flex-col w-[80%]">
                    <h1 className="text-3xl text-bold hover:underline hover:text-primary hover:cursor-pointer">
                        <Link href={`/classes/${classItem.id}`}>
                            { classItem.name } { classItem.course_number && `| ${classItem.course_number}`}
                        </Link>
                    </h1>
                    <p className="lg hover:cursor-copy" onClick={handleCopyJoinCode}>{classItem.join_code || 'Preparing join code...'}</p>
                </div>
                <div className="flex flex-row w-[20%] justify-end gap-x-4 pr-2 text-2xl">
                    <div className="flex flex-row items-center gap-x-1">
                        <IoPeopleSharp />
                        { classItem.members.length}
                    </div>
                </div>
            </header>
        </div>
    )
}