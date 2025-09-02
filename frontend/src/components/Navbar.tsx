"use client"

import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link"
import Logout from "@/components/Logout";
import { FaSearch } from "react-icons/fa";
import { MdAccountCircle, MdQuiz } from "react-icons/md";
import { UserContext } from "@/app/context/UserContext";
import { CgNotes } from "react-icons/cg";

export default function Navbar(){
    const { userId, checkUser } = useContext(UserContext)
    const path = usePathname()

    // Every time the user navigates to a new page, we will run checkUser from UserContext
    // This will reset the user state variables (ex. userId) and redirect to login page
    useEffect(() => {
        checkUser()
    }, [path])

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
      <nav className="flex flex-row justify-between items-center h-[60px] w-[100vw] py-2 px-4 bg-primary text-2xl text-white">
        <div className="flex flex-row items-end gap-x-10">
            <Link href="/">
              <span className="text-3xl cursor-pointer hover:opacity-80">
                SmartNote
              </span>
            </Link>
          <ol className="flex flex-row gap-x-5 items-center">
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
          <Logout />
        </div>
      </nav>
    )
}