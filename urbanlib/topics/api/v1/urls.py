'''
from rest_framework import routers

from . import views

topics_router = routers.SimpleRouter()
#topics_router.register(r'', views.TopicList.as_view(), basename='list')
topics_router.register(r'', views.TopicList, basename='list')
topics_router.register(r'<int:pk>/', views.topics_detail, basename='detail')
'''

from django.urls import path, include
from . import views

topics_urls = [
        path("", view=views.TopicList.as_view(), name='list'),
        #path("", view=views.topics_list, name='list'),
        path("<int:pk>/", view=views.topics_detail, name='detail'),
]
