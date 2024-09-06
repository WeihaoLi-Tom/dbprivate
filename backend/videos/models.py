# models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from rest_framework.serializers import ValidationError


class Show(models.Model):
    # Tagged state of a show
    class ShowStatus(models.TextChoices):
        IN_DESIGN = 'in_design', 'In Design'
        AWAITING_APPROVAL = 'awaiting_approval', 'Awaiting Approval'
        APPROVED = 'approved', 'Approved'
        SHOWING = 'showing', 'Showing'
        ARCHIVED = 'archived', 'Archived'

    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    frame_count = models.PositiveIntegerField(editable=True, validators=[MaxValueValidator(30*5*60)])
    preview_frame = models.PositiveIntegerField(editable=True, auto_created=True, default=0)
    status = models.CharField(max_length=20, choices=ShowStatus.choices, default=ShowStatus.IN_DESIGN)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title}, by {self.artist} | ({self.get_status_display()})"
    
    # Override the save method to generate video locations for the show
    def save(self, *args, **kwargs):
        super(Show, self).save(*args, **kwargs)
        # Set video locations blank by default
        if not Location.objects.filter(show=self).exists():
            locations = [Location(show_id=self.id, location_number=i) for i in range(1, 227)]
            Location.objects.bulk_create(locations)


class Video(models.Model):
    # Foreign key - show
    show = models.ForeignKey(Show, related_name='videos', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='media/videos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('show', 'file')

    def clean(self):
        # Extra validation to ensure videos aren't set to different shows
        if self.pk and self.show_id != Video.objects.get(pk=self.pk).show_id:
            raise ValidationError("Videos cannot be reassigned to different shows.")

    def __str__(self):
        return self.title + " | in " + str(self.show)


class Location(models.Model):
    # Foreign keys - show, video
    show = models.ForeignKey(Show, related_name='locations', on_delete=models.CASCADE)
    video = models.ForeignKey(Video, related_name='locations', on_delete=models.SET_NULL, null=True, blank=True)
    location_number = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(226)])

    class Meta:
        unique_together = ('show', 'location_number')

    def clean(self):
        # Extra validation to ensure videos from different shows aren't set to a location
        if self.video and self.video.show != self.show:
            raise ValidationError("The video must belong to the same show as the location.")

    def __str__(self):
        if self.pk: return f"{self.show.title}, L:{self.location_number}\
            {'' if self.video == None else f' - ({self.video.title})'}"
        else: return "Deleted Location"