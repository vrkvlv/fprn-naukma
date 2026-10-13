from django.db import models


class ExchangeProgram(models.Model):
    university = models.CharField(max_length=255, verbose_name="Університет")
    languages = models.CharField(max_length=255, verbose_name="Мови навчання")
    places = models.PositiveIntegerField(null=True, verbose_name="Число місць")
    country = models.CharField(max_length=100, blank=True, null=True, verbose_name="Країна")
    deadline = models.DateField(verbose_name="Дедлайн подачі")
    description = models.TextField(verbose_name="Опис")

    def __str__(self):
        return self.university
