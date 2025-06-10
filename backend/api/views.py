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
from collections import defaultdict
import json

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def firegame(request):
    difficulty = request.data['difficulty']
    userid = User.objects.get(username=request.user)
    played_map_ids = FiregameGame.objects.filter(user=userid).values_list('firegame_map',flat=True)

    difficulties = ['easy','medium','hard']
    levels_left = []
    for i in range(len(difficulties)):
        unplayed_maps = FiregameMap.objects.filter(difficulty=difficulties[i]).exclude(id__in=played_map_ids)
        levels_left.append(len(unplayed_maps))

    
    unplayed_maps = FiregameMap.objects.filter(difficulty=difficulty).exclude(id__in=played_map_ids)
    if unplayed_maps.exists():
        map_to_send = unplayed_maps.first()
        serialized_map = FiregameSerializer(map_to_send)
        return Response({'success': True, 
                         'game': serialized_map.data,
                         'win_rate': map_to_send.win_rate(),
                         'levels_left': levels_left})
    return Response({'success': False,'levels_left':levels_left})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_mousegame_by_id(request):
    id = request.data['id']
    username = request.user
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
        'leaderboard': map.leaderboard()
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_firegame_by_id(request):
    print('check')
    id = request.data['id']
    username = request.user
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
def handle_game_over_mousegame(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON'}, status=400)
    username,id = data['username'],data['id']
    game = get_object_or_404(MousegameGame,user__username=username,mousegame_map__id=id)
    game.player_path = data['path']
    game.sensor_log = data['sensorLog']
    game.result = data['result']
    game.save()
    return Response({'hell':'yeah'})


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def handle_game_over_firegame(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON'}, status=400)
    username,id = data['username'],data['id']
    game = get_object_or_404(FiregameGame,user__username=username,firegame_map__id=id)
    game.player_path = data['path']
    game.result = data['result']
    game.save()
    return Response({'hell':'yeah'})
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_first_turn_firegame(request):
    game = FiregameGame()
    game.user = User.objects.get(username = request.user)
    game.firegame_map = FiregameMap.objects.get(id=request.data['id'])
    game.player_path = []
    game.result = 'forfeit'
    game.save()
    return Response({'hell':'yeah'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_first_turn_mousegame(request):
    game = MousegameGame()
    game.user = User.objects.get(username = request.user)
    game.mousegame_map = MousegameMap.objects.get(id=request.data['id'])
    game.player_path = []
    game.sensor_log = []
    game.result = 'forfeit'
    game.save()
    return Response({'hell':'yeah'})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mousegame(request):
    stoch = True
    if request.data['stoch']=='stationary':
        stoch = False
    userid = User.objects.get(username=request.user)
    played_map_ids = MousegameGame.objects.filter(user=userid).values_list('mousegame_map', flat=True)
    unplayed_maps = MousegameMap.objects.filter(stochastic=stoch).exclude(id__in=played_map_ids)

    stochoptions = [False,True]
    levels_left = []
    for i in range(len(stochoptions)):
        unplayed = MousegameMap.objects.filter(stochastic=stochoptions[i]).exclude(id__in=played_map_ids)
        levels_left.append(len(unplayed))

    if unplayed_maps.exists():
        map_to_send = unplayed_maps.first()
        serialized_map = MousegameSerializer(map_to_send)
        bots = BotData.objects.filter(mousegame_map=map_to_send.id)
        bot_serializer = BotDataSerializer(bots, many=True)
        return Response({'success': True, 
                         'game': serialized_map.data,
                         'bots':bot_serializer.data,
                         'win_rate':map_to_send.win_rate(),
                         'leaderboard':map_to_send.leaderboard(),
                         'levels_left':levels_left})
    return Response({'success': False,'levels_left':levels_left})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_mousegame_list(request):
    userid = User.objects.get(username=request.user)
    games = MousegameGame.objects.filter(user=userid).order_by('datetime')
    gamestrs = [[game.mousegame_map.id,game.result,game.mousegame_map.stochastic,game.datetime,game.mousegame_map.win_rate()] for game in games]
    return Response(gamestrs)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_firegame_list(request):
    userid = User.objects.get(username=request.user)
    games = FiregameGame.objects.filter(user=userid).order_by('datetime')
    gamestrs = [[game.firegame_map.id,game.result,game.firegame_map.difficulty,game.datetime,game.firegame_map.win_rate()] for game in games]
    return Response(gamestrs)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_firegame_leaderboard(request):
    score_map = {
            'easy': 50,
            'medium': 100,
            'hard': 200,
        }
    scores = defaultdict(int)
    for game in FiregameGame.objects.all():
        user = game.user
        difficulty = game.firegame_map.difficulty
        if(game.result == 'win'):
            scores[user] += score_map.get(difficulty, 0)
    top_users = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:5]
    return Response({'leaderboard':[[user.username, score] for user, score in top_users],
                     'userscore':scores[User.objects.get(username=request.user)]})

@permission_classes([IsAuthenticated])
def get_mousegame_map_leaderboard(request):
    id = request.data['id']
    stoch = True
    if request.data['stoch']=='stationary':
        stoch = False
    userid = User.objects.get(username=request.user)
    played_map_ids = MousegameGame.objects.filter(user=userid).values_list('mousegame_map', flat=True)
    unplayed_maps = MousegameMap.objects.filter(stochastic=stoch).exclude(id__in=played_map_ids)
    if unplayed_maps.exists():
        map_to_send = unplayed_maps.first()
        serialized_map = MousegameSerializer(map_to_send)
        bots = BotData.objects.filter(mousegame_map=map_to_send.id)
        bot_serializer = BotDataSerializer(bots, many=True)
        return Response({'success': True, 
                         'game': serialized_map.data,
                         'bots':bot_serializer.data,
                         'win_rate':map_to_send.win_rate(),
                         'leaderboard':map_to_send.leaderboard()})
    return Response({'success': False})


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


