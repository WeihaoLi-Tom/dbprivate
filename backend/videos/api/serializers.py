from rest_framework.serializers import ModelSerializer, ValidationError, PrimaryKeyRelatedField
from moviepy.editor import VideoFileClip, ImageClip
from django.conf import settings
import os

from .shared import *
from ..models import Video, Show, Location


class ShowSerializer(ModelSerializer):
    class Meta:
        model = Show
        fields = ['id', 'title', 'artist', 'videos', 'frame_count', 'preview_frame', 'status']
        read_only_fields = ['id', 'created_at']
        # todo - videos here?


class VideoSerializer(ModelSerializer):
    show = PrimaryKeyRelatedField(queryset=Show.objects.all(), allow_null=False)

    class Meta:
        model = Video
        fields = ['id', 'title', 'file', 'show']
        read_only_fields = ['id', 'show', 'uploaded_at']

    def validate_file(self, file):
        # Check that a file has been uploaded
        if not file:
            raise ValidationError("No file uploaded.")

        # Get the show instance associated with this video
        show = None
        if self.instance and self.instance.show: show = self.instance.show
        else:
            show_id = self.initial_data.get('show') or self.validated_data.get('show')
            show = Show.objects.filter(id=show_id).first()
        
        # If no show found, invalid video upload
        if not show: raise ValidationError("Associated show not found.")

        # Check file extensions
        extension = file.name.split('.')[-1].lower()
        try:
            # Store the file locally temporarily, in order to inspect it
            file_path = os.path.join(settings.MEDIA_ROOT, file.name)
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            if extension in VALID_VID_EXTENSIONS:
                # Check video file attributes
                try:
                    video_clip = VideoFileClip(file_path)
                    duration = video_clip.duration
                    resolution = video_clip.size
                    fps = video_clip.fps
                    frames = video_clip.reader.nframes
                    show_frames = show.frame_count

                    # Validation conditions
                    if duration > TIME_LIMIT:
                        raise ValidationError(f"Video is too long. Maximum allowed duration is {TIME_LIMIT // 60} minutes.")
                    if resolution[0] < RESOLUTION[0] or resolution[1] < RESOLUTION[1]:
                        raise ValidationError(f"Video resolution is too small. Must be at least {RESOLUTION[0]} x {RESOLUTION[1]}.")
                    # todo - check this rounding doesn't allow inconsistent uploads...
                    if round(fps, FRAME_DECIMAL_TOLERANCE) != FRAME_RATE:
                        raise ValidationError(f"Video framerate must be {FRAME_RATE}fps.")

                    # Validate and crop video frames
                    for _ in ['foo']:
                        # Crop video to correct length if within margin
                        if show_frames < frames and frames < show_frames + FRAME_MARGIN:
                            self.crop_video(video_clip, file_path, show_frames)
                            duration = show_frames / FRAME_RATE
                            frames = show_frames
                            break 
                        # Otherwise check if not enough frames / too many frames to shorten
                        relation = "=="
                        if frames < show_frames: relation = "<"
                        elif frames > show_frames: relation = ">"
                        else: break  # Do not raise an error if frame count is equal 
                        raise ValidationError(f"Video frame count ({frames}) {relation} Show frame count ({show_frames}).")

                except Exception as e:
                    raise ValidationError(f"Failed to process video file: {clean_error_message(e)}")
                finally: video_clip.close()

            elif extension in VALID_IMG_EXTENSIONS:
                # Validate image file (store source image somewhere perhaps?) - todo            
                try:
                    image_clip = ImageClip(file_path)
                    resolution = image_clip.size

                    # Validation conditions
                    if resolution[0] < RESOLUTION[0] or resolution[1] < RESOLUTION[1]:
                        raise ValidationError(f"Image resolution is too small. Must be at least {RESOLUTION[0]} x {RESOLUTION[1]}.")

                except Exception as e:
                    raise ValidationError(f"Failed to process image file: {clean_error_message(e)}")
                finally: image_clip.close()

            elif extension == 'gif':
                # Handle GIF file - todo
                try:
                    video_clip = VideoFileClip(file_path)
                    duration = video_clip.duration
                    resolution = video_clip.size

                    if duration > TIME_LIMIT:
                        raise ValidationError(f"GIF is too long. Maximum allowed duration is {TIME_LIMIT // 60} minutes.")
                    if resolution[0] < RESOLUTION[0] or resolution[1] < RESOLUTION[1]:
                        raise ValidationError(f"GIF resolution is too small. Must be at least {RESOLUTION[0]} x {RESOLUTION[1]}.")

                except Exception as e:
                    raise ValidationError(f"Failed to process GIF file: {clean_error_message(e)}")
                finally: video_clip.close()

            # If non-valid file extension, raise an error and do not save
            else: raise ValidationError("Unsupported file extension.")
            
        except Exception as e:
            raise ValidationError(f"Failed to handle file: {clean_error_message(e)}")
        finally:
            # Clean up temporary file if it exists
            if file_path and os.path.isfile(file_path): os.remove(file_path)

        return file
    
    def crop_video(self, video_clip: VideoFileClip, path: str, frames: int, fps: float=FRAME_RATE):
        # Overwrites the video object handed to it.
        video_clip = video_clip.subclip(0, frames/fps)
        video_clip.write_videofile(path, codec='libx264', fps=fps)
        return video_clip


class LocationSerializer(ModelSerializer):
    video = PrimaryKeyRelatedField(queryset=Video.objects.all(), allow_null=True)

    class Meta:
        model = Location
        fields = ['id', 'location_number', 'show', 'video']
        read_only_fields = ['id', 'location_number', 'show']
