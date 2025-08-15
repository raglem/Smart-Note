import ErrorPage from "@/components/ErrorPage"
import QuizzesBoard from "@/components/Quiz/QuizzesBoard"
import { QuizType } from "@/types/Quizzes"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function QuizPage(){
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
        redirect('/login');
    }

    const res = await fetch(`${process.env.DJANGO_API}/quizzes/`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        },
        // Ensure Next.js doesn’t cache the request
        cache: 'no-store',
    })

    if(!res.ok){
        return (
            <ErrorPage message={"Failed to retrieve quizzes"} />
        )
    }

    const quizzes: QuizType[] = await res.json()
    return (
        <div className="flex flex-col w-full gap-y-8">
            <h1 className="text-5xl">Quizzes</h1>
            <QuizzesBoard quizzes={quizzes} />
        </div>
    )
}