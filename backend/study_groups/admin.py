from django.contrib import admin
from . import models

admin.site.register(models.StudyGroup)
admin.site.register(models.StudyGroupMember)