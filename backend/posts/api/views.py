from rest_framework.viewsets import ModelViewSet
from ..models import Post
from .serializers import PostSerializer

# View set for Post model
class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer