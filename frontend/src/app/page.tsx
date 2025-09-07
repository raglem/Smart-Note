import TestUserLogin from "@/components/TestUserLogin";
import Link from "next/link";
import { CgNotes } from "react-icons/cg";
import { IoMdPeople } from "react-icons/io";
import { MdQuiz } from "react-icons/md";

export default function Home() {
  return (
    <div className="flex flex-col w-100vw">
      <section className="flex flex-col sm:flex-row w-full bg-secondary">
        <div className="flex flex-col justify-center p-8 w-full sm:w-[50%] gap-y-8">
          <div className="flex flex-col justify-center gap-y-4 text-primary-dark">
            <h1 className="text-5xl 2xl:text-7xl">
              Smart Note
            </h1>
            <p className="text-base 2xl:text-2xl">
              A better way to upload, organize, and keep track of notes. 
              A better way to create, share, and take quizzes.
              A better way to plan a study group for the big final. 
              A Better Way To Study
            </p>
          </div> 
          <nav className="flex flex-row w-full gap-x-2">
            <Link href="/login">
              <button className="w-fit py-2 px-5 bg-primary text-white rounded-full cursor-pointer hover:opacity-80 whitespace-nowrap">
                Get Started
              </button>
            </Link>
            <TestUserLogin />
          </nav>
        </div>
        <div className="flex justify-center items-center w-full sm:w-[50%] p-10">
          <img alt="Smart Note Icon" src="icon.png" className="aspect-square w-[70%] rounded-md"/>
        </div>
      </section>
      <section className="flex flex-col justify-center items-center w-full gap-y-8 p-10 bg-white">
          <div className="flex flex-col items-center gap-y-1">
            <h1 className="text-primary text-5xl 2xl:text-7xl">
              Features
            </h1>
            <p className="text-black text-lg 2xl:text-xl">
              For faster and better learning
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 justify-center gap-6 text-black">
            <div className="card flex flex-col gap-y-2 py-2 border-1 border-primary rounded-4xl">
              <header className="flex flex-row items-center gap-x-1 border-b-1 border-b-primary p-4 text-2xl">
                <CgNotes className="icon-responsive" />
                Class Notes
              </header>
              <p className="py-2 px-4 text-lg">
                Create and join multiple classes. 
                Organize and sort your notes by class, unit, and subunit. 
                Share and view notes with your fellow classmates. 
              </p>
              <Link href="/classes" className="p-2 pb-4">
                <button className="py-2 px-4 bg-primary text-white rounded-full cursor-pointer hover:opacity-80">
                  See classes
                </button>
              </Link>
            </div>
            <div className="card flex flex-col gap-y-2 py-2 border-1 border-primary rounded-4xl">
              <header className="flex flex-row items-center gap-x-1 border-b-1 border-b-primary p-4 text-2xl">
                <MdQuiz className="icon-responsive" />
                Quizzes
              </header>
              <p className="py-2 px-4 text-lg">
                Write and share quizzes in your classes.
                Categorize quizzes and questions by related units and related_subunits.
                Review MCQ and FRQ responses.
              </p>
              <Link href="/quizzes" className="p-2 pb-4">
                <button className="py-2 px-4 bg-primary text-white rounded-full cursor-pointer hover:opacity-80">
                  Go to quizzes
                </button>
              </Link>
            </div>
            <div className="card flex flex-col gap-y-2 py-2 border-1 border-primary rounded-4xl">
              <header className="flex flex-row items-center gap-x-1 border-b-1 border-b-primary p-4 text-2xl">
                <IoMdPeople className="icon-responsive" />
                Study Groups
              </header>
              <p className="py-2 px-4 text-lg">
                Schedule study groups for each class. 
                Invite and manage members.
                Prepare study materials (class notes and quizzes) before each session.
              </p>
              <Link href="/study-groups" className="p-2 pb-4">
                <button className="py-2 px-4 bg-primary text-white rounded-full cursor-pointer hover:opacity-80">
                  View study groups
                </button>
              </Link>
            </div>
          </div>
      </section>
    </div>
  )
}
