from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import viewsets, status
from .models import Anuncio, Mensagem, Avaliacao
from .serializers import AnuncioSerializer, MensagemSerializer, AvaliacaoSerializer
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

    def create(self, request):
        nome = request.data.get('nome')
        categoria = request.data.get('categoria')
        valor = request.data.get('valor')
        usuario = request.user
        anuncio = Anuncio(nome=nome, categoria=categoria, valor=valor, usuario=usuario)
        anuncio.save()
        return HttpResponse(status=200)
    
    def destroi(self,request):
        anuncio = self.get_object() #Obtem o objeto basaedo na pk
        anuncio.delete() #Exclui o objeto
        return Response({"message": "Anuncio excluido"})

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
        return Response({'error': 'Please provide username and password'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    User.objects.create(username=username, password=make_password(password))
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deletar_anuncio(request, id):
    try:
        # Tenta pegar o anúncio com o id e garantir que pertence ao usuário autenticado
        anuncio = Anuncio.objects.get(id=id, usuario=request.user)
        anuncio.delete()  # Deleta o anúncio
        return Response({"message": "Anúncio deletado com sucesso!"}, status=status.HTTP_204_NO_CONTENT)
    
    except Anuncio.DoesNotExist:
        # Caso o anúncio não exista ou não pertença ao usuário autenticado
        return JsonResponse(
            {"error": "Anúncio não encontrado ou você não tem permissão para deletá-lo!"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    except Exception as e:
        # Para qualquer outro erro inesperado
        return JsonResponse({"error": "Erro interno no servidor", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        local = request.data.get('local')
        valor = request.data.get('valor')
        usuario = request.user
        anuncio = Anuncio(nome=nome, categoria=categoria, local = local, valor=valor, usuario=usuario)
        anuncio.save()
        return HttpResponse(status=200)
    
    def delete(self, request):
        return HttpResponse("Olá, mundo!")
    

    @action(detail=False, methods=['POST'])
    def get_anuncio(self, request):
        anuncio = Anuncio.objects.filter(pk=request.data.get('id'))
        serializer = AnuncioSerializer(anuncio, many=True)
        return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deletar_anuncio(request, id):
    try:
        # Tenta pegar o anúncio com o id e garantir que pertence ao usuário autenticado
        anuncio = Anuncio.objects.get(id=id, usuario=request.user)
        anuncio.delete()  # Deleta o anúncio
        return Response({"message": "Anúncio deletado com sucesso!"}, status=status.HTTP_204_NO_CONTENT)
    
    except Anuncio.DoesNotExist:
        # Caso o anúncio não exista ou não pertença ao usuário autenticado
        return JsonResponse(
            {"error": "Anúncio não encontrado ou você não tem permissão para deletá-lo!"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    except Exception as e:
        # Para qualquer outro erro inesperado
        return JsonResponse({"error": "Erro interno no servidor", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    
    @action(detail=True, methods=['GET'])
    def get_chat_messages(self, request, pk=None):
        usuario_visitante = request.user
        anuncio = Anuncio.objects.get(pk=pk)
        chat = Chat.objects.get(usuario_visitante=usuario_visitante, anuncio=anuncio)
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
    
class AvaliacaoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer

    def create(self, request):
        usuario = request.user
        anuncio_id = request.data.get('anuncio_id')
        rating = request.data.get('rating')

        if not anuncio_id or not rating:
            return Response(
                {"error": "Os campos 'anuncio_id' e 'rating' são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            anuncio = Anuncio.objects.get(pk=anuncio_id)

            avaliacao_existente = Avaliacao.objects.filter(usuario=usuario, anuncio=anuncio).first()
            if avaliacao_existente:
                return Response(
                    {"error": "Você já avaliou este anúncio."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            avaliacao = Avaliacao.objects.create(
                usuario=usuario,
                anuncio=anuncio,
                nota=rating
            )

            serializer = AvaliacaoSerializer(avaliacao)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Anuncio.DoesNotExist:
            return Response(
                {"error": "Anúncio não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

    def list(self, request):
        avaliacoes = Avaliacao.objects.filter(usuario=request.user)
        serializer = AvaliacaoSerializer(avaliacoes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['POST'], url_path='avaliar')
    def avaliar(self, request, pk=None):
        usuario = request.user
        anuncio_id = pk
        rating = request.data.get('rating')

        if not rating:
            return Response(
                {"error": "O campo 'rating' é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            anuncio = Anuncio.objects.get(pk=anuncio_id)

            avaliacao_existente = Avaliacao.objects.filter(usuario=usuario, anuncio=anuncio).first()

            if avaliacao_existente:
                avaliacao_existente.nota = rating
                avaliacao_existente.save()

                serializer = AvaliacaoSerializer(avaliacao_existente)
                return Response(serializer.data, status=status.HTTP_200_OK)

            avaliacao = Avaliacao.objects.create(
                usuario=usuario,
                anuncio=anuncio,
                nota=rating
            )

            serializer = AvaliacaoSerializer(avaliacao)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Anuncio.DoesNotExist:
            return Response(
                {"error": "Anúncio não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )


    @action(detail=False, methods=['GET'])
    def anuncio_avaliacoes(self, request):
        anuncio_id = request.query_params.get('anuncio_id')
        if not anuncio_id:
            return Response(
                {"error": "O parâmetro 'anuncio_id' é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            anuncio = Anuncio.objects.get(pk=anuncio_id)
            avaliacoes = Avaliacao.objects.filter(anuncio=anuncio)
            serializer = AvaliacaoSerializer(avaliacoes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Anuncio.DoesNotExist:
            return Response(
                {"error": "Anúncio não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['GET'])
    def get_avaliacao(self, request):
        anuncio_id = request.query_params.get('anuncio_id')
        if not anuncio_id:
            return Response(
                {"error": "O parâmetro 'anuncio_id' é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            anuncio = Anuncio.objects.get(pk=anuncio_id)
            avaliacao = Avaliacao.objects.filter(usuario=request.user, anuncio=anuncio).first()
            
            if avaliacao:
                serializer = AvaliacaoSerializer(avaliacao)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"message": "Você ainda não avaliou este anúncio."},
                    status=status.HTTP_404_NOT_FOUND
                )
        except Anuncio.DoesNotExist:
            return Response(
                {"error": "Anúncio não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        
    @action(detail=True, methods=['DELETE'], url_path='remover_avaliacao')
    def remover_avaliacao(self, request, pk=None):
        usuario = request.user
        anuncio_id = pk  # Use the primary key from the URL

        try:
            anuncio = Anuncio.objects.get(pk=anuncio_id)
            avaliacao = Avaliacao.objects.filter(usuario=usuario, anuncio=anuncio).first()
            
            if not avaliacao:
                return Response(
                    {"error": "Avaliação não encontrada para este anúncio."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Remove the evaluation
            avaliacao.delete()

            return Response(
                {"message": "Avaliação removida com sucesso."},
                status=status.HTTP_200_OK
            )
        except Anuncio.DoesNotExist:
            return Response(
                {"error": "Anúncio não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )