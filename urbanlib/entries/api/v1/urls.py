'''
from rest_framework import routers

from . import views

entries_router = routers.SimpleRouter()
entries_router.register(r'', views.entry_list, basename='list')
entries_router.register(r'me', views.user_entry_list, basename='user_list')
entries_router.register(r'<int:pk>/', views.EntryDetail.as_view(), basename='detail')
'''

from django.urls import path, include
from . import views

entries_urls = [
        path("", view=views.entry_list, name='list'),
        path("me", view=views.user_entry_list, name='user_list'),
        path("<int:pk>/", view=views.EntryDetail.as_view(), name='detail'),
]

