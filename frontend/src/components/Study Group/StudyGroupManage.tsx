"use client"

import { useState, useContext, useEffect } from "react"
import { StudyGroupContext } from "@/app/context/StudyGroupContext"
import { IoIosCheckmarkCircle, IoMdRemoveCircleOutline } from "react-icons/io"
import { FaClock } from "react-icons/fa"
import { StudyGroupMemberType, StudyGroupType } from "../../types"
import api from "@/utils/api"
import { toast } from "react-toastify"
import useMemberStore from "@/stores/memberStore"

export default function StudyGroupManage({ id, studyGroup }: { id: number, studyGroup: StudyGroupType}){
    const [name, setName] = useState<string>(studyGroup.name)
    const [datetime, setDatetime] = useState<Date>(new Date(studyGroup.datetime))
    const [visibility, setVisibility] = useState<"Public" | "Private">("Private")
    const [members, setMembers] = useState<StudyGroupMemberType[]>(studyGroup.members)

    // Retrieve member context so current member is excluded from members list
    const currentMember = useMemberStore(state => state.member)
    const fetchMember = useMemberStore(state => state.fetchMember)
    useEffect(() => {fetchMember()}, [])

    // Retrieve study group context
    const { studyGroups, setStudyGroups, setManagingGroup } = useContext(StudyGroupContext)

    const handleSave = async () => {
        const body = {
            name,
            datetime,
            visibility,
            members
        }
        try{
            console.log(body)
            const res = await api.put(`/study-groups/${id}/`, body)
            const data = res.data
            
            // Update context
            setStudyGroups(prev => prev.map(sg => sg.id !== data.id ? sg : data))
        }
        catch(err){
            toast.error(`Failed to update study group ${studyGroup.name}. Changes were not saved`)
            console.error(err)
        }
        finally{
            setManagingGroup(false)
        }
    }

    const handleRemoveMember = (id: number) => {
        console.log(members)
        setMembers(members.filter((m) => m.id !== id))
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month, day] = e.target.value.split('-').map(Number);
        const newDate = new Date(datetime);
        newDate.setFullYear(year);
        newDate.setMonth(month - 1);
        newDate.setDate(day);
        setDatetime(newDate);
    };
    
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        const newDate = new Date(datetime);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        setDatetime(newDate);
    };

    // Get the local datetime
    const formattedLocalDate = `${datetime.getFullYear()}-${pad(datetime.getMonth() + 1)}-${pad(datetime.getDate())}`
    const formattedLocalTime = `${pad(datetime.getHours())}:${pad(datetime.getMinutes())}`;
    function pad(num: number): string {
        return num.toString().padStart(2, '0');
    }

    return (
        <div className="overlay">
            <div className="card flex flex-col gap-y-4 min-w-[300px] w-[50vw] max-w-[768px] bg-white border-1 border-primary">
                <header className="flex flex-row items-center pt-4 pb-2 px-4 text-3xl bg-primary text-white">
                    Manage { studyGroup.name }
                </header>
                <div className="flex flex-col gap-y-4 p-4">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-xl">Name</label>
                        <input type="text" placeholder={ name } id="name" className="form-input border-1 border-primary" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-xl">Date</label>
                        <input type="date" placeholder="Date" id="date" className="form-input border-1 border-primary" value={formattedLocalDate} onChange={handleDateChange} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="time" className="text-xl">Time</label>
                        <input type="time" placeholder="Time" id="time" className="form-input border-1 border-primary" value={formattedLocalTime} onChange={handleTimeChange} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="members" className="text-xl">Members</label>
                        { members.length > 0 && <ol className="flex flex-col max-h-[210px] border-1 border-primary rounded-sm overflow-auto">
                            {members.map((m) => 
                                m.member.id !== currentMember?.id && <li className="flex flex-row justify-between items-center p-2 not-last-of-type:border-b-1 border-b-primary" key={m.id}>
                                    <div className="flex flex-row items-center gap-x-2">
                                        <div>{ m.member.name }</div>
                                        { m.status === "Joined" ? <IoIosCheckmarkCircle className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-green-500"/> 
                                                : <FaClock className="hover:scale-150 transition-transform duration-200 ease-in-out text-xl text-yellow-500"/>}
                                    </div>
                                    <IoMdRemoveCircleOutline className="icon-responsive text-primary text-xl" onClick={() => handleRemoveMember(m.id)}/>
                                </li>
                            )}
                        </ol> }
                        { members.length == 0 && <div className="flex flex-row p-2 border-1 border-primary">
                            No Members Added
                        </div> }
                    </div>
                </div>
                <div className="form-btn-toolbar pt-0 px-4 pb-8">
                    <button className="form-btn bg-primary text-white border-0" onClick={handleSave} >Save</button>
                    <button className="form-btn bg-white text-primary border-1 border-primary" onClick={() => setManagingGroup(false)} >Cancel</button>
                </div>
            </div>
        </div>
    )
}