from django.http import HttpResponse
from rest_framework import viewsets
from .models import Anuncio, Usuario
from .serializers import AnuncioSerializer
import json

class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer

    def create(self, request):
        nome = request.data.get('nome')
        categoria = request.data.get('categoria')
        valor = request.data.get('valor')
        usuario = Usuario.objects.first()
        anuncio = Anuncio(nome=nome, categoria=categoria, valor=valor, usuario=usuario)
        anuncio.save()
        return HttpResponse(status=200)
    
    def delete(request):
        return HttpResponse("Olá, mundo!")