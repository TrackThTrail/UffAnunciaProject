from rest_framework import serializers
from .models import Anuncio, ChatMessage

class AnuncioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anuncio
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'message', 'sender', 'timestamp', 'anuncio']