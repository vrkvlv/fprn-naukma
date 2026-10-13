from django.shortcuts import render
from django.utils import timezone
from .models import ExchangeProgram


def exchange_list(request):
    programs = ExchangeProgram.objects.all()
    today = timezone.now().date()

    for program in programs:
        program.is_open = program.deadline >= today

    return render(request, 'exchange/list.html', {'programs': programs})
