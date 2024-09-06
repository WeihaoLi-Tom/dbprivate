from django.shortcuts import render

# Create your views here.

# views.py
from django.shortcuts import render, redirect
from .models import Video, Show
from .forms import VideoForm, ShowForm

def video_list(request):
    # Very broken right now, I am aware.
    videos = Video.objects.all()
    return render(request, 'videos/video_list.html', {'videos': videos})

def upload_video(request):
    if request.method == 'POST':
        form = VideoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            # Take user to video list page after uploading a video
            # return redirect('video_list')
        # todo - if video upload is not valid, output a diagnostic message here
    else:
        form = VideoForm()
    return render(request, 'videos/upload_video.html', {'form': form})

def create_show(request):
    if request.method == 'POST':
        form = ShowForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('show_list')
    else:
        form = ShowForm()
    return render(request, 'videos/create_show.html', {'form': form})

def show_list(request):
    shows = Show.objects.all()
    return render(request, 'videos/show_list.html', {'shows': shows})

def show_detail(request, show_id):
    show = Show.objects.get(id=show_id)
    return render(request, 'videos/show_detail.html', {'show': show})
