import { StudyGroupType } from "@/types"
import StudyGroupClientShell from "./StudyGroupClientShell"
import { cookies } from "next/headers"
import { StudyGroupProvider } from "../context/StudyGroupContext"
import { StudyGroupDateProvider } from "../context/StudyGroupDateContext"
import StudyGroupSidebar from "@/components/Study Group/StudyGroupSidebar"

export default async function Page(){
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
        // Optionally redirect or show message
        return <div>You must be logged in to view your study groups.</div>
    }

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
    const studyGroupsInfo: StudyGroupType[] = data as StudyGroupType[]
    return (
        <StudyGroupProvider initialStudyGroups={studyGroupsInfo}>
            <StudyGroupDateProvider>
                <div className="flex flex-row min-h[calc(100vh-100px)] w-full">
                    <StudyGroupSidebar />
                    <StudyGroupClientShell studyGroupsInfo={studyGroupsInfo} />
                </div>
            </StudyGroupDateProvider>
        </StudyGroupProvider>
    )
}