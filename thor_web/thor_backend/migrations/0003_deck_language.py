# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('thor_backend', '0002_auto_20150415_0336'),
    ]

    operations = [
        migrations.AddField(
            model_name='deck',
            name='language',
            field=models.CharField(default=b'en', max_length=2, choices=[(b'en', b'English'), (b'ch', b'Chinese'), (b'fr', b'French'), (b'de', b'German'), (b'ja', b'Japanese'), (b'ko', b'Korean')]),
            preserve_default=True,
        ),
    ]
