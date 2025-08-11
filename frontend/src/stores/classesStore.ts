import api from '@/utils/api'
import { create } from 'zustand'
import { ClassType } from '@/types/Sections'
import { SimpleMemberType } from '@/types'

type classesStore = {
    classes: ClassType[],
    isLoading: boolean,
    error: any,
    fetchClasses: () => Promise<void>,
    addClass: (newClass: ClassType) => void,
    removeClass: (removedClassId: number) => void,
}

const useClassesStore = create<classesStore>((set) => ({
    classes: [],
    isLoading: false,
    error: null,

    fetchClasses: async () => {
        try{
            const res = await api.get(`/classes/`)
            const formatted_data = res.data.map((item: any) => {
                return {
                    ...item,
                    members: item.members.sort((a: SimpleMemberType, b: SimpleMemberType) => a.name.localeCompare(b.name)),
                    number_of_notes: item.number_of_files
                }
            }).sort((a: ClassType, b: ClassType) => a.name.localeCompare(b.name)) as ClassType[]
            set({ classes: formatted_data, isLoading: false, error: null })
        }
        catch(err){
            set({ isLoading: false, error: err })
        }
    },
    addClass: (newClass: ClassType) => set((state) => 
        ({ classes: [...state.classes, newClass].sort((a, b) => a.name.localeCompare(b.name)) })),
    removeClass: (removedClassId: number) => set((state) => 
        ({ classes: state.classes.filter(c => c.id !== removedClassId) }))
}))

export default useClassesStore