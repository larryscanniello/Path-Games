from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from firegame.models import FiregameMap
from mousegame.models import MousegameMap, BotData
from api.models import MousegameGame, FiregameGame
from .serializers import FiregameSerializer, MousegameSerializer, BotDataSerializer, UserSerializer, MousegameGameSerializer, FiregameGameSerializer
from rest_framework.decorators import api_view,permission_classes
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import authentication_classes
from django.shortcuts import get_object_or_404

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def firegame(request):
    difficulty = request.data['difficulty']
    userid = User.objects.get(username=request.data['username'])
    played_map_ids = FiregameGame.objects.filter(user=userid).values_list('firegame_map',flat=True)
    unplayed_maps = FiregameMap.objects.filter(difficulty=difficulty).exclude(id__in=played_map_ids)
    if unplayed_maps.exists():
        map_to_send = unplayed_maps.first()
        serialized_map = FiregameSerializer(map_to_send)
        return Response({'success': True, 'game': serialized_map.data})
    return Response({'success': False})

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_mousegame_by_id(request):
    id = request.data['id']
    username = request.data['username']
    map = MousegameMap.objects.get(id=id)
    game = get_object_or_404(MousegameGame,user__username=username,mousegame_map__id=id)
    bots = BotData.objects.filter(mousegame_map = id).order_by('bot')
    map_serializer = MousegameSerializer(map)
    game_serializer = MousegameGameSerializer(game)
    bot_serializer = BotDataSerializer(bots, many=True)
    return Response({
        'game': map_serializer.data,
        'bots': bot_serializer.data,
        'playerdata': game_serializer.data,
    })

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_firegame_by_id(request):
    id = request.data['id']
    username = request.data['username']
    map = FiregameMap.objects.get(id=id)
    game = get_object_or_404(FiregameGame,user__username=username,firegame_map__id=id)
    map_serializer = FiregameSerializer(map)
    game_serializer = FiregameGameSerializer(game)
    return Response({
        'game': map_serializer.data,
        'playerdata': game_serializer.data,
    })

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def handle_game_over_mousegame(request):
    game = MousegameGame()
    game.user = User.objects.get(username = request.data['username'])
    game.mousegame_map = MousegameMap.objects.get(id=request.data['id'])
    game.player_path = request.data['path']
    game.sensor_log = request.data['sensorLog']
    game.result = request.data['result']
    game.save()
    return Response({'hell':'yeah'})

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def handle_game_over_firegame(request):
    game = FiregameGame()
    game.user = User.objects.get(username = request.data['username'])
    game.firegame_map = FiregameMap.objects.get(id=request.data['id'])
    game.player_path = request.data['path']
    game.result = request.data['result']
    game.save()
    return Response({'hell':'yeah'})


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def mousegame(request):
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
        return Response({'success': True, 'game': serialized_map.data,'bots':bot_serializer.data})
    return Response({'success': False})



@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_mousegame_list(request):
    userid = User.objects.get(username=request.data['username'])
    games = MousegameGame.objects.filter(user=userid).order_by('datetime')
    gamestrs = [[game.mousegame_map.id,game.result,game.mousegame_map.stochastic,game.datetime] for game in games]
    return Response(gamestrs)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_firegame_list(request):
    userid = User.objects.get(username=request.data['username'])
    games = FiregameGame.objects.filter(user=userid).order_by('datetime')
    gamestrs = [[game.firegame_map.id,game.result,game.firegame_map.difficulty,game.datetime] for game in games]
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
