from django.contrib import admin
from . import models

admin.site.register(models.Class)
admin.site.register(models.Unit)
admin.site.register(models.Subunit)
admin.site.register(models.FileCategory)
admin.site.register(models.File)