# Generated by Django 4.2.3 on 2023-09-19 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0009_alter_message_date_alter_message_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='time',
            field=models.TimeField(auto_now_add=True),
        ),
    ]