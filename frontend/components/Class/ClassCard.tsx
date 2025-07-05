import Link from "next/link";

import FilePreview from "../FilePreview";
import FileAdd from "../FileAdd";
import { IoPeopleSharp } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import { FilePreviewType } from "../../types";

export default function ClassCard({ params }: { 
    params: { 
        id: string,
        name: string,
        course_number: string,
        join_code: string,
        number_of_members: number,
        number_of_notes: number,
        latest_notes: FilePreviewType[],
    }
}){
    return (
        <div className="card flex flex-col py-2 gap-y-4">
            <header className="flex flex-row justify-between items-center p-2 text-3xl border-b-1 border-b-black">
                <div className="flex flex-row">
                    { params.name} | { params.course_number}
                </div>
                <div className="flex flex-row items-center">
                    { params.join_code}
                    <HiMiniDocumentDuplicate />
                </div>
            </header>
            <div className="flex flex-col px-4 gap-y-2 text-2xl">
                <h2>Latest Notes</h2>
                <div className="grid grid-cols-2 gap-4 h-[200px]">
                    { params.latest_notes.slice(0, 2).map((note, i) => (
                        <FilePreview key={i} params={note} />
                    ))}
                    { params.latest_notes.length < 2 && 
                        <FileAdd params={{ id: params.id, name: params.name, section: "Class" }}>
                        </FileAdd>
                    }
                </div>
                <div className="flex flex-row justify-around items-center">
                    <div className="flex flex-row items-center gap-x-2">
                        <IoPeopleSharp />
                        { params.number_of_members}
                    </div>
                    <div className="flex flex-row items-center gap-x-2">
                        <LuNotebookPen />
                        { params.number_of_notes}
                    </div>
                </div>
            </div>
            <div className="flex flex-row w-full justify-end px-2">
                <Link href={`/classes/${params.id}`} className="flex justify-end w-full">
                    <button className="min-w-[30%] max-w-[600px] py-1 px-2 bg-black text-white border rounded-md hover:cursor-pointer hover:opacity-80">
                        Open
                    </button>
                </Link>
            </div>
        </div>
    )
}