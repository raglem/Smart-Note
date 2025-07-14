"use client"

import { StudyGroupContext } from "@/app/context/StudyGroupContext"
import { StudyGroupType } from "@/types"
import { useContext, useState } from "react"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa"
import StudyGroupCalendarDay from "./StudyGroupCalendarDay"

function generateCalendarDays(month: number, year: number): (Date | null)[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
  
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();
  
    const days: (Date | null)[] = [];
  
    for (let i = 0; i < startWeekday; i++) {
      days.push(null);
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
  
    return days;
  }

type studyCalendarType = {
    days: {
        date: Date | null,
        events: StudyGroupType[]
    }[]
    month: number
    year: number
}

export default function StudyGroupCalendar({ selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }: { 
    selectedMonth: number, 
    selectedYear: number 
    setSelectedMonth: React.Dispatch<React.SetStateAction<number>>,
    setSelectedYear: React.Dispatch<React.SetStateAction<number>>
}) {
    // Retrieve the user's study groups from the context
    const { studyGroups } = useContext(StudyGroupContext)

    // The calendar
    const studyCalendar: studyCalendarType = {
        days: generateCalendarDays(selectedMonth, selectedYear).map(day => ({
            date: day,
            events: studyGroups.filter(sg => sg.dateTime.getDate() === day?.getDate() && sg.dateTime.getMonth() === day?.getMonth() && sg.dateTime.getFullYear() === day?.getFullYear())
        })),
        month: selectedMonth,
        year: selectedYear
    }

    const monthChange = (newMonth: number) => {
        if(newMonth > 11){
            setSelectedMonth(0)
            setSelectedYear(selectedYear + 1)
        }
        else if(newMonth < 0){
            setSelectedMonth(11)
            setSelectedYear(selectedYear - 1)
        }
        else{
            setSelectedMonth(newMonth)
        }
    }

    return (
        <div className="flex flex-col h-full gap-y-4 min-w-xl">
            <div className="grid grid-cols-7 h-full gap-y-0">
                <div className="flex flex-row justify-center items-end text-center border-b-1 border-primary">Sun</div>
                <div className="flex flex-row justify-center items-end text-center border-b-1 border-primary">Mon</div>
                <div className="flex flex-row justify-center items-end text-center border-b-1 border-primary">Tue</div>
                <div className="flex flex-row justify-center items-end text-center border-b-1 border-primary">Wed</div>
                <div className="flex flex-row justify-center items-end text-center border-b-1 border-primary">Thu</div>
                <div className="flex flex-row justify-center items-end text-center border-b-1 border-primary">Fri</div>
                <div className="flex flex-row justify-center items-end text-center border-b-1 border-primary">Sat</div>
                {
                    studyCalendar.days.map((d, i) => (
                        <div className={`min-h-[100px] border-b-1 border-r-1 border-primary px-2 pb-2 ${i % 7 === 0 ? 'border-l-1' : 'border-l-0'}`} key={i}>
                            <header>{ d.date?.getDate() }</header>
                            <StudyGroupCalendarDay events={d.events} />
                        </div>
                    ))
                }
            </div>
            <div className="flex flex-row justify-center items-center gap-x-2">
                <button onClick={() => monthChange(selectedMonth - 1)}>
                    <FaCaretLeft className="icon-responsive text-5xl text-primary" />
                </button>
                <button onClick={() => monthChange(selectedMonth + 1)}>
                    <FaCaretRight className="icon-responsive text-5xl text-primary" />
                </button>
            </div>
        </div>
    )
}