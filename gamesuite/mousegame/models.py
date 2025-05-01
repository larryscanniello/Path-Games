from django.db import models

class MousegameMap(models.Model):
    grid = models.JSONField()
    stochastic = models.BooleanField()
    bot_starting_index = models.JSONField()
    mouse_starting_index = models.JSONField() 
    mouse_path = models.JSONField()
    num_turns = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Game {self.id} - {self.num_turns} turns"
    
class BotData(models.Model):
    mousegame_map = models.ForeignKey(MousegameMap,on_delete=models.CASCADE)
    evidence = models.JSONField()
    states = models.JSONField()
    bot = models.SmallIntegerField()
