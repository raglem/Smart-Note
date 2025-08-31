import ErrorPage from "@/components/ErrorPage";
import GradeQuiz from "@/components/Quiz/SelfGrade/GradeQuiz";
import AnswerResult from "@/components/Quiz/Results/MCQAnswerResult";
import Results from "@/components/Quiz/Results/Results";
import { FRQAnswerResultType, MCQAnswerResultType, QuizResultDetailType } from "@/types/Quizzes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function QuizResultPage({ params }: { params: { id: string }}){
    const { id } = await params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
        redirect('/login');
    }

    const res = await fetch(`${process.env.DJANGO_API}/quizzes/results/${id}`, {
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
            <ErrorPage message={"Failed to retrieve quiz result"} />
        )
    }

    const result: QuizResultDetailType = await res.json()
    const formattedMCQs: MCQAnswerResultType[]  = result.mcq_answers.map(answer => ({ ...answer, answer_category: "MultipleChoice" }))
    const formattedFRQs: FRQAnswerResultType[] = result.frq_answers.map(answer => ({ ...answer, answer_category: "FreeResponse" }))
    const sortedAnswers = [...formattedMCQs, ...formattedFRQs].sort((a, b) => a.order - b.order)
    return (
        <div className="flex flex-col h-full w-full max-w-[1280px] gap-y-5">
            <header className={`flex flex-col gap-4 pb-4 border-b-1 border-b-primary ${result.status === 'Pending' && 'border-b-0'}`}>
                {result.status === 'Graded' && <h1 className="font-normal text-4xl">Quiz Result | {result.quiz.name}</h1>}
                {result.status === 'Pending' && <h1 className="font-normal text-4xl">Self-Grade Quiz | {result.quiz.name}</h1>}
                <h3 className="font-normal text-2xl">{ result.quiz.related_class.name } | Made by { result.quiz.owner.name } </h3>
                <div className="flex flex-wrap gap-2">
                    {result.quiz.related_units.map(unit => (
                        <div key={unit.id} className="bg-primary text-white rounded-xl py-1 px-4">
                            {unit.name}
                        </div>
                    ))}
                    {result.quiz.related_subunits.map(subunit => (
                        <div key={subunit.id} className="flex flex-row items-center border-1 border-primary bg-white text-black rounded-xl py-1 px-4">
                            {subunit.name}
                        </div>
                    ))}
                </div>
            </header>
            {result.status === 'Graded' && <Results answers={sortedAnswers} />}
            {result.status === 'Pending' && 
                <GradeQuiz 
                    quizId={result.quiz.id}
                    multipleChoiceAnswers={formattedMCQs} multipleChoicePoints={result.points_awarded} 
                    freeResponseAnswers={formattedFRQs}
                />}
        </div>
    )
}