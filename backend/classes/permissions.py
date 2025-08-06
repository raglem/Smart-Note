from rest_framework.permissions import BasePermission
from .models import Class

class IsOwnerOrMemberOfClass(BasePermission):
    """
    Custom permission to only allow members of a class to access it.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if the request has a class_id field
        if 'class_id' not in request.data:
            return False

        # Check if the class_id is provided
        class_id = request.data['class_id']
        if class_id is None:
            return False
        
        try:
            member = request.user.member
            class_instance = Class.objects.get(id=class_id)

            # Check if the class exists
            if class_instance is None:
                return False
            
            # Check if the current user is the owner or a member of the class
            return class_instance.owner == member or member in class_instance.members.all()
        except AttributeError:
            return False
        
class IsOwnerOfClass(BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if the request has a class_id field
        if 'class_id' not in request.data:
            return False

        # Check if the class_id is provided
        class_id = request.data['class_id']
        if class_id is None:
            return False
        
        try:
            member = request.user.member
            class_instance = Class.objects.get(id=class_id)

            # Check if the class exists
            if class_instance is None:
                return False
            
            # Check if the current user is the owner
            return class_instance.owner == member
        except AttributeError:
            return False