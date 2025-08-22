import { SimpleMemberType } from "."
import { ClassSimpleType, SubunitSimpleType, UnitSimpleType } from "./Sections"

export type QuizType = {
    id: number,
    name: string,
    image: File,
    owner: SimpleMemberType,
    related_class: ClassSimpleType,
    related_units: UnitSimpleType[],
    related_subunits: SubunitSimpleType[]
    questions: MultipleChoiceQuestionType[],
}
export type MultipleChoiceQuestionType = {
    id: number,
    question_text: string,
    related_units: UnitSimpleType[],
    related_subunits: SubunitSimpleType[],
    order: number,
    correct_answer: string,
    alternate_choices: AlternateChoiceType[]
}
export type AlternateChoiceType = {
    id: number,
    choice_text: string
}
export type ChoiceType = {
    id: number,
    choice_text: string
}
export type AnswerType = {
    question_id: number,
    result: 'Correct' | 'Incorrect',
}
export type QuizResultType = {
    id: number,
    member_id: number,
    quiz_id: number,
    number_of_correct_answers: number,
    number_of_questions: number,
    answers: QuestionAnswerType[],
}
export type QuizResultSimpleType = {
    id: number,
    quiz: QuizType,
    number_of_correct_answers: number,
    number_of_questions: number,
    date: string,
}
export type QuestionAnswerType = {
    result: 'Correct' | 'Incorrect',
    question: number,
    order: number,
}