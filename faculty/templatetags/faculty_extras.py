"""Template helpers for the faculty frontend.

They only read existing models, so views stay unchanged.
"""

import re

from django import template

from faculty.models import Department, Specialty, Teacher

register = template.Library()

ADMISSION_URL = "https://vstup.ukma.edu.ua/"
UKMA_URL = "https://www.ukma.edu.ua/"

# Order matters: "фізичного виховання" must be checked before "фіз".
TOPIC_KEYWORDS = [
    ("виховання", "sport"),
    ("спорт", "sport"),
    ("діагност", "diagnostics"),
    ("біолог", "biology"),
    ("еколог", "ecology"),
    ("хім", "chemistry"),
    ("фіз", "physics"),
]


@register.filter
def topic(text):
    """Pick an accent colour/illustration theme from a name like 'Кафедра хімії'."""
    lowered = str(text).lower()
    for keyword, name in TOPIC_KEYWORDS:
        if keyword in lowered:
            return name
    return "general"


@register.filter
def split_items(text):
    """Split a list typed in the admin by new lines or commas."""
    parts = re.split(r"[\n,;]+", str(text or ""))
    return [part.strip(" -•\t\r") for part in parts if part.strip(" -•\t\r")]


@register.filter
def initials(name):
    return "".join(part[0] for part in str(name).split()[:2]).upper()


@register.filter
def is_email(value):
    return "@" in str(value) and " " not in str(value).strip()


@register.simple_tag
def all_departments():
    return Department.objects.all()


@register.simple_tag
def all_specialties():
    return Specialty.objects.select_related("department")


@register.simple_tag
def site_links():
    return {"admission": ADMISSION_URL, "ukma": UKMA_URL}


@register.simple_tag
def faculty_facts():
    return [
        {"value": Department.objects.count(), "label": "Кафедри"},
        {"value": Specialty.objects.count(), "label": "Освітні програми"},
        {"value": Teacher.objects.count(), "label": "Викладачі"},
        {"value": 1615, "label": "Рік заснування Академії"},
    ]
