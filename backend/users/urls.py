from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterUserView, MembersAPIView

urlpatterns = [
    path('register/', RegisterUserView.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('members', MembersAPIView.as_view(), name='members-list'),
]