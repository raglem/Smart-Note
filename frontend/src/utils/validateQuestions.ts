import { MultipleChoiceQuestionType } from "@/types/Quizzes";

export default function ValidateQuestions(questions: MultipleChoiceQuestionType[]){
    for(const [i, question] of questions.entries()){
        if(question.question_text.trim().length < 5){
            return { valid: false, message: `Q${i+1}: Each question must have a length of at least 5 characters` }
        }
        if(question.correct_answer.trim().length < 1){
            return { valid: false, message: `Q${i+1}: Each question must have a correct answer` }
        }
        if(question.alternate_choices.length < 1){
            return { valid: false, message: `Q${i+1}: Each question must have at least one alternate choice` }
        }
        for(const choice of question.alternate_choices){
            if(choice.choice_text.trim().length < 1){
                return { valid: false, message: `Q${i+1}: Each alternate choice must be at least 1 character long` }
            }
            if(choice.choice_text === question.correct_answer){
                return { valid: false, message: `Q${i+1}: Alternate choices cannot match the correct answer` }
            }
            if(question.alternate_choices.filter(c => c.choice_text === choice.choice_text).length > 1){
                return { valid: false, message: `Q${i+1}: Alternate choices must be unique` }
            }
        }
    }
    return { valid: true, message: "Questions are valid" }
}