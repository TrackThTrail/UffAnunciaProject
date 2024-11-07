from django.http import HttpResponse
from rest_framework import viewsets
from .models import Anuncio, Usuario
from .serializers import AnuncioSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Anuncio
from .serializers import AnuncioSerializer

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

@api_view(['GET'])
def meus_anuncios(request):
    user = 1
    anuncios = Anuncio.objects.filter(usuario=user)
    serializer = AnuncioSerializer(anuncios, many=True)
    return Response(serializer.data)