from django.contrib import admin
from .models import Anuncio, Chat, Mensagem, Avaliacao

admin.site.register(Anuncio)
admin.site.register(Chat)
admin.site.register(Mensagem)
admin.site.register(Avaliacao)