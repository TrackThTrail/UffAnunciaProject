from django.db import models

class Item(models.Model):
    nome = models.CharField(max_length=100)