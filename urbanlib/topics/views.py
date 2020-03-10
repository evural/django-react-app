from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.decorators import authentication_classes
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
from rest_framework_jwt.utils import jwt_get_user_id_from_payload_handler

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Topic
from .serializers import *

@api_view(['GET', 'POST'])
def topics_list(request):
    """List topics, or create a new topic."""
    if request.method == 'GET':
        data = []
        next_page = 1
        prev_page = 1
        topics = Topic.objects.all()
        page = request.GET.get('page', 1)
        paginator = Paginator(topics, 10)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)
        serializer = TopicListSerializer(data, context={'request': request}, many=True)
        if data.has_next():
            next_page = data.next_page_number()
        if data.has_previous():
            prev_page = data.previous_page_number()
        return Response({'data': serializer.data, 'count': paginator.count, 'numpages': paginator.num_pages, 'nextlink': '/api/topics/?page=' + str(next_page), 'prevlink': '/api/topics/?page=' + str(prev_page)})

    elif request.method == 'POST':
        print(request.data)
        serializer = TopicSerializer(data=request.data)
        if serializer.is_valid():
            #token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
            #token = request.META.get('HTTP_AUTHORIZATION', " ")
            #data = {'token': token}
            try:
                #valid_data = VerifyJSONWebTokenSerializer().validate(data)
                #user = valid_data['user']
                #request.user = user
                serializer.save(owner=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as v:
                print("validation error", v)
                print(token)
            except Exception as e:
                print(e)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def topics_detail(request, pk):
    """ Retrieve, update, or delete topic by id/pk."""
    try:
        topic = Topic.objects.get(pk=pk)
    except Topic.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TopicSerializer(topic, context={'request':request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TopicSerializer(topic, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        topic.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
