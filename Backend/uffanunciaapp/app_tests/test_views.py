from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from ..models import Anuncio  # Replace with your actual model import if different


class AnuncioAPITests(APITestCase):
    def setUp(self):
        # Create a test user and token
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        # Set up initial test data
        self.anuncio = Anuncio.objects.create(
            nome="Initial Ad",
            categoria="Books",
            local="Library",
            valor=50.0,
            user=self.user,
        )

        self.valid_payload = {
            "nome": "Updated Ad",
            "categoria": "Electronics",
            "local": "City Center",
            "valor": 100.0,
        }

        self.invalid_payload = {
            "nome": "",
            "categoria": "Electronics",
            "local": "City Center",
        }  # Missing 'valor'

    def test_create_anuncio(self):
        """Test creating a new 'anuncio' with valid data."""
        response = self.client.post("/api/anuncios/", self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["nome"], self.valid_payload["nome"])

    def test_create_anuncio_invalid(self):
        """Test creating a new 'anuncio' with invalid data."""
        response = self.client.post("/api/anuncios/", self.invalid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("valor", response.data)  # Check for specific error messages

    def test_update_anuncio(self):
        """Test updating an existing 'anuncio'."""
        response = self.client.put(
            f"/api/anuncios/{self.anuncio.id}/", self.valid_payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.anuncio.refresh_from_db()
        self.assertEqual(self.anuncio.nome, self.valid_payload["nome"])

    def test_update_anuncio_invalid(self):
        """Test updating an existing 'anuncio' with invalid data."""
        response = self.client.put(
            f"/api/anuncios/{self.anuncio.id}/", self.invalid_payload, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("valor", response.data)

    def test_list_anuncios(self):
        """Test retrieving the list of 'anuncios'."""
        response = self.client.get("/api/anuncios/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_retrieve_anuncio(self):
        """Test retrieving a single 'anuncio'."""
        response = self.client.get(f"/api/anuncios/{self.anuncio.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["nome"], self.anuncio.nome)

    def test_delete_anuncio(self):
        """Test deleting an 'anuncio'."""
        response = self.client.delete(f"/api/anuncios/{self.anuncio.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Anuncio.objects.filter(id=self.anuncio.id).exists())
