from django.urls import path

from . import views

urlpatterns = [
    path("", views.home_view, name="home"),
    path("programs/", views.programs_list_view, name="programs"),
    path("programs/<int:id>/", views.program_detail_view, name="program_detail"),
    path("departments/", views.departments_list_view, name="departments"),
    path(
        "departments/<int:id>/",
        views.department_detail_view,
        name="department_detail",
    ),
]
