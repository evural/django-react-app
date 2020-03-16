from django.urls import path, include
from . import views

urlpatterns = [
        path("", view=views.UserList.as_view(), name='list'),
        path("me", view=views.current_user, name='detail'),
        path("login/", view=views.CustomTokenView.as_view(), name='login'),
]
