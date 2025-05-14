from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from firegame.models import FiregameMap
from mousegame.models import MousegameMap, BotData
from .serializers import FiregameSerializer, MousegameSerializer, BotDataSerializer, UserSerializer
from rest_framework.decorators import api_view,permission_classes
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

@api_view(['GET'])
@permission_classes([AllowAny])
def get_firegame_by_id(request, id):
    try:
        game = FiregameMap.objects.get(id=id)
    except FiregameMap.DoesNotExist:
        return Response({'error': 'Game not found'})
    serializer = FiregameSerializer(game)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
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
