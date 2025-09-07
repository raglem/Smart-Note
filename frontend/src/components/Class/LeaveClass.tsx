"use client"

import { ClassContext } from "@/app/context/ClassContext"
import api from "@/utils/api"
import router from "next/router"
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import LoadingSpinner from "../LoadingSpinner"

export default function LeaveClass({ close} : {
    close: () => void,
}){
    const { classFields } = useContext(ClassContext)
    const { id, name } = classFields
    const [loading, setLoading] = useState<boolean>(false)
    const handleLeave = async () => {
        setLoading(true)
        try{
            const res = await api.delete(`/classes/leave/${id}/`)
            router.push('/classes')
        }
        catch(err){
            toast.error(`Something went wrong leaving clas ${name}. Please try again`)
            console.error(err)
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <div className="overlay">
            <div className="card flex flex-col py-4 gap-y-2 min-w-[300px] w-[50vw] max-w-[768px] bg-white border-1 border-primary">
                <header className="flex flex-row items-center px-2 text-3xl border-b-1 border-b-primary">
                    Leave Class
                </header>
                <p className="p-2">
                    <span className="text-2xl">Are you sure you want to leave {name}?</span>
                    <br/>
                    <i className="text-md">This action cannot be undone</i>
                </p>
                { loading && <div className="flex justify-center items-center">
                    <LoadingSpinner />
                </div>}
                <div className="form-btn-toolbar px-2">
                    <button onClick={handleLeave} className="form-btn bg-red-500 text-white">Leave</button>
                    <button onClick={close} className="form-btn bg-white text-black">Cancel</button>
                </div>
            </div>
        </div>
    )
}