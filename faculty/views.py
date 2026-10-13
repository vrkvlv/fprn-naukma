from django.shortcuts import render, get_object_or_404
from .models import Department, Specialty, HomePageContent

def home_view(request):
    # Беремо перший запис, якщо він є
    content = HomePageContent.objects.first()
    return render(request, 'faculty/home.html', {'content': content})

def programs_list_view(request):
    specialties = Specialty.objects.all()
    return render(request, 'faculty/programs.html', {'specialties': specialties})

def program_detail_view(request, id):
    specialty = get_object_or_404(Specialty, id=id)
    return render(request, 'faculty/program_detail.html', {'specialty': specialty})

def departments_list_view(request):
    departments = Department.objects.prefetch_related('specialties').all()
    return render(request, 'faculty/departments.html', {'departments': departments})

def department_detail_view(request, id):
    department = get_object_or_404(Department, id=id)
    return render(request, 'faculty/department_detail.html', {'department': department})
