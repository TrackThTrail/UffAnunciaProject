from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnuncioViewSet, ChatMessageView
from . import views
from .views import ChatMessageView



router = DefaultRouter()
router.register(r'anuncios', AnuncioViewSet)
router.register(r'chatmessages', ChatMessageView)

urlpatterns = [
    path('', include(router.urls)),
    path('meus_anuncios/', views.meus_anuncios, name='meus_anuncios'),
    path('cadastro/', views.cadastro, name='cadastro'),
]