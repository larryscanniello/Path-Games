# Generated by Django 4.2.23 on 2025-06-15 03:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feedback', models.CharField(max_length=3200)),
                ('datetime', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
