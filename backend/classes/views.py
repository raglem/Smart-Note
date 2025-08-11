import random
from django.db.models import Q
from django.shortcuts import get_object_or_404, render
from rest_framework import generics, parsers, permissions, status, response, views
from rest_framework.response import Response
from .models import Class, File, Unit, Subunit, FileCategory
from .serializers import (
    BulkFileCreateSerializer, 
    ClassSerializer, ClassCreateSerializer, ClassSearchSerializer,
    FileCreateSerializer, FileSerializer,
    UnitSerializer, UnitCreateSerializer,
    SubunitSerializerFull, ClassUnitSubunitSerializerFull,
    FileCategorySerializer,
)
from .permissions import IsOwnerOrMemberOfClass, IsOwnerOfClass
from users.models import Member

# Create and list classes
# ClassSerializer is simple, does NOT include all files and nested subunits
class ClassCreateListAPIView(generics.ListCreateAPIView):
    """
    API view to retrieve and create classes.
    """
    queryset = Class.objects.prefetch_related('units')
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser]

    def get_queryset(self):
        user = self.request.user
        member = get_object_or_404(Member, user=user)
        return Class.objects.filter(Q(members=member) | Q(owner=member)).distinct()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ClassCreateSerializer
        return super().get_serializer_class()
    
class ClassDetailAPIView(generics.RetrieveUpdateAPIView):
    """
    API view to retrieve specific classes.
    """
    queryset = Class.objects.prefetch_related('units')
    serializer_class = ClassUnitSubunitSerializerFull
    permission_classes = [permissions.IsAuthenticated]

class ClassSearchAPIView(generics.ListAPIView):
    queryset = Class.objects.prefetch_related('units')
    serializer_class = ClassSearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Class.objects.prefetch_related('units')
        search = self.request.query_params.get('join_code', None)

        if search:
            queryset = queryset.filter(join_code__istartswith=search)
        return queryset[:10]

class ClassJoinAPIView(views.APIView):
    def post(self, request, join_code):
        if not request.user.is_authenticated:
            return Response(
                {"message": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        class_instance = get_object_or_404(Class, join_code=join_code)
        member = get_object_or_404(Member, user=request.user)
        if member in class_instance.members.all() or member == class_instance.owner:
            return Response(
                { "message": f"{member.name} is already a member or owner of class {class_instance.name}" },
                status=status.HTTP_400_BAD_REQUEST
            )
        class_instance.members.add(member)
        serialized_class = ClassSerializer(class_instance)
        return Response(serialized_class.data, status=status.HTTP_200_OK)
    
class ClassLeaveAPIView(views.APIView):
    def delete(self, request, pk, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {"message": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            class_instance = Class.objects.get(pk=pk)
        except Class.DoesNotExist:
            return Response({"message": "Class not found."}, status=status.HTTP_404_NOT_FOUND) 
        try:
            member = Member.objects.get(user=request.user)
        except Member.DoesNotExist:
            return Response(
                {"message": "Member not found."},
                status=status.HTTP_404_NOT_FOUND
            ) 
        
        # Remove authenticated member from the class. If the member is the owner of the class, transfer ownership
        if member in class_instance.members.all():
            class_instance.members.remove(member)
            return Response({ 
                "message": f"Successfully left {class_instance.name}", "class": class_instance.id 
                }, status=status.HTTP_200_OK)
        elif member == class_instance.owner:
            members_list = list(class_instance.members.all())
            if members_list:
                random_member = random.choice(members_list)
                class_instance.owner = random_member
                class_instance.members.remove(member)
                class_instance.save()
                return Response(
                    {
                        "message": f"Successfully left {class_instance.name} and ownership transferred to {random_member.name}",
                        "class": class_instance.id
                    },
                    status=status.HTTP_200_OK
                )
            else:
                class_instance.delete()
                return Response(
                    {
                        "message": f"No other members to transfer ownership for {class_instance.name}. {class_instance} was deleted"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response({"message": f"{member.name} is not a member or owner of class {class_instance.name}"})


class UnitCreateAPIView(generics.CreateAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class UnitDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, and delete units.
    """
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.IsAuthenticated, IsOwnerOrMemberOfClass]

    def get_serializer_class(self):
        if self.request.method == 'POST' or self.request.method == 'PUT':
            return UnitCreateSerializer
        return super().get_serializer_class()

class SubunitDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, and delete subunits.
    """
    queryset = Subunit.objects.all()
    serializer_class = SubunitSerializerFull
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.IsAuthenticated, IsOwnerOrMemberOfClass]

class SubunitCreateAPIView(generics.CreateAPIView):
    queryset = Subunit.objects.all()
    serializer_class = SubunitSerializerFull
    permission_classes = [permissions.IsAuthenticated]

class FileCategoryAPIView(generics.ListCreateAPIView):
    """
    API view to retrieve and create file categories.
    """
    queryset = FileCategory.objects.all()
    serializer_class = FileCategorySerializer
    permission_classes = [permissions.AllowAny]

class FileCategoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve and create file categories.
    """
    queryset = FileCategory.objects.all()
    serializer_class = FileCategorySerializer
    permission_classes = [permissions.AllowAny]

class FileDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve and create file categories.
    """
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.AllowAny]

class FileCreateAPIView(generics.CreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileCreateSerializer
    parser_classes = [parsers.MultiPartParser]
    permission_classes = [permissions.IsAuthenticated]

class BulkFileCreateAPIView(generics.CreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileCreateSerializer
    parser_classes = [parsers.MultiPartParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = BulkFileCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            files = serializer.save()
            return Response({'success': True, 'created': [f.id for f in files]}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

