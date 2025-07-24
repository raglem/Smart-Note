import { ClassContext } from "@/app/context/ClassContext"
import api from "@/utils/api"
import router from "next/router"
import { useContext } from "react"

export default function DeleteClass({ close} : {
    close: () => void,
}){
    const { classFields } = useContext(ClassContext)
    const { id, name } = classFields
    const handleDelete = async () => {
        try{
            const res = await api.delete(`/classes/${id}/`)
            router.push('/classes')
        }
        catch(err){
            console.error(err)
        }
    }
    return (
        <div className="overlay">
            <div className="card flex flex-col py-4 gap-y-2 min-w-[300px] w-[50vw] max-w-[768px] bg-secondary">
                <header className="flex flex-row items-center px-2 text-3xl border-b-1 border-b-primary">
                    Delete Class
                </header>
                <p className="px-2">
                    <span className="text-2xl">Are you sure you want to delete {name}?</span>
                    <br/>
                    <i className="text-md">This action cannot be undone</i>
                </p>
                <div className="form-btn-toolbar px-2">
                    <button onClick={handleDelete} className="form-btn bg-primary text-white">Delete</button>
                    <button onClick={close} className="form-btn bg-secondary text-primary">Cancel</button>
                </div>
            </div>
        </div>
    )
}