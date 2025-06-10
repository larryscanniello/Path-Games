from rest_framework import serializers
from firegame.models import FiregameMap
from mousegame.models import MousegameMap,BotData
from api.models import MousegameGame, FiregameGame
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator

class FiregameSerializer(serializers.ModelSerializer):
    class Meta:
        model = FiregameMap
        fields = '__all__'
        
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

class FiregameGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = FiregameGame
        fields = '__all__'
        extra_kwargs = {'user':{'read_only':True}}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','password']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {
                'error_messages': {
                    'unique': 'A user with this username already exists.'
                }
            }
        }
    def validate_username(self, value):
        print('check')
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    def create(self,validated_data):
        print('checkkkk')
        user = User.objects.create_user(**validated_data)
        
        return user
    
