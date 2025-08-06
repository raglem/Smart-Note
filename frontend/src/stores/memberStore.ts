import api from "@/utils/api"
import { create } from "zustand"
import { SimpleMemberType } from "@/types"

type memberStoreType = {
    member: SimpleMemberType | null
    friends: SimpleMemberType[]
    isLoading: boolean,
    error: any,
    fetchMember: () => Promise<void>
}

const useMemberStore = create<memberStoreType>((set) => ({
    member: null,
    friends: [],
    isLoading: false,
    error: false,
    fetchMember: async () => {
        set({ isLoading: true, error: null })
        try{
            const res = await api.get('/users/members/me/')
            const member = res.data
            set({
                member: {
                    id: member.id,
                    member_id: member.member_id,
                    name: member.name
                },
                friends: member.friends.map((friend: SimpleMemberType) => ({
                    id: friend.id,
                    member_id: friend.member_id,
                    name: friend.name
                })),
                isLoading: false,
                error: null
            })
        }
        catch(err){
            console.error(err)
            set({ member: null, friends: [], isLoading: false, error: err })
        }
    }
}))

export default useMemberStore