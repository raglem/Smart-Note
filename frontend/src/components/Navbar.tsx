"use client"

import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link"
import Logout from "@/components/Logout";
import { MdAccountCircle, MdQuiz } from "react-icons/md";
import { UserContext } from "@/app/context/UserContext";
import { CgNotes } from "react-icons/cg";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";

export default function Navbar(){
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const { userId, checkUser } = useContext(UserContext)
    const path = usePathname()

    // Every time the user navigates to a new page, we will run checkUser from UserContext
    // This will reset the user state variables (ex. userId) and redirect to login page
    useEffect(() => {
      checkUser()
    }, [path])

    useEffect(() => {
      function handleClickOutside(e: MouseEvent){
        const target = e.target as HTMLElement
        if(!target.closest("#dropdown") && !target.closest("#dropdown-btn")){
          setShowDropdown(false)
        }
      }
      document.addEventListener("click", handleClickOutside)
      return () => {
        document.removeEventListener("click", handleClickOutside)
      }
    }, [])

    if(!userId){
      return (
        <nav className="flex flex-row justify-between items-center h-[60px] w-[100vw] py-2 px-4 bg-primary text-2xl text-white">
          <div className="flex flex-row items-center gap-x-10">
            <Link href="/">
              <span className="text-3xl cursor-pointer hover:opacity-80">
                SmartNote
              </span>
            </Link>
          </div>
          <div className="flex flex-row items-center gap-x-2">
            <Link href="/login"> 
              <MdAccountCircle className="h-10 w-10 hover:cursor-pointer hover:opacity-80" />
            </Link>
          </div>
        </nav>
      )
    }

    return (
      <nav className="relative flex flex-row justify-between md:justify-start items-center h-[60px] w-[100vw] py-2 px-4 gap-x-8 bg-primary text-2xl text-white">
        <div className="flex flex-row items-center">
            <Link href="/">
              <span className="text-3xl cursor-pointer hover:opacity-80">
                SmartNote
              </span>
            </Link>
        </div>
        {showDropdown && <ol className="absolute top-[100%] left-0 flex md:hidden flex-col w-full items-stretch bg-white text-primary z-1" id='dropdown'>
          <Link href="/classes">
            <li className="flex flex-row gap-x-1 items-center p-4 border-b-1 border-primary"> 
              <CgNotes className="icon-responsive" />
              Classes
            </li>
          </Link>
          <Link href="/quizzes">
            <li className="flex flex-row gap-x-1 items-center p-4 border-b-1 border-primary"> 
            <MdQuiz className="icon-responsive" />
              Quizzes
            </li>
          </Link>
          <Link href="/study-groups">
            <li className="flex flex-row gap-x-1 items-center p-4 border-b-1 border-primary"> 
              <CgNotes className="icon-responsive" />
              Study Groups
            </li>
          </Link>
        </ol>}
        <div className="hidden md:flex flex-grow flex-row items-end gap-x-10">
          <ol className="hidden md:flex flex-row gap-x-5 items-center">
            <Link href="/classes">
              <li className="flex flex-row gap-x-1 items-center"> 
                <CgNotes className="icon-responsive" />
                Classes
              </li>
            </Link>
            <Link href="/quizzes">
              <li className="flex flex-row gap-x-1 items-center"> 
              <MdQuiz className="icon-responsive" />
                Quizzes
              </li>
            </Link>
            <Link href="/study-groups">
              <li className="flex flex-row gap-x-1 items-center"> 
                <CgNotes className="icon-responsive" />
                Study Groups
              </li>
            </Link>
          </ol>
        </div>
        <div className="flex flex-row gap-x-2">
          <div className="flex md:hidden flex-row items-center">
            { showDropdown && <IoIosArrowDropup className="text-white text-4xl icon-responsive" onClick={() => setShowDropdown(false)} /> }
            { !showDropdown && <IoIosArrowDropdown id="dropdown-btn" className="text-white text-4xl icon-responsive" onClick={() => setShowDropdown(true)} /> }
          </div>
          <Logout />
        </div>
      </nav>
    )
}