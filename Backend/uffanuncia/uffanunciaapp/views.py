from django.http import HttpResponse
from rest_framework import viewsets
from .models import Anuncio
from .serializers import AnuncioSerializer

class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer

    def create(request):
        return HttpResponse("Olá, mundo!")
    
    def delete(request):
        return HttpResponse("Olá, mundo!")