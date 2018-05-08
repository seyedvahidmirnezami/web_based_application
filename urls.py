"""Aria URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from aria_test1 import views

# urlpatterns = [
#     url(r'^admin/', admin.site.urls),
#     url(r'^aria_test1/', include('aria_test1.urls')),
#     url(r'^thresh/', views.thresh_view, name='thresh'),
#     url(r'', views.index, name='index'),
# ]

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^aria_test1/', views.index, name='home'),
    # url(r'^hsv/', views.hsv_view, name='hsv'),
    # url(r'^rgb/', views.rgb_view, name='rgb'),
    # url(r'^lab/', views.lab_view, name='lab'),
    # url(r'^img_test/', views.img_test, name='img_test'),
    # url(r'^rgb/(?P<obj_id>\d{5})/$', views.rgb_view, name='rgb_img'),
    # url(r'^threshold/', views.threshold, name='threshold'),
    url(r'^invert/', views.invert, name='invert'),
    url(r'^filter/', views.filter, name='filter')
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# (?P<base>\w{0,50})/$