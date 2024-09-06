## Running The Backend
To run the backend locally:
1. Clone the repository
2. Ensure that Django, Django Rest Framework, corsheaders and Moviepy are installed (you can do so inside a virtual environment if desired)
    * To create a virtual environment:
        * `python -m venv .venv`
        * You can enter the environment via `.venv\Scripts\activate`, and exit via `deactivate`
    * Install Django and the relevant packages via `python -m pip install Django djangorestframework django-cors-headers`
    * Install Moviepy via `pip install moviepy`
3. Open the terminal and move to the directory *backend/*
4. Input the command `python manage.py runserver`

By default, the Rest Framework API can then be accessed via `http://127.0.0.1:8000/api/` or `http://localhost:8000/api/`. Alternatively, the Django administrative portal can be accessed via `http://localhost:8000/admin/`.
<br>Administrator login details are as follows:
* Username: `admin`
* Password: `db-quoll`

The list of websites that are allowed to read from this Django Project can be set in *backend/core/settings.py* - `CORS_ALLOWED_ORIGINS`.