import { ClassType } from "@/types/Sections"
import ClassCard from "../../components/Class/ClassCard"
import { cookies } from "next/headers"
import ClassesHeader from "@/components/Class/ClassesHeader"
import ErrorPage from "@/components/ErrorPage"

export default async function Page(){
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
        // Optionally redirect or show message
        return <div>You must be logged in to view your classes.</div>
    }

    let classes: ClassType[] = []

    try{
        const res = await fetch(`${process.env.DJANGO_API}/classes/`, {
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
            return <div>Failed to fetch classes.</div>
        }
    
        // Process response data
        const data = await res.json()
        classes = data.map((item: any) => {
            return {
                ...item,
                number_of_notes: item.number_of_files
            }
        }) as ClassType[]
    }
    catch(err){
        return (
            <ErrorPage message={'Failed to fetch classes'} />
        )
    }

    return (
        <div className="flex flex-col w-full gap-y-5">
            <ClassesHeader />
            <div className="default-grid gap-8">
                {
                    classes.map((classItem) => (
                        <ClassCard key={classItem.id} classItem={classItem} />
                    ))
                }
            </div>
        </div>
    )
}