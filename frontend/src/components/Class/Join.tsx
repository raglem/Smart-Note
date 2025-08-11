"use client"

import useClassesStore from "@/stores/classesStore"
import api from "@/utils/api"
import checkForValidCharacters from "@/utils/checkForValidCharacters"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import LoadingSpinner from "../LoadingSpinner"

type SearchedClass = {
    id: number
    name: string
    join_code: string
    image: string
}

export default function Join(){
    const [joinCodeQuery, setJoinCodeQuery] = useState<string>("")
    const [classes, setClasses] = useState<SearchedClass[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const currentClasses = useClassesStore(state => state.classes)
    const addClass = useClassesStore(state => state.addClass)

    useEffect(() => {
        async function searchClasses(){
            setLoading(true)
            try{
                const res = await api.get(`/classes/search/?join_code=${joinCodeQuery}`)
                const fetchedClasses: SearchedClass[] = res.data
                const filteredClasses: SearchedClass[] = fetchedClasses.filter(fetchedClasses => !currentClasses.some(currentClass => currentClass.id === fetchedClasses.id))
                setClasses(filteredClasses)
            }
            catch(err){
                toast.error(`Classes with join code ${joinCodeQuery} could not be retrieved`)
            }
            finally{
                setLoading(false)
            }
        }

        if(joinCodeQuery.length === 0){
            return
        }
        searchClasses()
    }, [joinCodeQuery])

    const handleJoin = async (joinCode: string) => {
        if(joinCodeQuery.length !== 8){
            toast.error('Join code must be 8 characters long')
        }
        if(!checkForValidCharacters(joinCodeQuery)){
            toast.error('Join code can only consist of alphanumeric characters')
        }
        if(classes.length !== 1){
            toast.error(`No class exists with join code ${joinCode}`)
        }
        try{
            const res = await api.post(`/classes/join/${joinCode}/`)
            const newClass = res.data
            addClass(newClass)
            toast.success(`Successfully joined class ${newClass.name}`)
        }
        catch(err){
            const matchingClass = classes.find(c => c.join_code === joinCode)
            if(!matchingClass)  return
            toast.error(`An error occurred joining class ${matchingClass.name} with join code ${joinCode}`)
        }
    }

    return (
        <div className="input-wrapper relative">
            <input 
                type="text" placeholder="Enter Class ID" className="p-2 outline-none"
                value={joinCodeQuery} onChange={(e) => setJoinCodeQuery(e.target.value)}
            />
            <button className="h-full box-border p-2 bg-primary text-white border-none rounded-md" onClick={() => handleJoin(joinCodeQuery)}>
                Join
            </button>

            {joinCodeQuery.trim().length > 0 && classes.length > 0 && <div className="absolute top-[100%] left-0 right-0 flex flex-col gap-y-4 border-1 border-primary bg-white">
                {classes.map((classItem: SearchedClass) => (
                    <div 
                        key={classItem.id} className="flex flex-row items-center h-[50px] w-full gap-x-2 py-4 px-2 border-b-1 border-b-primary last-of-type:border-none hover:cursor-pointer hover:bg-gray-100"
                        onClick={() => setJoinCodeQuery(classItem.join_code)}
                    >
                        <img src={classItem.image} className="rounded-[50] h-full aspect-square"></img>
                        <span className="text-clip">{ classItem.name } | { classItem.join_code } </span>
                    </div>
                ))}
            </div>}
            {joinCodeQuery.trim().length > 0 && classes.length === 0 && <div className="absolute top-[100%] left-0 right-0 flex p-2 border-1 border-primary bg-white">
                No classes with matching join code
            </div>}
            {loading && <div className="absolute top-[100%] left-0 right-0 flex justify-center items-center border-1 border-primary bg-white">
                    <LoadingSpinner />
                </div>
            }
        </div>
    )
}