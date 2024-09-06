from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, ShowViewSet, LocationViewSet

video_router = DefaultRouter()
video_router.register(r'videos', VideoViewSet, basename='video')
show_router = DefaultRouter()
show_router.register(r'shows', ShowViewSet, basename='show')
loc_router = DefaultRouter()
loc_router.register(r'locations', LocationViewSet, basename='location')