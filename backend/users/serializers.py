from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from users.models import Member
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import uuid

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'member']
        read_only_fields = ['id', 'member']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def create(self, validated_data):
        # encrypt password and create user
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)

        Member.objects.create(name = validated_data['username'], user=user)
        
        return user

class SimpleMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'name', 'member_id']
        read_only_fields = ['id', 'member_id']
    
class MemberSerializer(serializers.ModelSerializer):
    friends = SimpleMemberSerializer(many=True)
    class Meta:
        model = Member
        fields = ['id', 'name', 'member_id', 'friends']
        read_only_fields = ['id', 'member_id']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # add username to the token payload
        token['username'] = user.username  
        return token
