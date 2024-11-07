from django.contrib import admin
from .models import Usuario, Anuncio, Chat, Mensagem, Avaliacao, ChatMessage

admin.site.register(Usuario)
admin.site.register(Anuncio)
admin.site.register(Chat)
admin.site.register(Mensagem)
admin.site.register(Avaliacao)
admin.site.register(ChatMessage)