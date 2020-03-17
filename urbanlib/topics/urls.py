from django.urls import path, include
from . import views

urlpatterns = [
        path("", view=views.TopicList.as_view(), name='list'),
        #path("", view=views.topics_list, name='list'),
        path("<int:pk>/", view=views.topics_detail, name='detail'),
]
