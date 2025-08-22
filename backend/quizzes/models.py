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
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.CharField(max_length=200)
    related_units = models.ManyToManyField(Unit, related_name='questions')
    related_subunits = models.ManyToManyField(Subunit, related_name='questions')
    order = models.PositiveIntegerField()

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.question_text} | Quiz: {self.quiz.name}"

class MultipleChoiceQuestion(Question):
    correct_answer = models.CharField(max_length=150)
    
class AnswerChoice(models.Model):
    question = models.ForeignKey(MultipleChoiceQuestion, on_delete=models.CASCADE, related_name='alternate_choices')
    choice_text = models.CharField(max_length=100) 

class QuizResult(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='quiz_results')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='results')
    score = models.FloatField()

    def __str__(self):
        return f"{self.member.name} | Quiz: {self.quiz.name} | Score: {round(self.score, 2)}"

class QuestionAnswer(models.Model):
    RESULT_CHOICES = (
        ('Correct', 'Correct'),
        ('Incorrect', 'Incorrect'),
    )
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    question = models.ForeignKey(MultipleChoiceQuestion, on_delete=models.CASCADE, related_name='answers')
    quiz_result = models.ForeignKey(QuizResult, on_delete=models.CASCADE, related_name='answers')
    order = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quiz_result.quiz.name} | Question: {self.question.question_text} | Result: {self.result}"