from rest_framework import serializers
from .models import Anuncio, Mensagem, Chat, User

class AnuncioSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField()

    class Meta:
        model = Anuncio
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ChatSerializer(serializers.ModelSerializer):
    usuario_visitante = serializers.StringRelatedField()
    anuncio = serializers.StringRelatedField()

    class Meta:
        model = Chat
        fields = '__all__'

class MensagemSerializer(serializers.ModelSerializer):
    usuario = UserSerializer()
    class Meta:
        model = Mensagem
        fields = '__all__'