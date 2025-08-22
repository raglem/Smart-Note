import ErrorPage from "@/components/ErrorPage";
import TakeQuiz from "@/components/Quiz/TakeQuiz";
import { QuizType } from "@/types/Quizzes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TimerProvider } from "@/app/context/TimerContext";
import QuizTimer from "@/components/Quiz/QuizTimer";

export default async function Page({ params }: { params: { id: string }}){
    const { id } = await params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
        redirect('/login');
    }

    const res = await fetch(`${process.env.DJANGO_API}/quizzes/${id}`, {
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
            <ErrorPage message={"Failed to retrieve quiz"} />
        )
    }

    const quiz: QuizType = await res.json()
    return (
        <div className="flex flex-col h-full w-full max-w-[1280px] gap-y-5">
            <TimerProvider>
                <div className="flex flex-row justify-between items-start w-full">
                    <div className="flex flex-col gap-y-4">
                        <h1 className="font-normal text-4xl">{quiz.name}</h1>
                        <h3 className="text-xl">{quiz.related_class.name} | Made by {quiz.owner.name}</h3>
                        <div className="flex flex-wrap gap-2">
                            {quiz.related_units.map(unit => (
                                <div key={unit.id} className="bg-primary text-white rounded-xl py-1 px-4">
                                    {unit.name}
                                </div>
                            ))}
                            {quiz.related_subunits.map(subunit => (
                                <div key={subunit.id} className="flex flex-row items-center border-1 border-primary bg-white text-black rounded-xl py-1 px-4">
                                    {subunit.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-row justify-end">
                        <QuizTimer />
                    </div>
                </div>
                <TakeQuiz quiz_id={quiz.id} questions={quiz.questions} />
            </TimerProvider>
        </div>
    )
}