from django.db import models
from django.contrib.auth.models import User

class Anuncio(models.Model):

    class Categoria(models.TextChoices):
        ACADEMICO = 'academico', 'Acadêmico'
        ALIMENTOS = 'alimentos', 'Alimentos'
        MORADIA = 'moradia', 'Moraia'
        OUTROS = 'outros', 'Outros'


    nome = models.CharField(max_length=100)
    categoria = models.CharField(
        max_length=10,
        choices=Categoria.choices,
        default=Categoria.OUTROS
    )
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='anuncios')

    class Meta:
        verbose_name = 'Anúncio'
        verbose_name_plural = 'Anúncios'

    def __str__(self):
        return self.nome

class Chat(models.Model):
    usuario_dono = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats_dono')
    usuario_visitante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats_visitante')
    anuncio = models.ForeignKey(Anuncio, on_delete=models.CASCADE, related_name='chats')

    class Meta:
        verbose_name = 'Chat'
        verbose_name_plural = 'Chats'

class Mensagem(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='mensagens')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mensagens')

    class Meta:
        verbose_name = 'Mensagem'
        verbose_name_plural = 'Mensagens'

class ChatMessage(models.Model):
    message = models.TextField()
    sender = models.CharField(max_length=255)  # Pode ser o nome do usuário ou outro identificador
    timestamp = models.DateTimeField(auto_now_add=True)
    anuncio = models.ForeignKey('Anuncio', on_delete=models.CASCADE)  # Relaciona com o item

    def __str__(self):
        return f"{self.sender}: {self.message[:50]}..."
    
    class Meta:
        verbose_name = 'Chat Mensagem'
        verbose_name_plural = 'Chat Mensagens'

class Avaliacao(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='avaliacoes')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='avaliacoes')
    anuncio = models.ForeignKey(Anuncio, on_delete=models.CASCADE, related_name='avaliacoes')
    nota = models.FloatField()

    class Meta:
        verbose_name = 'Avaliação'
        verbose_name_plural = 'Avaliações'

