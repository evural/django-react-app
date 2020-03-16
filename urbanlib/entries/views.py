from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import EntryReadSerializer, EntryWriteSerializer
from rest_framework import permissions
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from .models import Entry

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

@api_view(['GET'])
#@permission_classes([IsAuthenticated, TokenHasReadWriteScope])
def user_entry_list(request):
    """List entries of current user"""
    entries = Entry.objects.filter(author_id=request.user.id)
    serializer = EntryReadSerializer(entries, context={'request': request}, many=True)
    return Response({'data': serializer.data})

class OwnEntryPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        print("aaaaaaaaaaaa")
        if request.method in permissions.SAFE_METHODS:
            return True
        return False
    """
    Object-level permission to only allow updating his own entries
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        print(obj.user)
        print(request.user)
        # obj here is a UserProfile instance
        return obj.user == request.user


#@permission_classes([OwnEntryPermission])
@permission_classes([OwnEntryPermission,])
@api_view(['GET', 'PUT', 'DELETE'])
def entry_detail(request, pk):
    try:
        entry = Entry.objects.get(pk=pk)
        print("get entry")
        print(request.method)
        if request.method == "DELETE":
            print("delete method")
            #entry.delete()
            print("after delete")
            return Response(status=status.HTTP_204_NO_CONTENT)
    except Entry.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)

    return Response("success")
