from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from .models import User
from django.contrib.auth.hashers import make_password


class UserSerializerWithPayload(serializers.ModelSerializer):
    payload = serializers.SerializerMethodField()

    def get_payload(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER

        payload = jwt_payload_handler(obj)
        return payload

    class Meta:
        model = User
        fields = ('username', 'payload')

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('pk', 'email', 'username', 'password', 'name',)

    def create(self, validated_data):

        password = validated_data.pop('password')
        hashed_password = make_password(password)
        user = User.objects.create(password=hashed_password, **validated_data)
        # Return a Dataitem instance
        return user


class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')
