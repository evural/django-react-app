from .users.serializers import UserSerializer

# ToDo: We can split JWT token into 2 cookies:
# payload in one cookie and header+signature in another cookie
def my_jwt_response_handler(token, user=None, request=None):
    return {
        'user': UserSerializer(user, context={'request': request}).data
    }
