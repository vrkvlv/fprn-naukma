from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=200, verbose_name="Назва кафедри")
    head = models.CharField(max_length=150, verbose_name="Завідувач кафедри")

    def __str__(self):
        return self.name

class Specialty(models.Model):
    name = models.CharField(max_length=200, verbose_name="Назва")
    code = models.CharField(max_length=20, verbose_name="Код")
    description = models.TextField(verbose_name="Опис")
    coordinator_name = models.CharField(max_length=150, verbose_name="Імʼя координатора")
    coordinator_contact = models.CharField(max_length=150, verbose_name="Контакт координатора")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='specialties', verbose_name="Випускова кафедра")
    disciplines = models.TextField(verbose_name="Список дисциплін (через кому або з нового рядка)")

    def __str__(self):
        return f"{self.code} - {self.name}"

class Teacher(models.Model):
    name = models.CharField(max_length=150, verbose_name="Імʼя")
    position = models.CharField(max_length=100, verbose_name="Посада")
    degree = models.CharField(max_length=100, verbose_name="Науковий ступінь")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='teachers', verbose_name="Кафедра")

    def __str__(self):
        return self.name

class HomePageContent(models.Model):
    description = models.TextField(verbose_name="Опис факультету")
    main_info = models.TextField(verbose_name="Основна інформація")
    contacts = models.TextField(verbose_name="Контакти")

    def __str__(self):
        return "Контент головної сторінки"

