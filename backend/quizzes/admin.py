from django.contrib import admin
from . import models

admin.site.register(models.Quiz)
admin.site.register(models.MultipleChoiceQuestion)
admin.site.register(models.FreeResponseQuestion)
admin.site.register(models.WrongAnswerChoice)
admin.site.register(models.MultipleChoiceAnswer)
admin.site.register(models.FreeResponseAnswer)
admin.site.register(models.FreeResponseRubric)
admin.site.register(models.FreeResponseGradedRubric)
admin.site.register(models.QuizResult)
