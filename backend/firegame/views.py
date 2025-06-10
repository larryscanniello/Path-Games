from django.shortcuts import render,HttpResponse
from django.http import JsonResponse
from .gamelogic import create_grid,fire_step
from .models import FiregameMap
import random
import json

def play_game(request,difficulty):
    context = {'difficulty':difficulty}
    return render(request,'play_game.html',context)

def load_game(request,difficulty):
    games = FiregameMap.objects.filter(difficulty=difficulty)
    game_instance = random.choice(games)
    layout,botindex  = game_instance.initial_board, game_instance.bot_index
    extindex,fireindex = game_instance.ext_index, game_instance.fire_index
    return JsonResponse({
        'layout': layout,
        'botindex':botindex,
        'extindex':extindex,
        'fireindex':fireindex,
        'gameid': game_instance.id
        })

def load_see_bots(request,id):
    game_instance = FiregameMap.objects.get(id=id)
    layout,botindex  = game_instance.initial_board, game_instance.bot_index
    extindex,fireindex = game_instance.ext_index, game_instance.fire_index
    attributes = ['successpossiblepath','bot1path','bot2path','bot3path','bot4path']
    botsintrial = [not len(getattr(game_instance,path))==2 for path in attributes]
    #its len==2 because the empty paths are string []
    return JsonResponse({
        'layout': layout,
        'botindex':botindex,
        'extindex':extindex,
        'fireindex':fireindex,
        'gameid': id,
        'botsintrial': botsintrial,
        })

def make_move(request,difficulty):
    body = json.loads(request.body)
    grid = body['grid']
    turncount = body['turncount']
    game_instance = FiregameMap.objects.get(id=body['gameid'])
    firelist = json.loads(game_instance.fire_progression)
    for fire in firelist[turncount]:
        grid[fire[0]][fire[1]]+=2
    return JsonResponse({'grid': grid})

def go_forward(request,id):
    body = json.loads(request.body)
    grid = body['grid']
    turncount = body['turncount']
    game_instance = FiregameMap.objects.get(id=id)
    firelist = json.loads(game_instance.fire_progression)
    for fire in firelist[turncount]:
        grid[fire[0]][fire[1]]+=2
    path_keys = ['successpossiblepath','bot1path','bot2path','bot3path','bot4path']
    paths = {key:json.loads(getattr(game_instance,key)) for key in path_keys}
    indices = {}
    for key, path in paths.items():
        indices[key.replace('path', 'index')] = path[turncount] if turncount < len(path) else [-1, -1]
    print('bot3path: ',game_instance.bot3path)
    return JsonResponse({'grid': grid,
                         'indices': indices})

def go_backward(request, id):
    body = json.loads(request.body)
    grid = body['grid']
    turncount = body['turncount']
    game_instance = FiregameMap.objects.get(id=id)
    firelist = json.loads(game_instance.fire_progression)
    for fire in firelist[turncount-1]:
        grid[fire[0]][fire[1]]-=2
    file = open('results.txt','w')
    file.write('\n'.join(str(line) for line in grid))
    file.close()
    successpossiblepath = json.loads(game_instance.successpossiblepath)
    bot1path = game_instance.bot1path
    if turncount == 0:
        successpossiblepathindex = [-1,-1]
    elif turncount==1:
        successpossiblepathindex = json.loads(game_instance.bot_index)
    else:
        successpossiblepathindex = successpossiblepath[turncount-2]
    print('check1324',successpossiblepathindex)
    return JsonResponse({'grid': grid,
                         'successpossiblepathindex':successpossiblepathindex
                         })

def select_difficulty(request):
    return render(request, 'select.html')

def see_bots(request,id):
    context = {'id':id}
    return render(request,'see_bots.html',context)

