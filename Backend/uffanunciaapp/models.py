from django.db import models
from django.contrib.auth.models import User

class Anuncio(models.Model):

    class Categoria(models.TextChoices):
        ACADEMICO = 'academico', 'Acadêmico'
        ALIMENTOS = 'alimentos', 'Alimentos'
        MORADIA = 'moradia', 'Moraia'
        OUTROS = 'outros', 'Outros'
    
    class Local(models.TextChoices):
        NITEROI = 'niteroi', 'Niterói'
        RJ = 'rio de janeiro', 'Rio de Janeiro'
        SG = 'sao goncalo', 'São Gonçalo'
        OCEANICA = 'oceanica', 'Região Oceânica'
        OUTROS = 'outros', 'Outro'


    nome = models.CharField(max_length=100)
    categoria = models.CharField(
        max_length=10,
        choices=Categoria.choices,
        default=Categoria.OUTROS
    )

    local = models.CharField(
        max_length=16,
        choices= Local.choices,
        default= Local.OUTROS
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
    content = models.CharField(max_length=100)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mensagens')

    class Meta:
        verbose_name = 'Mensagem'
        verbose_name_plural = 'Mensagens'

class Avaliacao(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='avaliacoes')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='avaliacoes')
    anuncio = models.ForeignKey(Anuncio, on_delete=models.CASCADE, related_name='avaliacoes')
    nota = models.FloatField()

    class Meta:
        verbose_name = 'Avaliação'
        verbose_name_plural = 'Avaliações'

