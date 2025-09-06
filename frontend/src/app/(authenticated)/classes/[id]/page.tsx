"use client"

import { ClassDetailType } from "@/types/Sections";
import ClassClientShell from "./ClassClientShell";
import ErrorPage from "@/components/ErrorPage";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Page(){
    const params = useParams()
    const id = params.id
    
    const router = useRouter()
    const accessToken = localStorage.getItem('ACCESS_TOKEN')

    const [classInfo, setClassInfo] = useState<ClassDetailType | null>(null)
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
      fetchClass()
    }, [])

    const fetchClass = async () => {
      if (!accessToken) {
          toast.error('Current user session expired. Please login again')
          router.push('/login')
      }
      try{
        const res = await api.get(`/classes/${id}`)
        const data = res.data
        setClassInfo({
          ...data,
          owner: {
            id: data.owner.member_id,
            name: data.owner.name,
          }
        })
      }
      catch(err){
          toast.error('Something went wrong fetching the class. Please try again')
          setError(true)
      }
  }

  if(error){
    return (
      <ErrorPage message={'Failed to fetch class details'} />
    )
  }

  if(!classInfo){
    return (
      <div>
          <header className="w-full text-black">
              <h1 className="animate-pulse">Loading Class</h1>
          </header>
          <div className="h-[calc(100vh-230px)] w-full flex justify-center items-center">
              <LoadingSpinner />
          </div>
      </div>
    )
  }

  return (
    <ClassClientShell classInfo={classInfo} />
  )
}