from django.shortcuts import render
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from . import views
from django.shortcuts import render



router = DefaultRouter()
router.register(r'anuncios', AnuncioViewSet)
router.register(r'mensagens', MensagemView)
router.register(r'chats', ChatView)
router.register(r'avaliacoes', AvaliacaoViewSet)


def serve_react(request):
    return render(request, 'index.html')

urlpatterns = [
    path('', include(router.urls)),
    path('meus_anuncios/', views.meus_anuncios, name='meus_anuncios'),
    path('cadastro/', views.cadastro, name='cadastro'),
    path('get_logged_in_user/', views.get_logged_in_user),
    path('meus_anuncios/<int:id>/', views.deletar_anuncio, name='deletar_anuncio'),
]
