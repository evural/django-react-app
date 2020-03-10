from django.urls import path, include
from . import views

urlpatterns = [
        path("", view=views.topics_list, name='list'),
        path("<int:pk>/", view=views.topics_detail, name='detail'),
]
