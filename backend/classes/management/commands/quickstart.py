import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import Member
from classes.models import Class, Unit, Subunit, FileCategory, File
from quizzes.models import Quiz, Question, MultipleChoiceQuestion, FreeResponseQuestion, WrongAnswerChoice
from study_groups.models import StudyGroup, StudyGroupMember

class Command(BaseCommand):
    def handle(self, *args, **options):
        # Reset
        Class.objects.all().delete()
        Unit.objects.all().delete()
        Subunit.objects.all().delete
        FileCategory.objects.all().delete
        Quiz.objects.all().delete
        MultipleChoiceQuestion.objects.all().delete
        FreeResponseQuestion.objects.all().delete
        WrongAnswerChoice.objects.all().delete
        StudyGroup.objects.all().delete
        StudyGroupMember.objects.all().delete

        users = [
            { "username": "test_user", "password": "mypassword" },
            { "username": "Alice", "password": "mypassword" },
            { "username": "Bobby", "password": "mypassword" },
            { "username": "Charlie", "password": "mypassword" },
            { "username": "David", "password": "mypassword" },
            { "username": "Eddy", "password": "mypassword" },
        ]
        usernames = [user['username'] for user in users]

        # Create dummy users and members. Users and members are the only objects that do not assume a hard reset (deletion of all existing objects)
        for user in users:
            username = user['username']
            if not User.objects.filter(username=username).exists() and not Member.objects.filter(name=username).exists():
                created_user = User.objects.create(**user)
                Member.objects.create(name=username, user=created_user)
        all_members = Member.objects.filter(name__in=usernames)
        owner = Member.objects.get(name="test_user")

        # Create dummy classes, units, and subunits with files
        subjects = {
            "Biology": {
                "Evolution": ["Darwin", "Genetics", "Natural Selection"],
                "Cell Biology": ["Organelles", "Mitosis", "Cell Membrane"],
                "Ecology": ["Ecosystems", "Food Chains", "Biomes"],
                "Genetics": ["DNA", "Mendelian", "Mutations"],
                "Human Anatomy": ["Nervous System", "Circulatory System", "Musculoskeletal"],
            },
            "Chemistry": {
                "Atomic Structure": ["Protons", "Neutrons", "Electrons"],
                "Chemical Bonds": ["Ionic", "Covalent", "Metallic"],
                "Stoichiometry": ["Moles", "Balancing Equations", "Limiting Reactants"],
                "Thermochemistry": ["Heat", "Enthalpy", "Entropy"],
                "Acids and Bases": ["pH", "Titration", "Buffer Systems"],
            },
            "Physics": {
                "Mechanics": ["Kinematics", "Forces", "Energy"],
                "Thermodynamics": ["Laws of Thermodynamics", "Engines", "Entropy"],
                "Electromagnetism": ["Electric Fields", "Magnetism", "Circuits"],
                "Waves": ["Sound", "Light", "Doppler Effect"],
                "Modern Physics": ["Relativity", "Quantum", "Nuclear Physics"],
            }
        }

        for subject, units in subjects.items():
            class_obj, _ = Class.objects.get_or_create(
                name=subject,
                owner=owner,
                course_number=f"{subject[:3].upper()}101",
                image=f"{subject}.jpg"
            )
            class_obj.members.set(all_members)

            for order, (unit_name, subunits) in enumerate(units.items(), start=1):
                unit, _ = Unit.objects.get_or_create(
                    name=unit_name,
                    order=order,
                    class_field=class_obj,
                )

                # Create 2 dummy files for the unit
                for i in range(1, 3):
                    File.objects.get_or_create(
                        name=f"{unit_name}_file_{i}",
                        category=unit.category,
                        owner=owner,
                        file=f"Note{random.randint(1,3)}.pdf",
                    )

                for sub_order, subunit_name in enumerate(subunits, start=1):
                    subunit, _ = Subunit.objects.get_or_create(
                        name=subunit_name,
                        order=sub_order,
                        unit=unit,
                    )

                    # Create 2 dummy files for the subunit
                    for j in range(1, 3):
                        File.objects.get_or_create(
                            name=f"{subunit_name}_file_{j}",
                            category=subunit.category,
                            owner=owner,
                            file=f"Note{random.randint(1,3)}.pdf"
                        )

        # Create dummy quizzes
        quiz_names = [
            "Biology Basics",
            "Cell Structure"
            "Chemistry Reactions",
            "Acids and Bases"
            "Physics Laws",
            "Motion"
        ]

        for idx, name in enumerate(quiz_names, start=1):
            class_names = ['Biology', 'Chemistry', 'Physics']
            class_name = class_names[idx // 2]
            related_class = Class.objects.get(name=class_name)
            quiz = Quiz.objects.create(
                name=name,
                image=f"{class_names[idx // 2]}.jpg",
                owner=owner,
                related_class=related_class
            )

            units_list = list(related_class.units.all())
            subunits_list = [sub for unit in units_list for sub in unit.subunits.all()]

            # Attach some random units & subunits if available
            if units:
                quiz.related_units.set(random.sample(units_list, min(3, len(units_list))))
            if subunits:
                quiz.related_subunits.set(random.sample(subunits_list, min(3, len(subunits_list))))

            # Create 3 MCQs
            for q_num in range(1, 4):
                mcq = MultipleChoiceQuestion.objects.create(
                    quiz=quiz,
                    question_text=f"{name} MCQ Question {q_num}: Sample content?",
                    order=q_num,
                    correct_answer="Correct Answer"
                )
                mcq.related_units.set(quiz.related_units.all())
                mcq.related_subunits.set(quiz.related_subunits.all())

                # Add 3 wrong answer choices
                for i in range(1, 4):
                    WrongAnswerChoice.objects.create(
                        question=mcq,
                        choice_text=f"Wrong Answer {i}"
                    )

            # Create 2 FRQs
            for q_num in range(1, 3):
                frq = FreeResponseQuestion.objects.create(
                    quiz=quiz,
                    question_text=f"{name} FRQ Question {q_num}: Explain in detail...",
                    order=3 + q_num,
                    correct_answer="Expected key points for grading",
                    total_possible_points=10
                )
                frq.related_units.set(quiz.related_units.all())
                frq.related_subunits.set(quiz.related_subunits.all())

        #Create dummy study groups
        study_group_names = ['Evolution', 'Chem Final', 'Physics Motion Project']
        for name in study_group_names:
            now = datetime.now()
            start = now + timedelta(days=30)   # ~1 month from now
            end = now + timedelta(days=60)     # ~2 months from now
            
            delta = end - start
            random_seconds = random.randint(0, int(delta.total_seconds()))
            random_datetime = start + timedelta(seconds=random_seconds)
            if not StudyGroup.objects.filter(name=name).exists():
                study_group = StudyGroup.objects.create(
                    name=name,
                    datetime=random_datetime,
                    visibility='Public'
                )
                filtered_members = all_members.exclude(name='test_user')
                random_members = random.sample(list(filtered_members), 3)
                for random_member in random_members:
                    random_status = ['Invited', 'Joined']
                    StudyGroupMember.objects.create(
                        member=random_member,
                        study_group=study_group,
                        status=random_status[random.randint(0, 1)]
                    )
                StudyGroupMember.objects.create(
                        member=owner,
                        study_group=study_group,
                        status=random_status[1]
                    )
