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
    mcq_questions: MultipleChoiceQuestionType[],
    frq_questions: FreeResponseQuestionType[],
}
export type QuizSimpleType = {
    id: number,
    name: string,
    image: File,
    owner: SimpleMemberType,
    related_class: ClassSimpleType,
    related_units: UnitSimpleType[],
    related_subunits: SubunitSimpleType[]
    total_questions: number
}
export type QuestionType = MultipleChoiceQuestionType | FreeResponseQuestionType
export type MultipleChoiceQuestionType = {
    id: number,
    question_text: string,
    question_category: "MultipleChoice",
    related_units: UnitSimpleType[],
    related_subunits: SubunitSimpleType[],
    order: number,
    correct_answer: string,
    alternate_choices: AlternateChoiceType[]
}
export type FreeResponseQuestionType = {
    id: number,
    question_text: string,
    question_category: "FreeResponse",
    related_units: UnitSimpleType[],
    related_subunits: SubunitSimpleType[],
    order: number,
    correct_answer: string,
    total_possible_points: number,
    rubrics: FreeResponseQuestionRubric[]
}
export type AlternateChoiceType = {
    id: number,
    choice_text: string
}
export type FreeResponseQuestionRubric = {
    id: number,
    reasoning_text: string,
    possible_points: number,
    question: number
}
export type FreeResponseQuestionGradedRubric = {
    id: number,
    reasoning_text: string,
    points_awarded: number,
    possible_points: number,
}
export type AnswerType = MCQAnswerType | FRQAnswerType
export type MCQAnswerType = {
    question_id: number,
    wrong_selected_choice: number | null,
    result: 'Correct' | 'Incorrect'
    answer_category: "MultipleChoice"
}
export type FRQAnswerType = {
    question_id: number,
    user_answer: string,
    total_possible_points: number,
    answer_category: "FreeResponse"
}
export type MCQFormattedAnswerType = {
    question: number,
    wrong_selected_choice: number | null,
    result: 'Correct' | 'Incorrect'
    order: number
}
export type FRQFormattedAnswerType = {
    question: number,
    user_answer: string,
    order: number,
}
export type FormattedAnswerType = MCQFormattedAnswerType | FRQFormattedAnswerType
export type QuizResultType = {
    id: number,
    member_id: number,
    quiz_id: number,
    points_awarded: number,
    total_possible_points: number,
    mcq_answers: FormattedAnswerType[],
    frq_answers: FormattedAnswerType[],
}
export type QuizResultSimpleType = {
    id: number,
    quiz: QuizType,
    points_awarded: number,
    total_possible_points: number,
    date: string,
    status: 'Pending' | 'Graded'
}
export type QuizResultDetailType = {
    id: number,
    quiz: QuizType,
    points_awarded: number,
    total_possible_points: number,
    date: string,
    mcq_answers: MCQAnswerResultType[],
    frq_answers: FRQAnswerResultType[],
    status: 'Pending' | 'Graded'
}
export type AnswerResultType = MCQAnswerResultType | FRQAnswerResultType
export type MCQAnswerResultType = {
    id: number,
    wrong_selected_choice: number | null,
    result: 'Correct' | 'Incorrect',
    order: number,
    question: MultipleChoiceQuestionType
    answer_category: "MultipleChoice"
}
export type FRQAnswerResultType = {
    id: number,
    status: 'Pending' | 'Graded',
    user_answer: string,
    question: FreeResponseQuestionType,
    points_awarded: number,
    total_possible_points: number,
    graded_rubrics: FreeResponseQuestionGradedRubric[]
    order: number,
    answer_category: "FreeResponse"
}