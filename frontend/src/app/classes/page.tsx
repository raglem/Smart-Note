import { ClassType } from "@/types/Sections"
import ClassCard from "../../components/Class/ClassCard"
import { cookies } from "next/headers"
import ClassesHeader from "@/components/Class/ClassesHeader"

// const classes = [
//     {
//         id: "1",
//         name: "Class 1",
//         course_number: "1234",
//         join_code: "123456",
//         number_of_members: 1,
//         number_of_notes: 1,
//         latest_notes: [
//             {
//                 name: "Note1.pdf",
//                 previewUrl: "/Activity 6_ sed _ Part 1.pdf",
//             },
//             {
//                 name: "Note1.pdf",
//                 previewUrl: "/Activity 6_ sed _ Part 1.pdf",
//             },
//         ],
//     },
//     {
//         id: "2",
//         name: "Class 2",
//         course_number: "5678",
//         join_code: "234567",
//         number_of_members: 2,
//         number_of_notes: 2,
//         latest_notes: [],
//     },
//     {
//         id: "3",
//         name: "Class 3",
//         course_number: "9101",
//         join_code: "345678",
//         number_of_members: 3,
//         number_of_notes: 3,
//         latest_notes: [],
//     },
//     {
//         id: "4",
//         name: "Class 4",
//         course_number: "1121",
//         join_code: "456789",
//         number_of_members: 4,
//         number_of_notes: 4,
//         latest_notes: [],
//     },
//     {
//         id: "5",
//         name: "Class 5",
//         course_number: "3141",
//         join_code: "567890",
//         number_of_members: 5,
//         number_of_notes: 5,
//         latest_notes: [],
//     }
// ]


export default async function Page(){
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
        // Optionally redirect or show message
        return <div>You must be logged in to view your classes.</div>
    }

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
    const classes = data.map((item: any) => {
        return {
            ...item,
            number_of_notes: item.number_of_files
        }
    }) as ClassType[]

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