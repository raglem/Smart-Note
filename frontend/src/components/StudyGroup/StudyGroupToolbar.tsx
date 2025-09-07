import { useContext } from "react";
import { StudyGroupContext } from "@/app/context/StudyGroupContext";
import { StudyGroupType } from "@/types";
import api from "@/utils/api";
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { toast } from "react-toastify";

export default function StudyGroupToolbar({ group, closeToolbar } : { group: StudyGroupType, closeToolbar: () => void }) {
    const { 
        setStudyGroups,
        setSelectedStudyGroup, 
        setInvitingGroup, 
        setManagingGroup 
    } = useContext(StudyGroupContext)

    const handleLeaveStudyGroup = async () => {
        try{
            await api.delete(`/study-groups/leave/${group.id}/`)
            setStudyGroups(prev => prev.filter(sg => sg.id !== group.id))
        }
        catch{
            toast.error(`Failed to leave study group ${group.name}. Please try again`)
        }
    }

    return (
        <div id="toolbar" className={`absolute top-full left-0 min-w-fit w-40 bg-white border-1 border-primary rounded-md text-[1.2rem] shadow-md z-1 text-primary`}>
            <div 
                className="flex flex-row justify-between items-center p-2 border-b-1 border-b-primary hover:opacity-80 hover:cursor-pointer" 
                onClick={() => {
                    setSelectedStudyGroup(group)
                    setInvitingGroup(true)
                    closeToolbar()
                }}
            >
                <span>Invite</span>
                <FaPlusCircle className="hover:cursor-pointer hover:opacity-80" />
            </div>
            <div 
                className="flex flex-row justify-between items-center p-2 border-b-1 border-b-primary hover:opacity-80 hover:cursor-pointer"
                onClick={() => {
                    setSelectedStudyGroup(group)
                    setManagingGroup(true)
                    closeToolbar()
                }}
            >
                <span>Manage</span>
                <FaEdit className="hover:cursor-pointer hover:opacity-80" />
            </div>
            <div 
                className="flex flex-row justify-between items-center p-2 hover:opacity-80 hover:cursor-pointer text-primary"
                onClick={handleLeaveStudyGroup}
            >
                <span>Leave</span>
                <ImExit className="hover:cursor-pointer hover:opacity-80 text-primary text-2xl" />
            </div>
        </div>
    )
}