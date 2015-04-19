# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('thor_backend', '0005_auto_20150418_0335'),
    ]

    operations = [
        migrations.AddField(
            model_name='deck',
            name='starred_by',
            field=models.ManyToManyField(related_name='starred_decks', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
