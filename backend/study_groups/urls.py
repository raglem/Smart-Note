from django.urls import path
from .views import StudyGroupCreateAPIView, StudyGroupDetailAPIView, InviteStudyGroupMembersAPIView

urlpatterns = [
    path('', StudyGroupCreateAPIView.as_view(), name='study-group-create'),
    path('<int:pk>/', StudyGroupDetailAPIView.as_view(), name='study-group-detail'),
    path('invite/<int:pk>/', InviteStudyGroupMembersAPIView.as_view(), name='study-group-invite')
]