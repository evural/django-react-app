from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken
from datetime import datetime

from oauth2_provider.settings import oauth2_settings
from braces.views import CsrfExemptMixin
from oauth2_provider.views.mixins import OAuthLibMixin

import json

from django.utils.decorators import method_decorator
from django.http import HttpResponse
from django.views.generic import View
from django.views.decorators.debug import sensitive_post_parameters
from django.utils.translation import gettext_lazy as _
from django.db import transaction
import traceback
from oauth2_provider.views import TokenView

from django.http import HttpResponse
from oauth2_provider.models import get_access_token_model, get_application_model
from oauth2_provider.signals import app_authorized


class CustomTokenView(TokenView):
    @method_decorator(sensitive_post_parameters("password"))
    def post(self, request, *args, **kwargs):
        url, headers, body, status = self.create_token_response(request)
        if status == 200:
            body = json.loads(body)
            access_token = body.get("access_token")
            if access_token is not None:
                token = get_access_token_model().objects.get(
                    token=access_token)
                app_authorized.send(
                    sender=self, request=request,
                    token=token)
                body['member'] = {
                    'id': token.user.id,
                    'username': token.user.username,
                    'email': token.user.email
                }
                body = json.dumps(body)
        response = HttpResponse(content=body, status=status)
        for k, v in headers.items():
            response[k] = v
        return response


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class UserList(CsrfExemptMixin, OAuthLibMixin, APIView):
    permission_classes = (permissions.AllowAny,)

    server_class = oauth2_settings.OAUTH2_SERVER_CLASS
    validator_class = oauth2_settings.OAUTH2_VALIDATOR_CLASS
    oauthlib_backend_class = oauth2_settings.OAUTH2_BACKEND_CLASS
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        if request.auth is None:
            # ToDo: This is unnecessary.
            # I had to add this becase the oauthlib tries to access request body
            req_body = request.body
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                try:
                    with transaction.atomic():
                        user = serializer.save()
                        url, headers, body, token_status = self.create_token_response(request)
                        if token_status != 200:
                            raise Exception(json.loads(body).get("error", ""))

                        return Response(json.loads(body), status=token_status)
                        #view = TokenView.as_view()
                        #return view(request, *args, **kwargs)
                except Exception as e:
                    traceback.print_exc()
                    return Response(data={"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)
