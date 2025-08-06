import { StudyGroupContext } from "@/app/context/StudyGroupContext"
import { StudyGroupDateContext } from "@/app/context/StudyGroupDateContext"
import { useContext } from "react"
import { MdMenu } from "react-icons/md"

export default function StudyGroupCalendarHeader(){
    const { showSidebar, setShowSidebar, setCreatingGroup } = useContext(StudyGroupContext)
    const { year, month } = useContext(StudyGroupDateContext)
    const monthYearString = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month, 1))} / ${year}`
    return (
        <header className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-x-4 text-3xl text-primary">
                { !showSidebar && <MdMenu className="icon-responsive" onClick={() => setShowSidebar(true)}/> }
                <h2>{monthYearString}</h2>
            </div>
            <button className="flex py-2 px-4 bg-primary text-white rounded-md cursor-pointer hover:opacity-80" onClick={() => setCreatingGroup(prev => !prev)}>Create Study Group</button>
        </header>
    )
}