from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import viewsets, status
from .models import Anuncio, ChatMessage
from .serializers import AnuncioSerializer, ChatMessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Anuncio
from .serializers import AnuncioSerializer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class AnuncioViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer

    def create(self, request):
        nome = request.data.get('nome')
        categoria = request.data.get('categoria')
        valor = request.data.get('valor')
        usuario = request.user
        anuncio = Anuncio(nome=nome, categoria=categoria, valor=valor, usuario=usuario)
        anuncio.save()
        return HttpResponse(status=200)
    
    def delete(request):
        return HttpResponse("Olá, mundo!")

@api_view(['GET'])
def meus_anuncios(request):
    anuncios = Anuncio.objects.filter(usuario=request.user)
    serializer = AnuncioSerializer(anuncios, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def cadastro(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Please provide username and password'}, status=status.HTTP_400_BAD_REQUEST)
    User.objects.create(username=username, password=make_password(password))
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


class ChatMessageView(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    def create(self, request):

        #TODO verificar se ja tem um chat daqueles 2 usuarios com aquele anuncio.
        #se ja tiver, adiciona a mensagem naquele chat, senao, cria um chat pra aqueles 2 usuarios e pra aquele anuncio e
        #vai adicionando as mensagens la
        # Obtém os dados da requisição
        message_data = request.data
        sender = message_data.get('sender')
        message = message_data.get('message')
        anuncio_id = message_data.get('item_id')
        anuncio_teste = Anuncio.objects.first()

        # Cria e salva a nova mensagem
        chat_message = ChatMessage.objects.create(
            sender=sender,
            message=message,
            anuncio=anuncio_teste
        )

        # Retorna a resposta com os dados da nova mensagem
        serializer = ChatMessageSerializer(chat_message)
        return Response(serializer.data)