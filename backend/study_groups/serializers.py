from rest_framework import serializers
from .models import StudyGroup, StudyGroupMember
from users.models import Member
from users.serializers import SimpleMemberSerializer

class StudyGroupMemberSerializer(serializers.ModelSerializer):
    member = SimpleMemberSerializer(read_only=True)
    class Meta:
        model = StudyGroupMember
        fields = ['id', 'member', 'study_group', 'status']
        read_only_fields = ['id']

class StudyGroupSerializer(serializers.ModelSerializer):
    members = StudyGroupMemberSerializer(many=True)
    class Meta:
        model = StudyGroup
        fields = ['id', 'name', 'datetime', 'visibility', 'members']
        read_only_fields = ['id']

    # Member relationships will not be handled on initial creation
    def create(self, validated_data):
        validated_data.pop('members', [])
        study_group = super().create(validated_data)

        # Include current user in the study group
        user = self.context['user']
        member = Member.objects.get(user=user)
        StudyGroupMember.objects.create(member=member, study_group=study_group, status='Joined')
        return study_group

    # Delete excluded members in nested members field, adding members is handled by custom InviteStudyGroupMembersAPIView
    def update(self, instance, validated_data):
        print(self.initial_data)
        validated_data.pop('members', [])
        existing_members_ids = StudyGroupMember.objects.filter(study_group=instance).values_list('id', flat=True)
        member_data = self.initial_data.pop('members')

        # Get excluded_member_ids by taking set difference of existing_member_ids and the ids of the members included in the request
        included_members_ids = [member['id'] for member in member_data]
        excluded_member_ids = list(set(existing_members_ids) - set(included_members_ids))

        # Retrieve deleted members from excluded_member_ids and delete
        deleted_members = StudyGroupMember.objects.filter(id__in=excluded_member_ids)
        deleted_members.delete()
        return super().update(instance, validated_data)