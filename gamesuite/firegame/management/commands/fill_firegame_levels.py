from django.core.management.base import BaseCommand
from firegame.models import FiregameMap
from firegame.gamelogic import create_grid,fire_step,bot_logic,get_adj_indices
import random
import numpy as np
import json

class Command(BaseCommand):
    help = 'Generate and save maze maps by difficulty'

    def add_arguments(self, parser):
        parser.add_argument('--num_easy', type=int, default=0)
        parser.add_argument('--num_medium', type=int, default=0)
        parser.add_argument('--num_hard', type=int, default=0)

    def handle(self, *args, **options):
        num_easy = options['num_easy']
        num_medium = options['num_medium']
        num_hard = options['num_hard']

        generated_easy,generated_medium,generated_hard = self.generate_maps(num_easy,num_medium,num_hard)

        self.stdout.write(self.style.SUCCESS(
            f'Generated {generated_easy} easy, {generated_medium} medium, {generated_hard} hard levels.'
        ))

    def generate_maps(self, easy_count,medium_count,hard_count):
        generated_easy = 0
        generated_medium = 0
        generated_hard = 0
        tries = 0
        max_tries = 100000  # safety cap to prevent infinite loops
        while (generated_easy < easy_count or generated_medium < medium_count or generated_hard < hard_count) and tries < max_tries:
            tries += 1
            grid,botindex,extindex,fireindex = create_grid.place_initial_positions(create_grid.create_grid(25))
            newmap = FiregameMap()
            gridaslist = grid.tolist()
            newmap.initial_board = json.dumps(gridaslist)
            newmap.bot_index,newmap.ext_index,newmap.fire_index = json.dumps(botindex),json.dumps(extindex),json.dumps(fireindex)
            fire_progression = []
            i=0
            while(0 in grid):
                grid,this_turns_fire = fire_step.fire_step(grid)
                fire_progression.append(this_turns_fire)
                i+=1
                if i==200:
                    j = len(fire_progression)-1
                    while len(fire_progression[j])==0:
                        del fire_progression[j]
                        j-=1
                    break
            newmap.fire_progression = json.dumps(fire_progression)
            difficulty = gauge_difficulty(newmap)
            if not difficulty == 'too easy' and not difficulty == 'too hard':
                newmap.difficulty = difficulty
                if difficulty=='easy':
                    if generated_easy < easy_count:
                        generated_easy += 1
                        newmap.save()
                if difficulty=='medium':
                    if generated_medium < medium_count:
                        generated_medium += 1
                        newmap.save()
                if difficulty=='hard':
                    if generated_hard < hard_count:
                        generated_hard += 1
                        newmap.save()
        return generated_easy,generated_medium,generated_hard

def gauge_difficulty(newmap):
    if not success_possible(newmap):
        return 'too hard'
    bot1success = test_bot_1(newmap)
    if bot1success:
        return 'too easy'
    bot2or3success = test_bots_2_3(newmap)
    if not bot2or3success:
        bot4success = test_bot_4(newmap)
        if bot4success:
            return 'medium'
        else:
            return 'hard'
    else:
        test_bot_4(newmap)
        return 'easy'
    
def success_possible(newmap):
    grid,botindex,fire = get_correct_datatypes(newmap)
    marked = [botindex]
    prev = [botindex]
    previndex = {botindex: None}
    for i in range(len(fire)):
        for j in range(len(fire[i])):
            grid[(fire[i][j][0],fire[i][j][1])]+=2
        curr = []
        for item in prev:
            adjind = get_adj_indices.get_adj_indices(item[0],item[1],len(grid))
            for item2 in adjind:
                if item2 not in marked and grid[item2]%10==0:
                    curr.append(item2)
                    marked.append(item2)
                    previndex[item2] = item
                if grid[item2]%10==5:
                    previndex[item2] = item
                    index = item2
                    pathlist = []
                    while not previndex[index]==None:
                        pathlist.append(index)
                        index = previndex[index]
                    pathlist.reverse()
                    newmap.successpossiblepath = json.dumps(pathlist)
                    return True
            prev = curr
    return False


def test_bot_1(newmap):
    grid,botindex,fire = get_correct_datatypes(newmap)
    initialpath = bot_logic.bfs(grid,botindex)
    bot1path = [botindex]
    for i in range(len(newmap.fire_progression)):
        bot1path.append(initialpath[i+1])
        for j in range(len(fire[i])):
            grid[(fire[i][j][0],fire[i][j][1])] += 2
        if grid[initialpath[i+1]]%10==2:
            bot1path.pop(0)
            newmap.bot1path=json.dumps(bot1path)
            return False
        if grid[initialpath[i+1]]%10==5:
            bot1path.pop(0)
            newmap.bot1path=json.dumps(bot1path)
            newmap.bot2path=json.dumps([])
            newmap.bot3path=json.dumps([])
            newmap.bot4path=json.dumps([])
            return True


def test_bots_2_3(newmap):
    grid,botindex,fire = get_correct_datatypes(newmap)
    bot2index, bot3index = botindex,botindex
    bot2path,bot3path = [],[]
    grid[botindex] += 100
    for i in range(len(fire)):
        grid,bot2index = bot_logic.move_bot_2(grid,bot2index)
        grid,bot3index = bot_logic.move_bot_3(grid,bot3index)
        bot2path.append(bot2index)
        bot3path.append(bot3index)
        for j in range(len(fire[i])):
            grid[(fire[i][j][0],fire[i][j][1])] += 2
        if grid[bot2index]%10==2 and grid[bot3index]%10==2:
            newmap.bot2path = json.dumps(bot2path)
            newmap.bot3path = json.dumps(bot3path)
            return False
        if (grid[bot2index]%10==5 and grid[bot3index]%10==2) or (grid[bot2index]%10==2 and grid[bot3index]%10==5) or (grid[bot2index]%10==5 and grid[bot3index]%10==5):
            newmap.bot2path = json.dumps(bot2path)
            newmap.bot3path = json.dumps(bot3path)
            return True

def test_bot_4(newmap):
    grid,botindex,fire = get_correct_datatypes(newmap)
    safeguard = False
    weights = bot_logic.get_bot_4_weights(grid,.4)
    initialpath = bot_logic.bot_4_UFCS(grid,botindex,weights)
    botpath = []
    for i in range(len(fire)):
        grid,botindex,safeguard = bot_logic.move_bot_4(grid,botindex,initialpath,safeguard)
        botpath.append(botindex)
        for j in range(len(fire[i])):
            grid[(fire[i][j][0],fire[i][j][1])] += 2
        if grid[botindex]%10==2:
            newmap.bot4path = json.dumps(botpath)
            return False
        if grid[botindex]%10==5:
            newmap.bot4path = json.dumps(botpath)
            return True

def get_correct_datatypes(newmap):
    grid = np.array(json.loads(newmap.initial_board))
    botindex = json.loads(newmap.bot_index)
    botindex = (botindex[0],botindex[1])
    fire = json.loads(newmap.fire_progression)
    return grid,botindex,fire
        
