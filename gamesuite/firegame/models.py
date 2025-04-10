from django.db import models
from django.contrib.auth.models import User


class firegame_Map(models.Model):
    initial_board = models.JSONField()  
    fire_progression = models.JSONField()
    difficulty = models.CharField(max_length=10, choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')])
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Game {self.id} - {self.user.username}"
