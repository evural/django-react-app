from rest_framework import serializers
from urbanlib.entries.models import Entry
from urbanlib.topics.models import Topic

class TopicReferenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Topic
        fields = ('pk', 'text')

class EntryWriteSerializer(serializers.ModelSerializer):

    topic = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all()
    )
    class Meta:
        model = Entry
        fields = ('pk', 'text', 'topic',)

class EntryReadSerializer(serializers.ModelSerializer):

    topic = TopicReferenceSerializer(read_only=True)
    author = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
     )
    created_at = serializers.DateTimeField(format="%Y.%m.%d %H:%M", read_only=True)
    class Meta:
        model = Entry
        fields = ('pk', 'text', 'topic', 'author', 'created_at',)

class EntryListSerializer(serializers.ModelSerializer):

    author = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
     )
    created_at = serializers.DateTimeField(format="%Y.%m.%d %H:%M", read_only=True)
    class Meta:
        model = Entry
        fields = ('pk', 'text', 'author', 'created_at',)

