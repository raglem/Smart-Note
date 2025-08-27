from .models import Quiz, MultipleChoiceQuestion, FreeResponseQuestion, \
                    MultipleChoiceAnswer, FreeResponseAnswer, \
                    WrongAnswerChoice, QuizResult, FreeResponseRubric
from .serializers import QuizCreateUpdateSerializer, QuizSerializer, QuizSimpleSerializer, \
                            BulkMultipleChoiceQuestionSerializer, BulkFreeResponseQuestionSerializer, QuizResultSerializer, \
                            QuizResultWriteSerializer, QuizResultSimpleSerializer
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import Member
from classes.models import Class
from django.db.models import Q

class QuizListCreateAPIView(ListCreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSimpleSerializer
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
        print(request.data)
        mcq_serializer = BulkMultipleChoiceQuestionSerializer(data=request.data['mcq_questions'])
        frq_serializer = BulkFreeResponseQuestionSerializer(data=request.data['frq_questions'])
        if not mcq_serializer.is_valid():
            return Response(mcq_serializer.errors, status=400)
        if not frq_serializer.is_valid():
            return Response(frq_serializer.errors, status=400)
        mcq_validated_data = mcq_serializer.validated_data
        frq_validated_data = frq_serializer.validated_data
        if mcq_validated_data['quiz'] != frq_validated_data['quiz']:
            return Response({"error": "Quiz IDs for MCQs and FRQs do not match."}, status=400)
        quiz = mcq_validated_data['quiz']
        mcq_questions_data = mcq_validated_data['questions']
        frq_questions_data = frq_validated_data['questions']
        # Nested creation of MultipleChoiceQuestion instances
        for question_data in mcq_questions_data:
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
                WrongAnswerChoice.objects.create(**choice_data)
        # Nested creation of FreeResponseQuestion instances
        for question_data in frq_questions_data:
            question_data['quiz'] = quiz
            related_units = question_data.pop('related_units', [])
            related_subunits = question_data.pop('related_subunits', [])
            rubrics = question_data.pop('rubrics', [])
            frq = FreeResponseQuestion.objects.create(**question_data)
            frq.related_units.set(related_units)
            frq.related_subunits.set(related_subunits)
            # Nested creation of rubrics
            for rubric_data in rubrics:
                rubric_data['question'] = frq
                FreeResponseRubric.objects.create(**rubric_data)
            frq.save()
        return Response({"message": "Questions added successfully."}, status=201)
    
class QuizSubmit(APIView):
    def post(self, request):
        serializer = QuizResultWriteSerializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        validated_data = serializer.validated_data
        mcq_answers_data = validated_data.pop('mcq_answers')
        frq_answers_data = validated_data.pop('frq_answers')
        submitted_quiz = QuizResult.objects.create(**validated_data)
        # Handle nested creation of mcq answers
        for answer_data in mcq_answers_data:
            answer_data['quiz_result'] = submitted_quiz
            MultipleChoiceAnswer.objects.create(**answer_data)
        # Handle nested creation of frq answers
        for answer_data in frq_answers_data:
            answer_data['quiz_result'] = submitted_quiz
            FreeResponseAnswer.objects.create(**answer_data)
        return Response({"message": "Quiz submitted successfully."}, status=201)
    
class QuizResultListAPIView(ListAPIView):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSimpleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        member = Member.objects.get(user=self.request.user)
        return QuizResult.objects.filter(member=member).distinct()

class QuizResultDetailAPIView(RetrieveAPIView):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer
    permission_classes = [IsAuthenticated]