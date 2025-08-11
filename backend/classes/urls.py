from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.ClassCreateListAPIView.as_view(), name='class-create-list'),
    path('search/', views.ClassSearchAPIView.as_view(), name='class-search'),
    path('join/<str:join_code>/', views.ClassJoinAPIView.as_view(), name='class-join'),
    path('<int:pk>/', views.ClassDetailAPIView.as_view(), name='class-detail'),
    path('leave/<int:pk>/', views.ClassLeaveAPIView.as_view(), name='class-leave'),
    path('units/', views.UnitCreateAPIView.as_view(), name='unit-create'),
    path('units/<int:pk>/', views.UnitDetailAPIView.as_view(), name='unit-detail'),
    path('subunits/', views.SubunitCreateAPIView.as_view(), name='subunit-create'),
    path('subunits/<int:pk>/', views.SubunitDetailAPIView.as_view(), name='subunit-detail'),
    path('file-categories/', views.FileCategoryAPIView.as_view(), name='file-category-list'),
    path('file-categories/<int:pk>/', views.FileCategoryDetailAPIView.as_view(), name='file-category-detail'),
    path('files/<int:pk>/', views.FileDetailAPIView.as_view(), name='file-detail'),
    path('files/create/', views.FileCreateAPIView.as_view(), name='file-create'),
    path('files/bulk-create/', views.BulkFileCreateAPIView.as_view(), name='files-bulk-create'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

