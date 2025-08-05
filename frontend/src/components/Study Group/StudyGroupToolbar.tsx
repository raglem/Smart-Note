import { useContext } from "react";
import { StudyGroupContext } from "@/app/context/StudyGroupContext";
import { StudyGroupType } from "@/types";
import api from "@/utils/api";
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";

export default function StudyGroupToolbar({ group, closeToolbar } : { group: StudyGroupType, closeToolbar: () => void }) {
    const { 
        setStudyGroups,
        selectedStudyGroup, setSelectedStudyGroup, 
        setInvitingGroup, 
        setManagingGroup 
    } = useContext(StudyGroupContext)

    const handleDeleteStudyGroup = async () => {
        try{
            const res = await api.delete(`/study-groups/${group.id}/`)
            setStudyGroups(prev => prev.filter(sg => sg.id !== group.id))
        }
        catch(err){
            // TODO: Alert user an error has occurred deleting the study group
        }
    }

    return (
        <div id="toolbar" className={`absolute top-full left-0 min-w-fit w-40 bg-white border-1 ${ selectedStudyGroup?.id === group.id ? "border-white" : "border-primary"} text-[1.2rem] shadow-md z-1 text-primary`}>
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
                className="flex flex-row justify-between items-center p-2 hover:opacity-80 hover:cursor-pointer"
                onClick={handleDeleteStudyGroup}
            >
                <span>Delete</span>
                <CgDanger className="hover:cursor-pointer hover:opacity-80 text-red-500 text-2xl" />
            </div>
        </div>
    )
}