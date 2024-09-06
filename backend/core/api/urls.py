from django.urls import path, include
from rest_framework.routers import DefaultRouter
from posts.api.urls import post_router
from videos.api.urls import video_router, show_router, loc_router

router = DefaultRouter()
# posts
router.registry.extend(post_router.registry)
# videos & shows
router.registry.extend(show_router.registry)
router.registry.extend(video_router.registry)
router.registry.extend(loc_router.registry)

urlpatterns = [
    path('', include(router.urls))
]