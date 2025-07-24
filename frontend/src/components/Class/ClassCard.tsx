import Link from "next/link";

import FilePreview from "../File/FilePreview";
import FileAdd from "../File/FileAdd";
import { IoPeopleSharp } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import { FilePreviewType } from "../../types";
import DuplicateCode from "./DuplicateCode";
import { ClassType } from "@/types/Sections";

export default function ClassCard({ classItem }: { classItem: ClassType }){
    return (
        <div className="card flex flex-col justify-between py-2 gap-y-4">
            <header className="flex flex-row justify-between items-center p-2 text-3xl border-b-1 border-b-black">
                <div className="flex flex-row">
                    { classItem.name } { classItem.course_number && `| ${classItem.course_number}`}
                </div>
                <DuplicateCode code={classItem.join_code} />
            </header>
            <div className="flex flex-col px-4 gap-y-2 text-2xl">
                <h2>Latest Notes</h2>
                <div className="grid grid-cols-2 gap-4">
                    {/* { classItem.latest_files.map((note, i) => (
                        <FilePreview key={i} file={note.file} />
                    ))} */}
                    { classItem.number_of_notes < 2 && 
                        <FileAdd section_id={classItem.id} section="Class">
                        </FileAdd>
                    }
                </div>
                <div className="flex flex-row justify-around items-center">
                    <div className="flex flex-row items-center gap-x-2">
                        <IoPeopleSharp />
                        { classItem.members.length}
                    </div>
                    <div className="flex flex-row items-center gap-x-2">
                        <LuNotebookPen />
                        { classItem.number_of_notes}
                    </div>
                </div>
            </div>
            <div className="flex flex-row w-full justify-end px-2">
                <Link href={`/classes/${classItem.id}`} className="flex justify-end w-full">
                    <button className="min-w-[30%] max-w-[600px] py-1 px-2 bg-black text-white border rounded-md hover:cursor-pointer hover:opacity-80">
                        Open
                    </button>
                </Link>
            </div>
        </div>
    )
}