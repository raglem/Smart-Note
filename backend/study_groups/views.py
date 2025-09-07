from django.utils import timezone
from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from .models import StudyGroup, StudyGroupMember
from .serializers import StudyGroupSerializer, StudyGroupMemberSerializer
from users.serializers import SimpleMemberSerializer
from users.models import Member

class StudyGroupCreateListAPIView(ListCreateAPIView):
    queryset = StudyGroup.objects.all()
    serializer_class = StudyGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        member = Member.objects.get(user=self.request.user)
        return StudyGroup.objects.filter(members__member=member).distinct()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

class StudyGroupDetailAPIView(RetrieveUpdateAPIView):
    queryset = StudyGroup.objects.all()
    serializer_class = StudyGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        member = Member.objects.get(user=self.request.user)
        return StudyGroup.objects.filter(members__member=member).distinct()

class InviteStudyGroupMembersAPIView(APIView):
    def post(self, request, pk):
        if not request.data['id']:
            return Response("A valid member id must be provided", status=status.HTTP_400_BAD_REQUEST)
        member = Member.objects.get(id=request.data['id'])
        if not member:
            return Response("Member not found", status=status.HTTP_404_NOT_FOUND)
        
        # Create StudyGroupMember objects
        try:
            study_group = StudyGroup.objects.get(id=pk)
        except StudyGroup.DoesNotExist:
            return Response({'error': 'StudyGroup not found'}, status=status.HTTP_404_NOT_FOUND)
        study_group_member = StudyGroupMember.objects.create(member=member, status='Invited', study_group=study_group)

        # Return response with serialized data
        serialized_study_group_member = StudyGroupMemberSerializer(study_group_member)
        return Response(serialized_study_group_member.data, status=status.HTTP_201_CREATED)

class AcceptDeclineInviteStudyGroupAPIView(APIView):
    def post(self, request, pk):
        if not request.data['status'] or request.data['status'] not in ['Joined', 'Declined']:
            return Response("A valid status must be provided", status=status.HTTP_400_BAD_REQUEST)
        member = Member.objects.get(user=request.user)

        # Update the member's status in the study group
        study_group = get_object_or_404(StudyGroup, id=pk)
        study_group_member = study_group.members.filter(member=member).first()

        if not study_group_member:
            return Response(f"{member.name} is not a member of this study group", status=status.HTTP_404_NOT_FOUND)
        if not study_group_member.status == 'Invited':
            return Response(f"{member.name} has already responded to the invitation", status=status.HTTP_400_BAD_REQUEST)
        
        # Handle decline action
        if request.data['status'] == 'Declined':
            serialized_study_group_member = StudyGroupMemberSerializer(study_group_member)
            study_group_member.delete()
            return Response({
                "message": f"You have declined the invitation to the study group {study_group.name}",
                "member": serialized_study_group_member.data
            }, status=status.HTTP_204_NO_CONTENT)
        
        # Handle accept action
        study_group_member.status = request.data['status']
        study_group_member.save()
        serialized_study_group_member = StudyGroupMemberSerializer(study_group_member)
        return Response({
            "message": f"You have been added to the study group {study_group.name}", 
            "member": serialized_study_group_member.data
        }, status=status.HTTP_200_OK)

class LeaveStudyGroupAPIView(APIView):
    def delete(self, request, pk):
        member = Member.objects.get(user=request.user)
        study_group = get_object_or_404(StudyGroup, id=pk)
        study_group_member = study_group.members.filter(member=member).first()

        if not study_group_member:
            return Response(f"{member.name} is not a member of this study group", status=status.HTTP_404_NOT_FOUND)

        # Remove the member from the study group
        study_group_member.delete()

        # If no members left, delete the study group
        if study_group.members.count() == 0:
            study_group.delete()
        return Response({
            "message": f"You have left the study group {study_group.name}"
        }, status=status.HTTP_204_NO_CONTENT)