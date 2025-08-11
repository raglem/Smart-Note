"use client"

import { useEffect } from "react"
import useClassesStore from "@/stores/classesStore"
import ClassCard from "../../components/Class/ClassCard"
import ClassesHeader from "@/components/Class/ClassesHeader"
import ErrorPage from "@/components/ErrorPage"

export default function Page(){
    const classes = useClassesStore((state) => state.classes)
    const isLoading = useClassesStore((state)=> state.isLoading)
    const error = useClassesStore((state) => state.error)
    const fetchClasses = useClassesStore((state) => state.fetchClasses)

    useEffect(() => {
        fetchClasses()
    }, [])

    if(error){
        return (
            <ErrorPage message="Failed to load classes. Please try again." />
        )
    }

    if(isLoading){
        const cards = new Array(20).fill(1)
        return (
            <div className="flex flex-col w-full gap-y-5">
                <header className="w-full text-2xl text-black">
                    <h1>Loading Classes</h1>
                </header>
                <div className="default-grid gap-8">
                    {
                        cards.map((card, i) => (
                            <div className="card w-full aspect-square loading" key={i}>
                            </div>
                        ))
                    }
                </div>
            </div>
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