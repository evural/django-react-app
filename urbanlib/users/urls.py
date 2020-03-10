from django.urls import path, include
from . import views

urlpatterns = [
        path("", view=views.user_list, name='list'),
]
