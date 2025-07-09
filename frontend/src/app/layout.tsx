import type { Metadata } from "next";
import Link from "next/link";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { IoIosLogOut } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartNote",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
            <button>
              <IoIosLogOut className="h-10 w-10 hover:cursor-pointer hover:opacity-80"/>
            </button>
            <div className="hidden lg:flex input-wrapper">
              <input type="text" placeholder="Search" className="p-2 placeholder-black outline-none"/>
              <span className="p-2 hover:cursor-pointer">
                <FaSearch className="text-black hover:opacity-80"/>
              </span>
            </div>
          </div>
        </nav>
        <main className="flex flex-grow p-5 lg:p-10 min-h[calc(100vh-60px)]">
          {children}
        </main>
        <footer className="flex flex-row justify-center items-center py-2 border-t-1 border-t-primary border-">
          Created by Theoden Melgar
        </footer>
      </body>
    </html>
  );
}
