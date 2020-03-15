from django.urls import path, include
from . import views

urlpatterns = [
        path("", view=views.UserList.as_view(), name='list'),
        path("login/", view=views.CustomTokenView.as_view(), name='login'),
]
