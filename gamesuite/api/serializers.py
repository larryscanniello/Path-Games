from rest_framework import serializers
from firegame.models import FiregameMap
from mousegame.models import MousegameMap,BotData
from api.models import MousegameGame
from django.contrib.auth.models import User

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

class MousegameGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = MousegameGame
        fields = '__all__'
        extra_kwargs = {'user':{'read_only':True}}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','password']
        extra_kwargs = {'password': {'write_only':True}}
    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user

