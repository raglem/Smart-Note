from django.utils import timezone
from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import StudyGroup, StudyGroupMember
from .serializers import StudyGroupSerializer, StudyGroupMemberSerializer
from users.serializers import SimpleMemberSerializer

class StudyGroupCreateAPIView(ListCreateAPIView):
    queryset = StudyGroup.objects.all()
    serializer_class = StudyGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

class StudyGroupDetailAPIView(RetrieveUpdateAPIView):
    queryset = StudyGroup.objects.all()
    serializer_class = StudyGroupSerializer
    permission_classes = [IsAuthenticated]

class InviteStudyGroupMembersAPIView(APIView):
    def post(self, request, pk):
        serializer = SimpleMemberSerializer(request.data, many=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Create StudyGroupMember objects
        try:
            study_group = StudyGroup.objects.get(id=pk)
        except StudyGroup.DoesNotExist:
            return Response({'error': 'StudyGroup not found'}, status=status.HTTP_404_NOT_FOUND)
        members = serializer.data
        study_group_members = []
        for member in members:
            study_group_members.append(StudyGroupMember.objects.create(member=member, study_group=study_group))

        # Return response with serialized data
        serialized_study_group_members = StudyGroupMemberSerializer(study_group_members, many=True)
        return Response(serialized_study_group_members.data, status=status.HTTP_201_CREATED)
            
