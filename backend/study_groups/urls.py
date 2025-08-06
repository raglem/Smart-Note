from django.urls import path
from .views import StudyGroupCreateAPIView, StudyGroupDetailAPIView, \
                    InviteStudyGroupMembersAPIView, AcceptDeclineInviteStudyGroupAPIView, \
                    LeaveStudyGroupAPIView

urlpatterns = [
    path('', StudyGroupCreateAPIView.as_view(), name='study-group-create'),
    path('<int:pk>/', StudyGroupDetailAPIView.as_view(), name='study-group-detail'),
    path('invite/<int:pk>/', InviteStudyGroupMembersAPIView.as_view(), name='study-group-invite'),
    path('accept-decline/<int:pk>/', AcceptDeclineInviteStudyGroupAPIView.as_view(), name='study-group-accept-decline'),
    path('leave/<int:pk>/', LeaveStudyGroupAPIView.as_view(), name='study-group-leave'),
]