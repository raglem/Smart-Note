from django.db import models
from classes.models import Class, Unit, Subunit
from users.models import Member

class Quiz(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to='quizzes/', blank=True, null=True)
    owner = models.ForeignKey(Member, on_delete=models.SET_NULL, related_name='owned_quizzes', null=True, blank=True)
    related_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='quizzes', blank=True, null=True)
    related_units = models.ManyToManyField(Unit, related_name='quizzes')
    related_subunits = models.ManyToManyField(Subunit, related_name='quizzes')

    def __str__(self):
        return self.name
    
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    order = models.PositiveIntegerField()

    class Meta:
        abstract = True

class MultipleChoiceQuestion(Question):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='mcq_questions')
    correct_answer = models.CharField(max_length=150)
    related_units = models.ManyToManyField(Unit, related_name='questions')
    related_subunits = models.ManyToManyField(Subunit, related_name='questions')

    def __str__(self):
        return f"MCQ | {self.question_text} | Quiz: {self.quiz.name}"

class FreeResponseQuestion(Question):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='frq_questions')
    correct_answer = models.TextField(max_length=1000)
    total_possible_points = models.PositiveIntegerField()
    related_units = models.ManyToManyField(Unit, related_name='frq_questions')
    related_subunits = models.ManyToManyField(Subunit, related_name='frq_questions')

    def __str__(self):
        return f"FRQ | {self.question_text} | Quiz: {self.quiz.name}"
    
class WrongAnswerChoice(models.Model):
    question = models.ForeignKey(MultipleChoiceQuestion, on_delete=models.CASCADE, related_name='alternate_choices')
    choice_text = models.CharField(max_length=100) 

class QuizResult(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='quiz_results')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='results')
    points_awarded = models.PositiveIntegerField()
    total_possible_points = models.PositiveIntegerField()
    date = models.DateTimeField(auto_now_add=True)

    @property
    def free_response_answers_status(self):
        for answer in self.frq_answers:
            if answer.status == 'Pending':
                return 'Pending'
        return 'Graded'

    def __str__(self):
        if(self.total_possible_points == 0):
            return f"{self.member.name} | Quiz: {self.quiz.name} | Score: Error (Division by 0)"
        return f"{self.member.name} | Quiz: {self.quiz.name} | Score: {round(self.points_awarded / self.total_possible_points, 2)}"

class MultipleChoiceAnswer(models.Model):
    RESULT_CHOICES = (
        ('Correct', 'Correct'),
        ('Incorrect', 'Incorrect'),
    )
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    order = models.PositiveIntegerField()
    wrong_selected_choice = models.ForeignKey(WrongAnswerChoice, on_delete=models.CASCADE, related_name='selected_answers', null=True, blank=True)
    question = models.ForeignKey(MultipleChoiceQuestion, on_delete=models.CASCADE, related_name='answers')
    quiz_result = models.ForeignKey(QuizResult, on_delete=models.CASCADE, related_name='mcq_answers')

    def __str__(self):
        return f"{self.quiz_result.quiz.name} | Question: {self.question.question_text} | Result: {self.result}"
    
class FreeResponseAnswer(models.Model):
    FRQ_ANSWER_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Graded', 'Graded')
    ]
    status = models.CharField(max_length=10, choices=FRQ_ANSWER_STATUS_CHOICES, default='Pending')
    user_answer = models.TextField(max_length=1000)
    order = models.PositiveIntegerField()
    question = models.ForeignKey(FreeResponseQuestion, on_delete=models.CASCADE, related_name='answers')
    quiz_result = models.ForeignKey(QuizResult, on_delete=models.CASCADE, related_name='frq_answers')

class FreeResponseRubric(models.Model):
    reasoning_text = models.TextField(max_length=1000)
    possible_points = models.PositiveIntegerField()
    question = models.ForeignKey(FreeResponseQuestion, on_delete=models.CASCADE, related_name='rubrics')

class FreeResponseGradedRubric(models.Model):
    points_awarded = models.PositiveIntegerField()
    rubric = models.ForeignKey(FreeResponseRubric, on_delete=models.CASCADE, related_name='graded_rubrics')
    answer = models.ForeignKey(FreeResponseAnswer, on_delete=models.CASCADE, related_name='graded_rubrics')