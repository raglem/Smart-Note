"use client"

import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link"
import Logout from "@/components/Logout";
import { FaSearch } from "react-icons/fa";
import { UserContext } from "@/app/context/UserContext";

export default function Navbar(){
    const { userId, checkUser } = useContext(UserContext)
    const path = usePathname()

    // Every time the user navigates to a new page, we will run checkUser from UserContext
    // This will reset the user state variables (ex. userId) and redirect to login page
    useEffect(() => {
        checkUser()
    }, [path])

    return ( userId ? 
        <nav className="flex flex-row justify-between items-center h-[60px] w-[100vw] p-2 bg-primary text-2xl text-white">
          <div className="flex flex-row items-end gap-x-10">
            <span className="text-3xl">
              SmartNote
            </span>
            <ol className="flex flex-row gap-x-5 items-center">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/classes">Classes</Link>
              </li>
              <li>
                <Link href="/quizzes">Quizzes</Link>
              </li>
              <li>
                <Link href="/study-groups">Study Groups</Link>
              </li>
            </ol>
          </div>
          <div className="flex flex-row gap-x-2">
            <Logout />
            <div className="hidden lg:flex input-wrapper">
              <input type="text" placeholder="Search" className="p-2 placeholder-black outline-none"/>
              <span className="p-2 hover:cursor-pointer">
                <FaSearch className="text-black hover:opacity-80"/>
              </span>
            </div>
          </div>
        </nav> : <nav className="flex flex-row justify-between items-center h-[60px] w-[100vw] p-2 bg-primary text-2xl text-white">
          <div className="flex flex-row items-end gap-x-10">
            <span className="text-3xl">
              SmartNote
            </span>
            <ol className="flex flex-row gap-x-5 items-center">
              <li>
                <Link href="/">Home</Link>
              </li>
            </ol>
          </div>
          <div className="flex flex-row gap-x-2">
            <Logout />
            <div className="hidden lg:flex input-wrapper">
              <input type="text" placeholder="Search" className="p-2 placeholder-black outline-none"/>
              <span className="p-2 hover:cursor-pointer">
                <FaSearch className="text-black hover:opacity-80"/>
              </span>
            </div>
          </div>
        </nav>
    )
}