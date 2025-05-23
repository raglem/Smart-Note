from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from users.models import Member
from rest_framework import serializers
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

        # create member with one-to-one relationship with user
        member_id = str(uuid.uuid4())[:8]
        Member.objects.create(name = validated_data['username'], member_id = member_id, user=user)
        
        return user

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['name', 'member_id']
        read_only_fields = ['member_id']