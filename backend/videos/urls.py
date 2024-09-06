# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_video, name='upload_video'),
    path('video_list/', views.video_list, name='video_list'),
    path('create-show/', views.create_show, name='create_show'),
    path('shows/', views.show_list, name='show_list'),
    path('shows/<int:show_id>/', views.show_detail, name='show_detail'),
]