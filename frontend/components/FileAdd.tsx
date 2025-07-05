"use client"
import { SectionEnumType } from "../types";
import { IoIosAddCircleOutline } from "react-icons/io";
export default function FileAdd({ params } : { params: {
    id: string,
    name: string,
    section: SectionEnumType
}}){
    const handleAdd = () => {
        console.log("Add")
    }
    return (
        <div onClick={handleAdd} className="file-wrapper">
            <div className="flex justify-center items-center h-full border-1 border-black">
                <IoIosAddCircleOutline className="h-1/2 w-1/2 icon-responsive"/>
            </div>
        </div>
    )
}