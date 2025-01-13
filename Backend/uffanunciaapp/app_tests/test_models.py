from django.test import TestCase
from django.contrib.auth.models import User
from ..models import Anuncio, Chat, Mensagem, Avaliacao

class ModelsTestCase(TestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='password1')
        self.user2 = User.objects.create_user(username='user2', password='password2')

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

    def test_anuncio_creation(self):
        self.assertEqual(self.anuncio.nome, 'Aluguel de Apartamento')
        self.assertEqual(self.anuncio.categoria, Anuncio.Categoria.MORADIA)
        self.assertEqual(self.anuncio.local, Anuncio.Local.NITEROI)
        self.assertEqual(self.anuncio.valor, 1500.00)
        self.assertEqual(self.anuncio.usuario, self.user1)

    def test_chat_creation(self):
        self.assertEqual(self.chat.usuario_dono, self.user1)
        self.assertEqual(self.chat.usuario_visitante, self.user2)
        self.assertEqual(self.chat.anuncio, self.anuncio)

    def test_mensagem_creation(self):
        self.assertEqual(self.mensagem.chat, self.chat)
        self.assertEqual(self.mensagem.content, 'Olá, estou interessado no anúncio.')
        self.assertEqual(self.mensagem.usuario, self.user2)

    def test_avaliacao_creation(self):
        self.assertEqual(self.avaliacao.usuario, self.user2)
        self.assertEqual(self.avaliacao.anuncio, self.anuncio)
        self.assertEqual(self.avaliacao.nota, 4)

    def test_anuncio_string_representation(self):
        self.assertEqual(str(self.anuncio), 'Aluguel de Apartamento')

    def test_chat_related_name(self):
        self.assertIn(self.chat, self.anuncio.chats.all())

    def test_mensagem_related_name(self):
        self.assertIn(self.mensagem, self.chat.mensagens.all())

    def test_avaliacao_related_name(self):
        self.assertIn(self.avaliacao, self.anuncio.avaliacoes.all())