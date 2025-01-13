from django.test import TestCase
from django.contrib.auth.models import User
from ..models import Anuncio, Chat, Mensagem, Avaliacao
from ..serializers import AnuncioSerializer, UserSerializer, ChatSerializer, MensagemSerializer, AvaliacaoSerializer

class SerializersTestCase(TestCase):

    def setUp(self):
        # Create users
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='password1')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password2')

        self.anuncio = Anuncio.objects.create(
            nome='Aluguel de Apartamento',
            categoria=Anuncio.Categoria.MORADIA,
            local=Anuncio.Local.NITEROI,
            valor=1500.00,
            usuario=self.user1
        )

        self.chat = Chat.objects.create(
            usuario_dono=self.user1,
            usuario_visitante=self.user2,
            anuncio=self.anuncio
        )

        self.mensagem = Mensagem.objects.create(
            chat=self.chat,
            content='Olá, estou interessado no anúncio.',
            usuario=self.user2
        )

        self.avaliacao = Avaliacao.objects.create(
            usuario=self.user2,
            anuncio=self.anuncio,
            nota=4
        )

    def test_anuncio_serializer(self):
        serializer = AnuncioSerializer(instance=self.anuncio)
        data = serializer.data
        self.assertEqual(data['nome'], 'Aluguel de Apartamento')
        self.assertEqual(data['categoria'], Anuncio.Categoria.MORADIA)
        self.assertEqual(data['local'], Anuncio.Local.NITEROI)
        self.assertEqual(float(data['valor']), 1500.00)
        self.assertEqual(data['usuario'], str(self.user1))

    def test_user_serializer(self):
        serializer = UserSerializer(instance=self.user1)
        data = serializer.data
        self.assertEqual(data['id'], self.user1.id)
        self.assertEqual(data['username'], 'user1')
        self.assertEqual(data['email'], 'user1@example.com')

    def test_chat_serializer(self):
        serializer = ChatSerializer(instance=self.chat)
        data = serializer.data
        self.assertEqual(data['usuario_visitante'], str(self.user2))
        self.assertEqual(data['anuncio'], str(self.anuncio))

    def test_mensagem_serializer(self):
        serializer = MensagemSerializer(instance=self.mensagem)
        data = serializer.data
        self.assertEqual(data['content'], 'Olá, estou interessado no anúncio.')
        self.assertEqual(data['usuario']['id'], self.user2.id)
        self.assertEqual(data['usuario']['username'], 'user2')
        self.assertEqual(data['usuario']['email'], 'user2@example.com')

    def test_avaliacao_serializer(self):
        serializer = AvaliacaoSerializer(instance=self.avaliacao)
        data = serializer.data
        self.assertEqual(data['usuario'], self.user2.id)
        self.assertEqual(data['anuncio'], self.anuncio.id)
        self.assertEqual(data['nota'], 4)