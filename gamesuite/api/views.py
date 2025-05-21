from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from firegame.models import FiregameMap
from mousegame.models import MousegameMap, BotData
from api.models import MousegameGame
from .serializers import FiregameSerializer, MousegameSerializer, BotDataSerializer, UserSerializer, MousegameGameSerializer
from rest_framework.decorators import api_view,permission_classes
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import authentication_classes

@api_view(['GET'])
@permission_classes([AllowAny])
def get_firegame_by_id(request, id):
    try:
        game = FiregameMap.objects.get(id=id)
    except FiregameMap.DoesNotExist:
        return Response({'error': 'Game not found'})
    serializer = FiregameSerializer(game)
    return Response(serializer.data)


"""@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_mousegame_by_id(request):
    id = request.data['id']
    try:
        map = MousegameMap.objects.get(id=id)
    except MousegameMap.DoesNotExist:
        return Response({'error': 'Game not found'})
    userid = User.objects.get(username = request.data['username'])
    bots = BotData.objects.filter(mousegame_map=map)
    game = MousegameGame.objects.get(mousegame_map=id,user=userid)
    map_serializer = MousegameSerializer(map)
    game_serializer = MousegameGameSerializer(game)
    bot_serializer = BotDataSerializer(bots, many=True)
    return Response({
        'game': map_serializer.data,
        'bots': bot_serializer.data,
        'playerdata': game_serializer.data,
    })"""

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_mousegame_by_id(request):
    id = request.data['id']
    try:
        game = MousegameGame.objects.get(id=id)
    except MousegameGame.DoesNotExist:
        return Response({'error': 'Game not found'})
    map = MousegameMap.objects.get(id = game.mousegame_map.id)
    bots = BotData.objects.filter(mousegame_map = map.id)
    map_serializer = MousegameSerializer(map)
    game_serializer = MousegameGameSerializer(game)
    bot_serializer = BotDataSerializer(bots, many=True)
    return Response({
        'game': map_serializer.data,
        'bots': bot_serializer.data,
        'playerdata': game_serializer.data,
    })

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def handle_game_over(request):
    game = MousegameGame()
    game.user = User.objects.get(username = request.data['username'])
    game.mousegame_map = MousegameMap.objects.get(id=request.data['id'])
    game.player_path = request.data['path']
    game.result = request.data['result']
    game.save()
    return Response({'hell':'yeah'})

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def mousegame(request):
    print(request.data)
    stoch = True
    if request.data['stoch']=='stationary':
        stoch = False
    userid = User.objects.get(username=request.data['username'])
    played_map_ids = MousegameGame.objects.filter(user=userid).values_list('mousegame_map', flat=True)
    unplayed_maps = MousegameMap.objects.filter(stochastic=stoch).exclude(id__in=played_map_ids)
    if unplayed_maps.exists():
        map_to_send = unplayed_maps.first()
        serialized_map = MousegameSerializer(map_to_send)
        bots = BotData.objects.filter(mousegame_map=map_to_send.id)
        bot_serializer = BotDataSerializer(bots, many=True)
        print(map_to_send)
        return Response({'success': True, 'game': serialized_map.data,'bots':bot_serializer.data})
    return Response({'success': False})



@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_game_list(request):
    userid = User.objects.get(username=request.data['username'])
    games = MousegameGame.objects.filter(user=userid)
    gamestrs = [[game.id,game.result,game.datetime] for game in games]
    return Response(gamestrs)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


"""
@api_view(['POST'])
@permission_classes([AllowAny])
def create_user_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
"""
