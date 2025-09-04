import { StudyGroupContext } from "@/app/context/StudyGroupContext"
import { StudyGroupDateContext } from "@/app/context/StudyGroupDateContext"
import { useContext } from "react"
import { MdMenu } from "react-icons/md"

export default function StudyGroupCalendarHeader(){
    const { showSidebar, setShowSidebar, setCreatingGroup } = useContext(StudyGroupContext)
    const { year, month } = useContext(StudyGroupDateContext)
    const monthYearString = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month, 1))} / ${year}`
    return (
        <header className="flex flex-row gap-x-4 items-center">
            <MdMenu className={`icon-responsive text-3xl text-primary ${showSidebar && 'opacity-0 sm:opacity-100'}`} onClick={() => setShowSidebar(true)}/>
            <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-2 text-xl md:text-3xl text-primary">
                <h2>{monthYearString}</h2>
                <button className="flex py-2 px-4 bg-primary text-sm md:text-base text-white rounded-md cursor-pointer hover:opacity-80 whitespace-nowrap" onClick={() => setCreatingGroup(prev => !prev)}>
                    Create Study Group
                </button>
            </div>
        </header>
    )
}