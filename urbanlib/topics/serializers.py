from rest_framework import serializers
from .models import Topic
from urbanlib.entries.models import Entry 
from urbanlib.entries.serializers import EntryListSerializer 
from django.core.paginator import Paginator, EmptyPage

class TopicWriteSerializer(serializers.ModelSerializer):

    entry_list = EntryListSerializer(many=True)

    class Meta:
        model = Topic
        fields = ('pk', 'text', 'entry_list')

    def create(self, validated_data):

        entries_data = validated_data.pop('entry_list')
        # First we create the topic
        topic = Topic.objects.create(**validated_data)
        # Now we create the entry for the topic
        for entry_data in entries_data:
            entry = Entry.objects.create(topic=topic, author=topic.owner, **entry_data)
            #entry = Entry.objects.create(topic=topic, author=validated_data.get('owner'), **entry_data)

        # Return a Dataitem instance
        return topic

class TopicReadSerializer(serializers.ModelSerializer):

    entry_list = serializers.SerializerMethodField('paginated_entry_list')

    def paginated_entry_list(self, obj):
            page_size = self.context['request'].query_params.get('size') or 10
            paginator = Paginator(obj.entry_list.all(), page_size)
            page = self.context['request'].query_params.get('page') or 1
            try:
                entry_list = paginator.page(page)
            except EmptyPage:
                entry_list = paginator.page(paginator.num_pages)
            serializer = EntryListSerializer(entry_list, many=True)

            return serializer.data

    class Meta:
        model = Topic
        fields = ('pk', 'text', 'entry_list')

class TopicListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('pk', 'text',)
