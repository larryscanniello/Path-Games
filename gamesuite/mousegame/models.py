from django.db import models

class MousegameMap(models.Model):
    grid = models.JSONField()
    stochastic = models.BooleanField()
    bot_starting_index = models.JSONField()
    mouse_starting_index = models.JSONField() 
    mouse_path = models.JSONField()
    num_turns = models.IntegerField()
    sensor_sensitivity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Game {self.id} - {self.num_turns} turns"
    def win_rate(self):
        total_played = self.mousegamegame_set.count()
        if total_played == 0:
            return None
        total_wins = self.mousegamegame_set.filter(result='win').count()
        return total_wins / total_played
    def leaderboard(self):
        games = self.mousegamegame_set.exclude(result='lose')
        games = games.exclude(result='forfeit')
        # Sort by length of player_path
        sorted_games = sorted(games, key=lambda g: len(g.player_path or []))
        top_three_users = [[game.user.username,len(game.player_path)] for game in sorted_games[:3]]
        return top_three_users
    
class BotData(models.Model):
    mousegame_map = models.ForeignKey(MousegameMap,on_delete=models.CASCADE)
    plans = models.JSONField(null=True)
    evidence = models.JSONField()
    states = models.JSONField(null=True)
    modechange = models.IntegerField(null=True)
    bot = models.SmallIntegerField()
