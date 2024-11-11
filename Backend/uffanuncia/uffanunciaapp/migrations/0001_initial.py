# Generated by Django 5.1.2 on 2024-11-10 21:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Anuncio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=100)),
                ('categoria', models.CharField(choices=[('academico', 'Acadêmico'), ('alimentos', 'Alimentos'), ('moradia', 'Moraia'), ('outros', 'Outros')], default='outros', max_length=10)),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='anuncios', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Anúncio',
                'verbose_name_plural': 'Anúncios',
            },
        ),
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('anuncio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chats', to='uffanunciaapp.anuncio')),
                ('usuario_dono', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chats_dono', to=settings.AUTH_USER_MODEL)),
                ('usuario_visitante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chats_visitante', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Chat',
                'verbose_name_plural': 'Chats',
            },
        ),
        migrations.CreateModel(
            name='Avaliacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nota', models.FloatField()),
                ('anuncio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='avaliacoes', to='uffanunciaapp.anuncio')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='avaliacoes', to=settings.AUTH_USER_MODEL)),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='avaliacoes', to='uffanunciaapp.chat')),
            ],
            options={
                'verbose_name': 'Avaliação',
                'verbose_name_plural': 'Avaliações',
            },
        ),
        migrations.CreateModel(
            name='Mensagem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=100)),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mensagens', to='uffanunciaapp.chat')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mensagens', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Mensagem',
                'verbose_name_plural': 'Mensagens',
            },
        ),
    ]
