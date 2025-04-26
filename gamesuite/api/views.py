from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from firegame.models import FiregameMap
from .serializers import FiregameSerializer
from rest_framework.decorators import api_view

@api_view(['GET'])
def get_game_by_id(request, id):
    try:
        game = FiregameMap.objects.get(id=id)
    except FiregameMap.DoesNotExist:
        return Response({'error': 'Game not found'})
    serializer = FiregameSerializer(game)
    return Response(serializer.data)

