from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
# from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.serializers import ValidationError

from django.conf import settings
from moviepy.editor import VideoFileClip, ImageClip
import os

from .serializers import VideoSerializer, ShowSerializer, LocationSerializer
from .shared import *
from ..models import Video, Show, Location


# View set for Show model
class ShowViewSet(ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer

    def partial_update(self, request):
        instance = self.object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


# View set for Video model
class VideoViewSet(ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_destroy(self, instance):
        # Delete Videos from backend when deleted online
        # todo - later, turn this into an archive action instead
        if instance.file:
            file_path = instance.file.path
            if os.path.isfile(file_path):
                os.remove(file_path)
        super().perform_destroy(instance)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['show'] = self.request.data.get('show')  # Pass the show context
        return context

    def perform_create(self, serializer):
        try:
            show_id = self.request.data.get('show')
            show = Show.objects.get(id=show_id)
            video = serializer.save(show=show)

            # Convert video to MP4 if necessary
            original_file_path = video.file.path
            extension = os.path.splitext(original_file_path)[-1].lower()
            # Drop the '.'
            extension = extension[1:]

            # Only convert if not already the desired extension
            if extension != VID_EXTENSION:
                converted_file_path = os.path.splitext(original_file_path)[0] + '.' + VID_EXTENSION

                # Create video clip
                if extension in VALID_VID_EXTENSIONS or extension == 'gif': 
                    video_clip = VideoFileClip(original_file_path)
                elif extension in VALID_IMG_EXTENSIONS:
                    duration = show.frame_count / FRAME_RATE
                    image_clip = ImageClip(original_file_path, duration=duration)
                    video_clip = image_clip.set_duration(duration).set_fps(FRAME_RATE)
                else:
                    # Cannot convert - should've already detected this via 
                    #   validation, but consider this a failsafe
                    raise ValidationError("Unsupported file extension.")
                
                # Attempt to save the video_clip made
                try:
                    video_clip.write_videofile(converted_file_path, codec='libx264')
                    video_clip.close()
                    
                    os.remove(original_file_path)
                    video.file.name = os.path.relpath(converted_file_path, settings.MEDIA_ROOT)
                    video.save()
                except Exception as e:
                    os.remove(original_file_path)
                    raise ValidationError(f"Failed to convert {extension} to {VID_EXTENSION}: {clean_error_message(e)}")

        except ValidationError as ve:
            # Clean error message before raising it
            raise ValidationError(clean_error_message(ve))
        except Show.DoesNotExist:
            raise ValidationError({'file': f"Show with id={show_id} does not exist."})

# View set for Location model
class LocationViewSet(ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
