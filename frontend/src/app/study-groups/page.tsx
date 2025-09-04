import { StudyGroupType } from "@/types"
import StudyGroupClientShell from "./StudyGroupClientShell"
import { cookies } from "next/headers"
import { StudyGroupProvider } from "../context/StudyGroupContext"
import { StudyGroupDateProvider } from "../context/StudyGroupDateContext"
import StudyGroupSidebar from "@/components/Study Group/StudyGroupSidebar"
import ErrorPage from "@/components/ErrorPage"

export default async function Page(){
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    let studyGroups: StudyGroupType[] = []

    if (!accessToken) {
        // Optionally redirect or show message
        return <div>You must be logged in to view your study groups.</div>
    }

    try{
        const res = await fetch(`${process.env.DJANGO_API}/study-groups/`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            },
            // Ensure Next.js doesn’t cache the request
            cache: 'no-store',
        })
    
        if (!res.ok) {
            console.log(res)
            return <div>Failed to fetch study groups.</div>
        }
    
        // Process response data
        const data = await res.json()
        studyGroups = data as StudyGroupType[]
        studyGroups.sort((a, b) => 
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
          );

    }
    catch(err){
        console.error(err)
        return(
            <ErrorPage message={'Failed to fetch study groups'} />
        )
    }

    return (
        <StudyGroupProvider initialStudyGroups={studyGroups}>
            <StudyGroupDateProvider>
                <div className="flex flex-row min-h[calc(100vh-100px)] w-full">
                    <StudyGroupSidebar />
                    <StudyGroupClientShell studyGroupsInfo={studyGroups} />
                </div>
            </StudyGroupDateProvider>
        </StudyGroupProvider>
    )
}