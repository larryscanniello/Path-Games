from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name="games")
    board_state = models.TextField()  
    winner = models.CharField(max_length=10, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Game {self.id} - {self.user.username}"