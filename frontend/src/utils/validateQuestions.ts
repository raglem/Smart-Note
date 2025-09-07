import { QuestionType } from "@/types/Quizzes";

export default function ValidateQuestions(questions: QuestionType[]){
    for(const [i, question] of questions.entries()){
        if(question.question_text.trim().length < 5){
            return { valid: false, message: `Q${i+1}: Each question must have a length of at least 5 characters` }
        }
        if(question.correct_answer.trim().length < 1){
            return { valid: false, message: `Q${i+1}: Each question must have a correct answer` }
        }
        if(question.question_category === "MultipleChoice"){
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
        if(question.question_category === "FreeResponse"){
            for(const rubric of question.rubrics){
                if(rubric.possible_points === 0){
                    return { valid: false, message: `Q${i+1}: A rubric category must be worth more than 0 points` }
                }
                if(rubric.reasoning_text.trim().length < 5){
                    return { valid: false, message: `Q${i+1}: The reasoning for a rubric category must have a length of at least 5 characters` }
                }
            }
        }
    }
    return { valid: true, message: "Questions are valid" }
}