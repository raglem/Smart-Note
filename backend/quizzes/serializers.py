from rest_framework import serializers
from .models import Quiz, MultipleChoiceQuestion, WrongAnswerChoice, MultipleChoiceAnswer, \
                    FreeResponseQuestion, FreeResponseAnswer, FreeResponseRubric, \
                    FreeResponseGradedRubric, QuizResult
from classes.models import Class, Unit, Subunit
from classes.serializers import ClassSimpleSerializer, SubunitNestedSerializer, UnitNestedSerializer
from users.models import Member
from users.serializers import SimpleMemberSerializer

class WrongAnswerChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WrongAnswerChoice
        fields = ['id', 'choice_text']
        read_only_fields = ['id']

class MultipleChoiceQuestionReadSerializer(serializers.ModelSerializer):
    alternate_choices = WrongAnswerChoiceSerializer(many=True)
    related_units = UnitNestedSerializer(many=True, read_only=True)
    related_subunits = SubunitNestedSerializer(many=True, read_only=True)
    class Meta:
        model = MultipleChoiceQuestion
        fields = ['id', 'question_text', 'order', 'correct_answer', 'alternate_choices', 'related_units', 'related_subunits']
        raad_only_fields = ['id', 'question_text', 'order', 'correct_answer', 'alternate_choices']

class MultipleChoiceQuestionWriteSerializer(serializers.ModelSerializer):
    alternate_choices = WrongAnswerChoiceSerializer(many=True)
    related_units = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all(), many=True)
    related_subunits = serializers.PrimaryKeyRelatedField(queryset=Subunit.objects.all(), many=True)
    class Meta:
        model = MultipleChoiceQuestion
        fields = ['id', 'question_text', 'order', 'related_units', 'related_subunits', 'correct_answer', 'alternate_choices']
        read_only_fields = ['id']

class BulkMultipleChoiceQuestionSerializer(serializers.Serializer):
    questions = MultipleChoiceQuestionWriteSerializer(many=True)
    quiz = serializers.PrimaryKeyRelatedField(queryset=Quiz.objects.all())
    class Meta:
        model = MultipleChoiceQuestion
        fields = ['quiz', 'questions']

class MultipleChoiceAnswerReadSerializer(serializers.ModelSerializer):
    wrong_selected_choice = serializers.PrimaryKeyRelatedField(queryset=WrongAnswerChoice.objects.all(), required=False, allow_null=True)
    question = MultipleChoiceQuestionReadSerializer(read_only=True)
    class Meta:
        model = MultipleChoiceAnswer
        fields = ['id', 'result', 'wrong_selected_choice', 'question', 'quiz_result', 'order']
        read_only_fields = ['id']

class MultipleChoiceAnswerWriteSerializer(serializers.ModelSerializer):
    wrong_selected_choice = serializers.PrimaryKeyRelatedField(queryset=WrongAnswerChoice.objects.all(), required=False, allow_null=True)
    question = serializers.PrimaryKeyRelatedField(queryset=MultipleChoiceQuestion.objects.all())
    class Meta:
        model = MultipleChoiceAnswer
        fields = ['id', 'result', 'wrong_selected_choice', 'question', 'quiz_result', 'order']
        read_only_fields = ['id', 'quiz_result']

class FreeResponseQuestionReadSerializer(serializers.ModelSerializer):
    related_units = UnitNestedSerializer(many=True, read_only=True)
    related_subunits = SubunitNestedSerializer(many=True, read_only=True)
    class Meta:
        model = FreeResponseQuestion
        fields = ['id', 'question_text', 'order', 'related_units', 'related_subunits', 'total_possible_points', 'correct_answer']
        raad_only_fields = ['id', 'question_text', 'order', 'correct_answer']

class FreeResponseRubricSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreeResponseRubric
        fields = ['id', 'reasonning_text', 'possible_points']
        read_only_fields = ['id']

class FreeResponseQuestionWriteSerializer(serializers.ModelSerializer):
    related_units = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all(), many=True)
    related_subunits = serializers.PrimaryKeyRelatedField(queryset=Subunit.objects.all(), many=True)
    rubrics = FreeResponseRubricSerializer(many=True)
    class Meta:
        model = FreeResponseQuestion
        fields = ['id', 'question_text', 'order', 'related_units', 'related_subunits', 'total_possible_points', 'correct_answer']
        read_only_fields = ['id']

    def create(self, validated_data):
        related_units = validated_data.pop('related_units', [])
        related_subunits = validated_data.pop('related_subunits', [])
        rubrics = validated_data.pop('rubrics', [])
        free_response_question = FreeResponseQuestion.objects.create(**validated_data)
        free_response_question.related_units.set(related_units)
        free_response_question.related_subunits.set(related_subunits)
        for rubric_data in rubrics:
            rubric_data['question'] = free_response_question
            FreeResponseRubric.objects.create(**rubric_data)
        free_response_question.save()
        return free_response_question

class QuizCreateUpdateSerializer(serializers.ModelSerializer):
    related_class = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all())
    related_units = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all(), many=True)
    related_subunits = serializers.PrimaryKeyRelatedField(queryset=Subunit.objects.all(), many=True)
    class Meta:
        model = Quiz
        fields = ['id', 'name', 'image', 'owner', 'related_class', 'related_units', 
                  'related_subunits']
        read_only_fields = ['id']
        
    def create(self, validated_data):
        related_units = validated_data.pop('related_units', [])
        related_subunits = validated_data.pop('related_subunits', [])
        validated_data['owner'] = Member.objects.get(user=self.context['request'].user)

        quiz = Quiz.objects.create(**validated_data)
        quiz.related_units.set(related_units)
        quiz.related_subunits.set(related_subunits)

        quiz.save()
        return quiz

    def update(self, instance, validated_data):
        related_units = validated_data.pop('related_units', [])
        related_subunits = validated_data.pop('subunits', [])

        quiz = super().update(instance, validated_data)
        
        # Add/remove units based on related_units
        current_units = set(instance.units.values_list('pk', flat=True))
        included_units_in_request = set(related_units)
        added_units = included_units_in_request - current_units
        removed_units = current_units - included_units_in_request
        if added_units:
            quiz.units.add(*added_units)
        if removed_units:
            quiz.units.remove(*removed_units)

        # Add/remove subunits based on related_subunits
        current_subunits = set(instance.units.values_list('pk', flat=True))
        included_subunits_in_request = set(related_subunits)
        added_subunits = included_subunits_in_request - current_subunits
        removed_subunits = current_subunits - included_subunits_in_request
        if added_subunits:
            quiz.subunits.add(*added_subunits)
        if removed_subunits:
            quiz.subunits.remove(*removed_subunits)

        quiz.save()
        return quiz

        
class QuizSerializer(serializers.ModelSerializer):
    owner = SimpleMemberSerializer(read_only=True)
    related_class = ClassSimpleSerializer(read_only=True)
    related_units = UnitNestedSerializer(read_only=True, many=True)
    related_subunits = SubunitNestedSerializer(read_only=True, many=True)
    mcq_questions = MultipleChoiceQuestionReadSerializer(many=True, read_only=True)
    frq_questions = FreeResponseQuestionReadSerializer(many=True, read_only=True)
    class Meta:
        model = Quiz
        fields = ['id', 'name', 'image', 'owner', 'related_class', 'related_units', 
                  'related_subunits', 'questions']
        read_only_fields = ['id', 'name', 'image', 'related_class', 'related_units', 
                  'related_subunits', 'questions']
        
class QuizSimpleSerializer(serializers.ModelSerializer):
    owner = SimpleMemberSerializer(read_only=True)
    related_class = ClassSimpleSerializer(read_only=True)
    related_units = UnitNestedSerializer(read_only=True, many=True)
    related_subunits = SubunitNestedSerializer(read_only=True, many=True)
    class Meta:
        model = Quiz
        fields = ['id', 'name', 'image', 'owner', 'related_class', 'related_units', 
                  'related_subunits']
        read_only_fields = ['id', 'name', 'image', 'related_class', 'related_units', 
                  'related_subunits']
    
class QuizResultWriteSerializer(serializers.ModelSerializer):
    member = serializers.PrimaryKeyRelatedField(queryset=Member.objects.all())
    quiz = serializers.PrimaryKeyRelatedField(queryset=Quiz.objects.all())
    answers = MultipleChoiceAnswerWriteSerializer(many=True)
    class Meta: 
        model = QuizResult
        fields = ['id', 'member', 'quiz', 'number_of_correct_answers', 'number_of_questions', 'answers']
        read_only_fields = ['id']
    def create(self, validated_data):
        answers_data = validated_data.pop('answers', [])
        submitted_quiz = QuizResult.objects.create(**validated_data)
        for answer_data in answers_data:
            answer_data['quiz_result'] = submitted_quiz
            MultipleChoiceAnswer.objects.create(**answer_data)
        return submitted_quiz
    
class QuizResultSerializer(serializers.ModelSerializer):
    member = SimpleMemberSerializer(read_only=True)
    quiz = QuizSerializer(read_only=True)
    answers = MultipleChoiceAnswerReadSerializer(many=True)
    class Meta: 
        model = QuizResult
        fields = ['id', 'member', 'quiz', 'number_of_correct_answers', 'number_of_questions', 'answers', 'date']
        read_only_fields = ['id']

class QuizResultSimpleSerializer(serializers.ModelSerializer):
    quiz = QuizSimpleSerializer(read_only=True)
    class Meta: 
        model = QuizResult
        fields = ['id', 'quiz', 'number_of_correct_answers', 'number_of_questions', 'date']
        read_only_fields = ['id']