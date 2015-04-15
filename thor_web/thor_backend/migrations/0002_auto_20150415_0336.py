# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('thor_backend', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='deck',
            field=models.ForeignKey(related_name='cards', to='thor_backend.Deck'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='deck',
            name='created_by',
            field=models.ForeignKey(related_name='decks', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
