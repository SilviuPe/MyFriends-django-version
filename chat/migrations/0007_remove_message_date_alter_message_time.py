# Generated by Django 4.2.3 on 2023-09-14 17:56

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0006_message_date_message_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='date',
        ),
        migrations.AlterField(
            model_name='message',
            name='time',
            field=models.TimeField(default=datetime.datetime(2023, 9, 14, 17, 56, 6, 633040, tzinfo=datetime.timezone.utc)),
        ),
    ]