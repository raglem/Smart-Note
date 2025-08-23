from django.urls import path
from . import views

urlpatterns = [
    path('', views.QuizListCreateAPIView.as_view(), name='quiz-list-create'),
    path('<int:pk>/', views.QuizDetailAPIView.as_view(), name='quiz-detail'),
    path('questions/bulk-create/', views.QuestionsAPIView.as_view(), name='questions-bulk-create'),
    path('results/', views.QuizResultListCreateAPIView.as_view(), name='quiz-result-list-create'),
    path('results/<int:pk>/', views.QuizResultDetailAPIView.as_view(), name='quiz-result-detail'),
]