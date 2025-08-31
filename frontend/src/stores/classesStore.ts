import api from '@/utils/api'
import { create } from 'zustand'
import { ClassType } from '@/types/Sections'

type classesStore = {
    classes: ClassType[],
    isLoading: boolean,
    error: any,
    fetchClasses: () => Promise<void>
}

const useClassesStore = create<classesStore>((set) => ({
    classes: [],
    isLoading: false,
    error: null,

    fetchClasses: async () => {
        try{
            const res = await api.get(`/classes/`)
            const sorted_data = res.data.sort((a: ClassType, b: ClassType) => a.name.localeCompare(b.name))
            set({ classes: sorted_data, isLoading: false, error: null })
        }
        catch(err){
            set({ isLoading: false, error: err })
        }
    }
}))

export default useClassesStore