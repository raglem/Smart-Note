"use client"

import { StudyGroupType } from "@/types"
import StudyGroupClientShell from "./StudyGroupClientShell"
import { StudyGroupProvider } from "@/app/context/StudyGroupContext"
import { StudyGroupDateProvider } from "@/app/context/StudyGroupDateContext"
import StudyGroupSidebar from "@/components/StudyGroup/StudyGroupSidebar"
import ErrorPage from "@/components/ErrorPage"
import { useRouter } from "next/navigation"
import api from "@/utils/api"
import { useEffect, useState } from "react"

export default function Page(){
    const router = useRouter()

    const [studyGroups, setStudyGroups] = useState<StudyGroupType[]>([])
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        const fetchStudyGroups = async () => {
            const accessToken = localStorage.getItem('ACCESS_TOKEN')
            if (!accessToken) {
                router.push('/quizzes')
            }
        
            try{
                const res = await api.get('/study-groups/')    
            
                // Process response data
                const data: StudyGroupType[] = res.data
                data.sort((a, b) => 
                    new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
                setStudyGroups(data)
            }
            catch(err){
                console.error(err)
                setError(true)
            }
        }

        fetchStudyGroups()
    }, [router])

    if(error){
        return(
            <ErrorPage message={'Failed to fetch study groups'} />
        )
    }

    return (
        <StudyGroupProvider initialStudyGroups={studyGroups}>
            <StudyGroupDateProvider>
                <div className="flex flex-row min-h[calc(100vh-100px)] w-full">
                    <StudyGroupSidebar />
                    <StudyGroupClientShell/>
                </div>
            </StudyGroupDateProvider>
        </StudyGroupProvider>
    )
    
}