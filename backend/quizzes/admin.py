from django.contrib import admin
from . import models

admin.site.register(models.Quiz)
admin.site.register(models.MultipleChoiceQuestion)
admin.site.register(models.AnswerChoice)
admin.site.register(models.QuizResult)
admin.site.register(models.Answer)
