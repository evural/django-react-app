from rest_framework import serializers
from .models import Topic
from urbanlib.entries.models import Entry 
from urbanlib.entries.serializers import EntryReadSerializer 

class TopicSerializer(serializers.ModelSerializer):

    entry_list = EntryReadSerializer(many=True)

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

class TopicListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('pk', 'text',)
