from django.urls import path
from . import views

urlpatterns = [
    path('', views.QuizListCreateAPIView.as_view(), name='quiz-list-create'),
    path('<int:pk>/', views.QuizDetailAPIView.as_view(), name='quiz-detail'),
    path('questions/bulk-create/', views.QuestionsAPIView.as_view(), name='questions-bulk-create'),
    path('submit/', views.QuizSubmitAPIView.as_view(), name='quiz-submit'),
    path('grade/', views.QuizGradeAPIView.as_view(), name='quiz-grade'),
    path('results/', views.QuizResultListAPIView.as_view(), name='quiz-result-list'),
    path('results/<int:pk>/', views.QuizResultDetailAPIView.as_view(), name='quiz-result-detail'),
]