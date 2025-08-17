from django.urls import path
from . import views

urlpatterns = [
    path('', views.QuizListCreateAPIView.as_view(), name='quiz-list-create'),
    path('<int:pk>/', views.QuizDetailAPIView.as_view(), name='quiz-detail')
]