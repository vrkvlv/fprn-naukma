from django.contrib import admin
from .models import ExchangeProgram

@admin.register(ExchangeProgram)
class ExchangeProgramAdmin(admin.ModelAdmin):
    list_display = ('university','country', 'places', 'deadline')
