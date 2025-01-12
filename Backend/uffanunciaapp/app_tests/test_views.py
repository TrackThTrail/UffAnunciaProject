from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from ..models import Anuncio, Chat, Mensagem, Avaliacao
from rest_framework.test import APIClient


class AnuncioTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.force_authenticate(user=self.user)
        self.anuncio_data = {
            'nome': 'Test Anuncio',
            'categoria': 'academico',
            'local': 'niteroi',
            'valor': '100.00',
            'usuario': self.user.id
        }
        self.anuncio = Anuncio.objects.create(
            nome='Test Anuncio',
            categoria='academico',
            local='niteroi',
            valor=100.00,
            usuario=self.user
        )

    def test_create_anuncio(self):
        response = self.client.post('/api/anuncios/', self.anuncio_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Anuncio.objects.filter(id=self.anuncio.id).exists())

    def test_get_my_anuncios(self):
        response = self.client.get('/api/meus_anuncios/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_delete_anuncio(self):
        response = self.client.delete(f'/api/meus_anuncios/{self.anuncio.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class ChatTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="testuser1", password="password")
        self.user2 = User.objects.create_user(username="testuser2", password="password")
        self.client.force_authenticate(user=self.user1)
        self.client.force_authenticate(user=self.user2)
        self.anuncio = Anuncio.objects.create(
            nome='Test Anuncio',
            categoria='academico',
            local='niteroi',
            valor=100.00,
            usuario=self.user1
        )
        self.chat_data = {
            'usuarioDono': self.user1.username,
            'usuarioVisitante': self.user2.id,
            'anuncio': self.anuncio.id
        }

    # def test_iniciar_chat(self):
    #     response = self.client.post(reverse('chat-iniciar_chat'), self.chat_data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_load_chat_data(self):
        chat = Chat.objects.create(
            usuario_dono=self.user1,
            usuario_visitante=self.user2,
            anuncio=self.anuncio
        )
        response = self.client.get(f'/api/chats/{chat.id}/get_chat_messages/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AvaliacaoTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.force_authenticate(user=self.user)
        self.anuncio = Anuncio.objects.create(
            nome='Test Anuncio',
            categoria='academico',
            local='niteroi',
            valor=100.00,
            usuario=self.user
        )

    def test_create_avaliacao(self):
        data = {'rating': 5}
        response = self.client.post(f'/api/avaliacoes/{self.anuncio.id}/avaliar/', data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_avaliacoes(self):
        Avaliacao.objects.create(usuario=self.user, anuncio=self.anuncio, nota=3)
        data = {
            'anuncio_id': self.anuncio.id
        }
        response = self.client.get('/api/avaliacoes/get_avaliacao/', data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_remove_avaliacao(self):
        anuncio = Anuncio.objects.create(
            nome="Test Ad", categoria="Books", local="Biblioteca", valor=50.0, usuario=self.user
        )
        avaliacao = Avaliacao.objects.create(
            anuncio=anuncio, usuario=self.user, nota=4
        )

        data = {
            "anuncio_id": anuncio.id
        }

        url = f"/api/avaliacoes/{anuncio.id}/remover_avaliacao/"
        response = self.client.delete(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Avaliacao.objects.filter(id=avaliacao.id).exists())


class CadastroTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'email': 'mail@teste',
            'password': '1234'
        }

    def test_cadastro_user(self):
        response = self.client.post('/api/cadastro/', self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class GetLoggedInUserTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.force_authenticate(user=self.user)

    def test_get_logged_in_user(self):
        response = self.client.get('/api/get_logged_in_user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.user.id)
