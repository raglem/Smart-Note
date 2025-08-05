from django.shortcuts import render
from rest_framework import generics, parsers, permissions, status, response, views
from rest_framework.response import Response
from .models import Class, File, Unit, Subunit, FileCategory
from .serializers import (
    BulkFileCreateSerializer, ClassSerializer, ClassCreateSerializer, FileCreateSerializer, FileSerializer,
    UnitSerializer, UnitCreateSerializer,
    SubunitSerializerFull, ClassUnitSubunitSerializer, ClassUnitSubunitSerializerFull,
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

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ClassCreateSerializer
        return super().get_serializer_class()
    
class ClassDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve specific classes.
    """
    queryset = Class.objects.prefetch_related('units')
    serializer_class = ClassUnitSubunitSerializerFull
    permission_classes = [permissions.IsAuthenticated]

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

