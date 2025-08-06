from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Member
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, SimpleMemberSerializer, MemberSerializer

class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user).data,
            "message": "User registered successfully."
        })
    
class LoginUserView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
class MembersAPIView(ListCreateAPIView):
    """
    API view to retrieve all members.
    """
    queryset = Member.objects.all()
    serializer_class = SimpleMemberSerializer
    permission_classes = [AllowAny]

class MemberDetailAPIView(RetrieveAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Member.objects.get(user = self.request.user)