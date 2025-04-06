from django.shortcuts import render,HttpResponse
from django.http import JsonResponse
from .gamelogic import FireBots
from .gamelogic import creategrid
from .gamelogic import fire_step
import json

def firegame(request):
    return render(request,'firegame.html')

def new_game(request):
    layout = creategrid.create_grid(25)
    layout,botindex,extindex,fireindex = creategrid.place_initial_positions(layout,0)
    layout = layout.tolist()
    return JsonResponse({
        'layout': layout,
        'botindex':botindex,
        'extindex':extindex,
        'fireindex':fireindex
        })

def make_move(request):
    grid = json.loads(request.body)
    grid = fire_step.fire_step(grid)
    return JsonResponse({'grid': grid})