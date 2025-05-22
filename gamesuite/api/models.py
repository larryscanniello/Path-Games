from django.db import models
from mousegame.models import MousegameMap
from firegame.models import FiregameMap
from django.contrib.auth.models import User

class MousegameGame(models.Model):
    mousegame_map = models.ForeignKey(MousegameMap,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    player_path = models.JSONField()
    sensor_log = models.JSONField()
    result = models.CharField(max_length=10)
    datetime = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['mousegame_map','user'],name='unique_mousegame_map_user')
        ]
    def __str__(self):
        return f'Game instance {self.id} with mousegame {self.mousegame_map} created at {self.datetime} is a {self.result} for user {self.user}'
    
class FiregameGame(models.Model):
    firegame_map = models.ForeignKey(FiregameMap,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    player_path = models.JSONField()
    result = models.CharField(max_length=10)
    datetime = models.DateTimeField(auto_now_add=True)
