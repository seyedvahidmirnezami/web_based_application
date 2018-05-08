from django.contrib import admin

# Register your models here.
from .models import rgb, hsv, choice, lab

admin.site.register(rgb)
admin.site.register(hsv)
admin.site.register(choice)
admin.site.register(lab)