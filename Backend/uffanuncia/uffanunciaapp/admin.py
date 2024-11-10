from django.contrib import admin
from .models import Anuncio, Chat, Mensagem, Avaliacao, ChatMessage

admin.site.register(Anuncio)
admin.site.register(Chat)
admin.site.register(Mensagem)
admin.site.register(Avaliacao)
admin.site.register(ChatMessage)