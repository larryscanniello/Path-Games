from django.db import models
from django.contrib.auth.models import User
from collections import defaultdict

class FiregameMap(models.Model):
    initial_board = models.JSONField()  
    fire_progression = models.JSONField()
    bot_index = models.JSONField()
    fire_index = models.JSONField()
    ext_index = models.JSONField()
    difficulty = models.CharField(max_length=10, choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')])
    created_at = models.DateTimeField(auto_now_add=True)
    successpossiblepath = models.JSONField()
    bot1path = models.JSONField()
    bot2path = models.JSONField(null=True)
    bot3path = models.JSONField(null=True)
    bot4path = models.JSONField(null=True)
    def __str__(self):
        return f"Game {self.id} - {self.difficulty}"
    def win_rate(self):
        total_played = self.firegamegame_set.count()
        if total_played == 0:
            return None
        total_wins = self.firegamegame_set.filter(result='win').count()
        return total_wins / total_played
    
