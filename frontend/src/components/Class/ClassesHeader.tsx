"use client"

import { useState } from "react"
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";
import AddClass from "./AddClass"

export default function ClassesHeader(){
    const [showAddClass, setShowAddClass] = useState<boolean>(false)
    const handleAdd = () => {
        setShowAddClass(true)
    }
    return (
        <>
            {showAddClass && <AddClass close={() => setShowAddClass(false)} />}
            <header className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-x-4">
                    <h1>Classes</h1>
                    {!showAddClass ? <IoMdAddCircleOutline 
                        onClick={handleAdd}
                        className="icon-responsive text-primary text-4xl"
                        /> : <IoMdAddCircle 
                        className="icon-responsive text-primary text-4xl"
                    />}
                    </div>
                <div className="input-wrapper">
                    <input type="text" placeholder="Enter Class ID" className="p-2 outline-none"/>
                    <button className="h-full box-border p-2 bg-black text-white border rounded-md">
                        Join
                    </button>
                </div>
            </header>
        </>
    )
}