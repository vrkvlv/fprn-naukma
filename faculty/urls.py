from django.contrib import admin
from django.urls import path, include  # <-- 1. Обов'язково імпортуємо include сюди

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('faculty.urls')),  # <-- 2. Підключаємо urls з папки faculty
]
