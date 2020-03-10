from django.urls import path, include
from . import views

urlpatterns = [
        path("", view=views.entry_list, name='list'),
        path("<int:pk>/", view=views.entry_detail, name='detail'),
]
