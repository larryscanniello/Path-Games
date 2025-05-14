from django.db import models
from mousegame.models import MousegameMap
from django.contrib.auth.models import User

class MousegameGame(models.Model):
    mousegame_map = models.ForeignKey(MousegameMap,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    player_path = models.JSONField()
    win = models.BooleanField()
    datetime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Game {self.id} created at {self.datetime} is a {self.win} for user {self.user}'