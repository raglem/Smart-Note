import { QuizType } from "@/types/Quizzes";
import QuizCard from "./QuizCard";

type ClassType = {
    id: number,
    name: string,
    image: string
    quizzes: QuizType[]
}

export default function QuizzesBoard({quizzes}: {quizzes: QuizType[]}){
    const classes: ClassType[] = []
    quizzes.forEach(quiz => {
        const matchingClass = classes.find(c => c.id === quiz.related_class.id )
        if(!matchingClass){
            classes.push({
                id: quiz.related_class.id,
                name: quiz.related_class.name,
                image: quiz.related_class.image,
                quizzes: [quiz]
            })
        }
        else{
            matchingClass.quizzes.push(quiz)
        }
    })
    classes.sort((a, b) => a.name.localeCompare(b.name))
    return (
        <div className="flex flex-col w-full gap-y-4">
            {classes.map(classItem => (
                <div key={classItem.id} className="flex flex-col gap-y-2">
                    <h2 className="text-3xl underline">{classItem.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        {classItem.quizzes.map((quiz: QuizType) => (
                            <QuizCard quiz={quiz} key={quiz.id} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}