import random
import string
from django.db import models
from django.contrib.auth.models import User

class Member(models.Model):
    name = models.CharField(max_length=50, unique=True)
    member_id = models.CharField(max_length=8, unique=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member', blank=True)
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)

    def __str__(self):
        return f"{self.name} | {self.member_id}"
    
    def save(self, *args, **kwargs):
        if not self.member_id:
            self.member_id = self._generate_unique_member_id()
        super().save(*args, **kwargs)

    def _generate_unique_member_id(self):
        while True:
            member_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            if not Member.objects.filter(member_id=member_id).exists():
                return member_id
