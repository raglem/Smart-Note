import api from "@/utils/api"
import { create } from "zustand"
import { SubunitSimpleType, UnitSimpleType } from "@/types/Sections"

type unitsStore = {
    isLoading: boolean,
    error: any,
    units: UnitSimpleType[],
    subunits: SubunitSimpleType[],
    fetchUnitsAndSubunits: (classId: number) => Promise<void>,
}

const useUnitsStore = create<unitsStore>((set) => ({
    isLoading: false,
    error: null,
    units: [],
    subunits: [],
    fetchUnitsAndSubunits: async (classId: number) => {
        set({ isLoading: true })
        try{
            const res = await api.get(`/classes/units-subunits/${classId}`)
            console.log(res.data)
            set({ isLoading: false, units: res.data.units, subunits: res.data.subunits })
        }
        catch(err){
            set({ error: err, isLoading: false, })
        }
    }
}))
export default useUnitsStore