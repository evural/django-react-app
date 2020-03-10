from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import EntryReadSerializer, EntryWriteSerializer

@api_view(['GET', 'POST'])
def entry_list(request):
    """List entries or create a new entry under a topic"""
    if request.method == "GET":
        return Response("Success")
    elif request.method == "POST":
        serializer = EntryWriteSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(author=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as v:
                print("validation error", v)
                print(token)
            except Exception as e:
                print(e)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def entry_detail(request):
    return Response("success")
