from django.urls import path, include
from . import views

urlpatterns = [
        path("", view=views.entry_list, name='list'),
        path("me", view=views.user_entry_list, name='user_list'),
        path("<int:pk>/", view=views.EntryDetail.as_view(), name='detail'),
]
