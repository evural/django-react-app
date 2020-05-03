from django.core.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from urbanlib.entries.api.v1.serializers import EntryReadSerializer, EntryWriteSerializer
from rest_framework import permissions
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from urbanlib.entries.models import Entry
from django.http import Http404
from urbanlib.permissions import IsAuthenticatedOrReadOnly
from urbanlib.pagination import PaginationHandlerMixin, BasicPagination

class EntryList(PaginationHandlerMixin, APIView):
    serializer_class = EntryWriteSerializer
    pagination_class = BasicPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request, format=None):
        serializer = serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(author=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as v:
                print("validation error", v)
            except Exception as e:
                print(e)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
#@permission_classes([IsAuthenticated, TokenHasReadWriteScope])
@permission_classes([])
def entry_list(request):
    """List entries or create a new entry under a topic"""
    if request.method == "POST":
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

    """
    Object-level permission to only allow updating his own entries
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # obj here is an Entry instance
        return obj.author == request.user


class EntryDetail(APIView):
    permission_classes = [OwnEntryPermission]

    def get_object(self, pk):
        try:
            return Entry.objects.get(pk=pk)
        except Entry.DoesNotExist:
            raise Http404

    def delete(self, request, pk, format=None):
        entry = self.get_object(pk)
        self.check_object_permissions(request, entry)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
