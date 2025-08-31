import { cookies } from "next/headers";
import { ClassDetailType } from "../../../types/Sections"
import ClassClientShell from "./ClassClientShell";
import ErrorPage from "@/components/ErrorPage";

export default async function Page({ params } : { params: { id: string}}){
    const { id } = await params
    const cookieStore = await cookies()
    const access = cookieStore.get('access_token')?.value
    let classInfo: ClassDetailType | null = null

    if(!access){
      // TODO: Show unauthorized
      return <div>
        Unauthorized
      </div>
    }

    try{
      const response = await fetch(`${process.env.DJANGO_API}/classes/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`
        }
      })
  
      if(!response.ok){
        return (
          <ErrorPage message={'Failed to fetch class details'} />
        )
      }
  
      const data = await response.json()
      classInfo = {
        ...data,
        owner: {
          id: data.owner.member_id,
          name: data.owner.name,
        }
      }
    }
    catch(err){
      return (
        <ErrorPage message={'Failed to fetch class details'} />
      )
    }

    if(classInfo === null){
      return (
        <ErrorPage message={'Failed to fetch class details'} />
      )
    }

    return (
        <ClassClientShell classInfo={classInfo} />
    )
}