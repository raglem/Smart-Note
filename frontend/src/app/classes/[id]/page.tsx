import { cookies } from "next/headers";
import { ClassDetailType } from "../../../types/Sections"
import ClassClientShell from "./ClassClientShell";

export default async function Page({ params } : { params: { id: string}}){
    const { id } = await params
    const cookieStore = await cookies()
    const access = cookieStore.get('access_token')?.value
    if(!access){
      // TODO: Show unauthorized
      return <div>
        Unauthorized
      </div>
    }

    const response = await fetch(`${process.env.DJANGO_API}/classes/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access}`
      }
    })

    if(!response.ok){
      // TODO: Show failure to retrieve class
      return <div>
        Failed to fetch class
      </div>
    }

    const data = await response.json()
    const classInfo = {
      ...data,
      owner: {
        id: data.owner.member_id,
        name: data.owner.name,
      }
    } as ClassDetailType

    // Pass the classes to the client shell
    // The client component will update the context
    return (
        <ClassClientShell classInfo={classInfo} />
    )
}