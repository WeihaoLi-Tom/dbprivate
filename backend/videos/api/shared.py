from rest_framework.serializers import ValidationError

# VIDEO FILE CONSTRAINTS
RESOLUTION = (854, 480)         # 480p 16:9
FRAME_RATE = 30                 # 30 FPS
FRAME_MARGIN = FRAME_RATE       # The frame margin by which too long videos will be accepted and cropped
FRAME_DECIMAL_TOLERANCE = 1     # Decimal place accuracy of framerate
TIME_LIMIT = 5*60               # 5 minute cap
VID_EXTENSION = 'mp4'           # Preferred video file extension

VALID_VID_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'webm']
VALID_IMG_EXTENSIONS = ['jpg', 'jpeg']

def clean_error_message(error):
        """ Takes a serializers.ValidationError `error` and converts it to 
        string form, dropping all the unnecessary fluff around the error itself.
        Returns this string. """
        # If error is a ValidationError, clean it
        if isinstance(error, ValidationError):
            error_message = str(error)
            # Strip unnecessary parts of error
            error_message = error_message.replace("ErrorDetail(string=", "").replace(", code='invalid')", "")
            error_message = error_message.replace("[", "").replace("]", "").replace('"', "").replace("'", "")
            return error_message

        # Otherwise, return it as is
        return str(error)
