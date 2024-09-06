from django import forms
from .models import Video, Show

class VideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ['title', 'file'] 

    def clean_file(self):
        file = self.cleaned_data.get('file')

        # First check that data exists
        if file:
            # Check file extensions
            video_extensions = ['mp4', 'mov', 'avi', 'mkv']
            image_extensions = ['jpg', 'jpeg', 'png']
            extension = file.name.split('.')[-1].lower()

            # Video extensions
            if extension in video_extensions:
                # todo - convert to standardized mp4, and check other details
                return file
            elif extension in image_extensions:
                # Store source image and convert to mp4 here.
                return file
            # todo - other file extensions checked here
            
            # If non valid extension, raise form error
            else: raise forms.ValidationError('Unsupported file extension.')

class ShowForm(forms.ModelForm):
    class Meta:
        model = Show
        fields = ['title', 'artist']
        # todo - can get artist info from currently logged in user name instead
        widgets = {
            'videos': forms.CheckboxSelectMultiple(),
        }
