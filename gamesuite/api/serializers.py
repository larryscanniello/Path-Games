from rest_framework import serializers
from firegame.models import FiregameMap
from mousegame.models import MousegameMap,BotData

class FiregameSerializer(serializers.ModelSerializer):
    class Meta:
        model = FiregameMap
        fields = '__all__'
        
        """('id','initial_board','fire_progression','bot_index','fire_index','ext_index,'
                  'difficulty','created_at','successpossiblepath','bot1path','bot2path',
                  'bot3path','bot4path')"""
class MousegameSerializer(serializers.ModelSerializer):
    class Meta:
        model = MousegameMap
        fields = '__all__'

class BotDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotData
        fields = '__all__'
