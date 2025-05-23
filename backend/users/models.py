from django.db import models
from django.contrib.auth.models import User

class Member(models.Model):
    name = models.CharField(max_length=50)
    member_id = models.CharField(max_length=8, primary_key=True, unique=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member', blank=True)
