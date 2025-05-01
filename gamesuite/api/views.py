from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from firegame.models import FiregameMap
from mousegame.models import MousegameMap, BotData
from .serializers import FiregameSerializer, MousegameSerializer, BotDataSerializer
from rest_framework.decorators import api_view

@api_view(['GET'])
def get_firegame_by_id(request, id):
    try:
        game = FiregameMap.objects.get(id=id)
    except FiregameMap.DoesNotExist:
        return Response({'error': 'Game not found'})
    serializer = FiregameSerializer(game)
    return Response(serializer.data)

@api_view(['GET'])
def get_mousegame_by_id(request, id):
    try:
        game = MousegameMap.objects.get(id=id)
    except MousegameMap.DoesNotExist:
        return Response({'error': 'Game not found'})
    bots = BotData.objects.filter(mousegame_map=game)
    game_serializer = MousegameSerializer(game)
    bot_serializer = BotDataSerializer(bots, many=True)
    return Response({
        'game':game_serializer.data,
        'bots':bot_serializer.data,
    })

