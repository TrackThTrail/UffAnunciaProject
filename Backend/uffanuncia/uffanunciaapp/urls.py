from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnuncioViewSet
from . import views

router = DefaultRouter()
router.register(r'anuncios', AnuncioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('meus_anuncios/', views.meus_anuncios, name='meus_anuncios'),
]