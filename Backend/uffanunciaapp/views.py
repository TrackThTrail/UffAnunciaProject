from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import viewsets, status
from .models import Anuncio, Mensagem
from .serializers import AnuncioSerializer, MensagemSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from .models import Anuncio, Chat
from .serializers import AnuncioSerializer, ChatSerializer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.shortcuts import render


class AnuncioViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer
    
    def list(self, request):
        qs = Anuncio.objects.exclude(usuario=request.user)
        serializer = AnuncioSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
@permission_classes([IsAuthenticated])
def meus_anuncios(request):
    anuncios = Anuncio.objects.filter(usuario=request.user)
    serializer = AnuncioSerializer(anuncios, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logged_in_user(request):
    user = request.user  # Pega o usuário logado a partir do request
    return Response(user.id)

@api_view(['POST'])
def cadastro(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Please provide username and password'}, status=status.HTTP_400_BAD_REQUEST)
    User.objects.create(username=username, password=make_password(password))
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


class ChatView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer


    @action(detail=False, methods=['POST'])
    def iniciar_chat(self, request):
        if request.method == 'POST':
            usuario_dono = User.objects.get(username=request.data.get('usuarioDono'))
            usuario_visitante = User.objects.get(pk=request.data.get('usuarioVisitante'))
            anuncio_id = Anuncio.objects.get(pk=request.data.get('anuncio'))

            # Verifique se já existe um chat com esses parâmetros
            chat = Chat.objects.filter(
                usuario_dono=usuario_dono,
                usuario_visitante=usuario_visitante,
                anuncio=anuncio_id
            ).first()

            if chat:
                return JsonResponse({"message": "Chat já existe!", "chat_id": chat.id}, status=200)

            # Caso não exista, crie o chat
            novo_chat = Chat.objects.create(
                usuario_dono=usuario_dono,
                usuario_visitante=usuario_visitante,
                anuncio=anuncio_id
            )
            
            return JsonResponse({"message": "Chat iniciado com sucesso!", "chat_id": novo_chat.id}, status=201)
    
    @action(detail=True, methods=['GET'])
    def load_chat_data(self, request, pk=None):
        if request.method == 'GET':
            chat = Chat.objects.get(pk=pk)
            mensagens = chat.mensagens.all()
            chat_serializer = self.get_serializer(chat)
            mensagem_serializer = MensagemSerializer(mensagens, many=True)
            return Response({
                'chat': chat_serializer.data,
                'mensagens': mensagem_serializer.data
            }, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['GET'])
    def meus_chats(self, request):
        chats = Chat.objects.filter(usuario_dono=request.user)
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data, status=200)
    

class MensagemView(viewsets.ModelViewSet):
    queryset = Mensagem.objects.all()
    serializer_class = MensagemSerializer

    def create(self, request):
        message_data = request.data
        usuario = message_data.get('usuario')
        chat = message_data.get('chat')
        content = message_data.get('content')
        chat_obj = Chat.objects.get(pk=chat)
        user_obj = User.objects.get(pk=usuario)

        chat_message = Mensagem.objects.create(
            chat=chat_obj,
            content=content,
            usuario=user_obj
        )

        serializer = MensagemSerializer(chat_message)
        return Response(serializer.data)