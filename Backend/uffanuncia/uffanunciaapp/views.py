from django.http import HttpResponse
from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def create(request):
        return HttpResponse("Olá, mundo!")
    
    def delete(request):
        return HttpResponse("Olá, mundo!")