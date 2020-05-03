from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.decorators import authentication_classes
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
from rest_framework_jwt.utils import jwt_get_user_id_from_payload_handler

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from urbanlib.topics.models import Topic
from urbanlib.topics.api.v1.serializers import *
from urbanlib.pagination import PaginationHandlerMixin, BasicPagination
from rest_framework import permissions
from urbanlib.permissions import IsAuthenticatedOrReadOnly

class TopicList(APIView, PaginationHandlerMixin):
    serializer_class = TopicListSerializer
    pagination_class = BasicPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        """
        Return a list of all topics.
        """
        topics = Topic.objects.all()
        serializer = self.serializer_class(topics, many=True)
        page = self.paginate_queryset(topics)
        if page is not None:
            serializer = self.get_paginated_response(self.serializer_class(page, many=True).data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        """
        Create a topic with an initial entry
        """
        serializer = TopicWriteSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(owner=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as v:
                print("validation error", v)
                print(token)
            except Exception as e:
                print(e)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'data': serializer.data, 'count': paginator.count, 'numpages': paginator.num_pages, 'nextlink': '/api/topics/?page=' + str(next_page), 'prevlink': '/api/topics/?page=' + str(prev_page)})


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([])
def topics_detail(request, pk):
    """ Retrieve, update, or delete topic by id/pk."""
    try:
        topic = Topic.objects.get(pk=pk)
    except Topic.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TopicReadSerializer(topic, context={'request':request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TopicWriteSerializer(topic, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        topic.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


