from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Member
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from .serializers import UserSerializer, MemberSerializer

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
    
class MembersAPIView(ListCreateAPIView):
    """
    API view to retrieve all members.
    """
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAdminUser]