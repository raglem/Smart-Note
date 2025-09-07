import { ClassContext } from "@/app/context/ClassContext";
import { SubunitType } from "@/types/Sections";
import api from "@/utils/api";
import { useContext, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

export default function AddSubunit({ unit, order }: { unit: number, order: number }){
    const { units, setUnits } = useContext(ClassContext)

    const [name, setName] = useState("")
    const handleCreateSubunit = async () => {
        const body = {
            name: name,
            order: order,
            unit: unit,
            files: []
        }
        try{
            const res = await api.post('/classes/subunits/', body)
            const data = res.data as SubunitType
            // Update context
            setUnits(prevUnits => 
                prevUnits.map(u => {
                    if (u.id !== unit) return u;
                    return {
                    ...u,
                    subunits: [...u.subunits, data]
                    };
                })
            ); 
            // Clear name input
            setName("")             
        }
        catch(err){
            console.error(err)
        }
    }

    return (
        <div className="flex flex-row items-center w-full gap-x-2">
            <label htmlFor="newSubunitName">
                <FaPlusCircle className="icon-responsive pointer-events-auto" />
            </label>
            <div className="flex items-center w-full border-b-1 border-b-primary text-xl py-2">
                <div className="flex flex-row items-stretch border-0">
                    <input
                        type="text" className="border-1 border-primary p-1"
                        id="newSubunitName" placeholder="New Subunit"
                        value={name} onChange={(e) => setName(e.target.value)}
                    />
                    <button className="flex flex-row justify-center py-1 px-4 bg-primary text-white cursor-pointer hover:opacity-80 rounded-r-md" onClick={handleCreateSubunit}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}