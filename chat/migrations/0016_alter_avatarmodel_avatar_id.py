# Generated by Django 4.2.3 on 2023-09-26 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0015_alter_friendship_id_alter_message_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='avatarmodel',
            name='avatar_id',
            field=models.CharField(default='url("http://localhost:3000/static/chat/empty.png")', max_length=100),
        ),
    ]
