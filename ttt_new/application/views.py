from django.shortcuts import render, get_object_or_404

def index(request):
    return render(request,'application/index.html')

def about(request):
    return render(request,'application/about.html')

def game(request):
    return render(request,'application/game.html')

from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from . import models
from datetime import datetime

@csrf_exempt
@login_required
def save_game(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "User not authenticated"}, status=403)
        try:
            board = request.POST.get("board")
            newgame = models.Game()
            newgame.user = request.user
            newgame.board_state = board
            print("Check",newgame.board_state)
            newgame.created_at = datetime.now()
            newgame.save()
            return JsonResponse({"message": "Game saved!"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

@login_required
def load_games(request):
    games = models.Game.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'application/load_games.html', {'games': games})

def load_game(request, id):
    game = get_object_or_404(models.Game, id=id)
    board_state = game.board_state
    return render(request, 'application/oldgame.html', {'board_state': board_state})