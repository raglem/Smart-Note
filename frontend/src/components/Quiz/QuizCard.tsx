import { QuizType } from "@/types/Quizzes";

export default function QuizCard({quiz}: {quiz:QuizType}){
    return (
        <div className="card rounded-md hover:cursor-pointer">
            <header className="flex flex-row justify-between items-end bg-primary text-white px-2 py-5">
                <h2 className="text-3xl hover:underline">{quiz.name}</h2>
                <span className="text-xl">12 Qs</span>
            </header>
            <img src={quiz.image} className="object-cover w-full h-50px"/>
            <div className="px-2 py-5 flex flex-wrap gap-2">
                {quiz.related_units.map(unit => (
                    <div key={unit.id} className="rounded-md bg-primary text-md text-white py-1 px-4">
                        {unit.name}
                    </div>
                ))}
                {quiz.related_subunits.map(subunit => (
                    <div key={subunit.id} className="rounded-md border-1 border-primary text-md text-primary py-1 px-4">
                        {subunit.name}
                    </div>
                ))}
            </div>
        </div>
    )
}