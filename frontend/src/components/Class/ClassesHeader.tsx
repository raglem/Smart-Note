"use client"

import { useState } from "react"
import CreateClass from "./ClassCreate"
import Join from "./Join";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";

export default function ClassesHeader(){
    const [showAddClass, setShowAddClass] = useState<boolean>(false)
    const handleAdd = () => {
        setShowAddClass(true)
    }
    return (
        <>
            {showAddClass && <CreateClass close={() => setShowAddClass(false)} />}
            <header className="flex flex-col justify-between">
                <h1 className="ml-0">Classes</h1>
                <div className="flex flex-row justify-between items-center w-full">
                    <button className="flex flex-row justify-between items-center gap-x-2 rounded-md text-white bg-primary py-2 px-4 hover:cursor-pointer" onClick={handleAdd}>
                        <IoMdAddCircle />
                        New Class
                    </button>
                    <Join />
                </div>
            </header>
        </>
    )
}