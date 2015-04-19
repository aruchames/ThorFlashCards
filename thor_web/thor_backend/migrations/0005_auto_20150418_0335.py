# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('thor_backend', '0004_auto_20150417_2142'),
    ]

    operations = [
        migrations.AddField(
            model_name='deck',
            name='stars',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='deck',
            name='views',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
