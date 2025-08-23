from .models import Quiz, MultipleChoiceQuestion, AnswerChoice, QuizResult
from .serializers import QuizCreateUpdateSerializer, QuizSerializer, \
                            BulkMultipleChoiceQuestionSerializer, QuizResultSerializer, \
                            SubmitQuizWriteSerializer, QuizResultSimpleSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
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
    
class QuestionsAPIView(APIView):
    def post(self, request):
        serializer = BulkMultipleChoiceQuestionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        validated_data = serializer.validated_data
        quiz = validated_data['quiz']
        questions_data = validated_data['questions']
        # Nested creation of MultipleChoiceQuestion instances
        for question_data in questions_data:
            question_data['quiz'] = quiz
            related_units = question_data.pop('related_units', [])
            related_subunits = question_data.pop('related_subunits', [])
            alternate_choices_data = question_data.pop('alternate_choices', [])
            mcq = MultipleChoiceQuestion.objects.create(**question_data)
            mcq.related_units.set(related_units)
            mcq.related_subunits.set(related_subunits)
            mcq.save()
            # Nested creation of AnswerChoice instances
            for choice_data in alternate_choices_data:
                choice_data['question'] = mcq
                AnswerChoice.objects.create(**choice_data)
        return Response({"message": "Questions added successfully."}, status=201)
    
class QuizResultListCreateAPIView(ListCreateAPIView):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSimpleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        member = Member.objects.get(user=self.request.user)
        return QuizResult.objects.filter(member=member).distinct()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SubmitQuizWriteSerializer
        return super().get_serializer_class()

class QuizResultDetailAPIView(RetrieveAPIView):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer
    permission_classes = [IsAuthenticated]