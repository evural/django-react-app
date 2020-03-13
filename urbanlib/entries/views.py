from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import EntryReadSerializer, EntryWriteSerializer
from rest_framework.permissions import IsAuthenticated
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope

@api_view(['GET', 'POST'])
#@permission_classes([IsAuthenticated, TokenHasReadWriteScope])
@permission_classes([])
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

@permission_classes([])
@api_view(['GET', 'PUT', 'DELETE'])
def entry_detail(request):
    return Response("success")
