from .models import Quiz
from .serializers import QuizCreateUpdateSerializer, QuizSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from users.models import Member
from classes.models import Class
from django.db.models import Q

class QuizListCreateAPIView(ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        member = Member.objects.get(user=self.request.user)
        member_classes = Class.objects.filter(Q(members=member) | Q(owner=member)).distinct()
        return Quiz.objects.filter(related_class__in=member_classes).distinct()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return QuizCreateUpdateSerializer
        return super().get_serializer_class()

class QuizDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request == 'PUT':
            return QuizCreateUpdateSerializer
        return super().get_serializer_class()