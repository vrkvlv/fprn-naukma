from django.contrib import admin
from .models import Department, Specialty, Teacher, HomePageContent

admin.site.register(Department)
admin.site.register(Specialty)
admin.site.register(Teacher)
admin.site.register(HomePageContent)
