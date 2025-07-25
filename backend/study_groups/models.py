from django.db import models

from users.models import Member

class StudyGroup(models.Model):
    class VisibilityChoices(models.TextChoices):
        PUBLIC = 'Public', 'Public'
        PRIVATE = 'Private', 'Private'
    name = models.CharField(max_length=50)
    datetime = models.DateTimeField()
    visibility = models.CharField(max_length=20, choices=VisibilityChoices.choices, default=VisibilityChoices.PUBLIC)

    def __str__(self):
        return f"{self.name}"

class StudyGroupMember(models.Model):
    class StatusChoices(models.TextChoices):
        INVITED = 'Invited', 'Invited'
        JOINED = 'Joined', 'Joined'
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='study_group_memberships')
    study_group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE, related_name='members')
    status = models.CharField(max_length=20, choices=StatusChoices.choices)

    def __str__(self):
        return f"{self.member.name} | {self.study_group.name} | {self.get_status_display()}"