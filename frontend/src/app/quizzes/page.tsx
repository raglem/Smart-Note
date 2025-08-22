import ErrorPage from "@/components/ErrorPage"
import QuizzesBoard from "@/components/Quiz/QuizzesBoard"
import { QuizResultSimpleType, QuizType } from "@/types/Quizzes"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function QuizPage(){
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
        redirect('/login');
    }

    const [quizzesResponse, resultsResponse] = await Promise.all([
        fetch(`${process.env.DJANGO_API}/quizzes/`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
    }), fetch(`${process.env.DJANGO_API}/quizzes/results`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
    })])

    if(!quizzesResponse.ok || !resultsResponse.ok){
        return (
            <ErrorPage message={"Failed to retrieve quizzes"} />
        )
    }

    const quizzes: QuizType[] = await quizzesResponse.json()
    const results: QuizResultSimpleType[] = await resultsResponse.json()
    return (
        <QuizzesBoard quizzes={quizzes} results={results} />
    )
}