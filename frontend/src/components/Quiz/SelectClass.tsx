"use client"

import { useEffect, useState } from "react";
import { ClassType } from "@/types/Sections";
import useClassesStore from "@/stores/classesStore";
import { CiCircleRemove } from "react-icons/ci";

export default function SelectClass({ setSelected }: {  setSelected: React.Dispatch<React.SetStateAction<ClassType | null>> }){
    const [classQuery, setClassQuery] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false)

    const classes = useClassesStore(state => state.classes)
    const loadingClasses = useClassesStore(state => state.isLoading)
    const fetchClasses = useClassesStore(state => state.fetchClasses)
    useEffect(() => {
        fetchClasses()
    }, [fetchClasses])
    const [filteredOptions, setFilteredOptions] = useState<ClassType[]>(classes)

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target?.closest('#class-input-wrapper')) {
                setIsFocused(false);
            }
        };
    
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    useEffect(() => {
        if(classQuery.length === 0){
            setFilteredOptions(classes)
            return
        }
        setFilteredOptions(classes.filter(option => option.name.trim().toLowerCase().includes(classQuery.trim().toLowerCase())))
    }, [classQuery, classes])

    const handleSelection = (option: ClassType) => {
        setSelected(option)
        setClassQuery(option.name)
        setIsFocused(false)
    }

    if (loadingClasses) return (
        <div className="flex flex-row items-center gap-x-2 border-1 border-primary p-2 w-full animate-pulse">
            Loading Classes...
        </div>
    )

    return (
        <div id="class-input-wrapper" className="flex flex-col gap-y-2">
            <div className="flex flex-row items-center border-1 border-primary p-2">
                <input 
                    type="text" className="outline-none flex-1"
                    value={classQuery} onChange={(e) => setClassQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                {classQuery.length > 0 && <CiCircleRemove className="icon-responsive text-gray-500 text-2xl" onClick={() => setClassQuery("")}/>}
            </div>
            {isFocused && <div className="flex flex-col border-1 border-primary rounded-md bg-white max-h-[220px] overflow-auto">
                {filteredOptions.length > 0 && filteredOptions.map((option: ClassType) => (
                    <option 
                        key={option.id} className="flex flex-row items-center min-h-fit w-full gap-x-2 p-2 border-b-1 border-b-primary last-of-type:border-none hover:cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelection(option)}
                    >
                        {option.name}
                    </option>
                ))}
                {filteredOptions.length === 0 && <div className="flex p-2 border-primary rounded-md bg-white">
                    No Classes
                </div>}
            </div>}
        </div>
    )
}