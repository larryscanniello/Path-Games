from mousegame.gamelogic import create_grid,state_logic,bot_logic
from django.core.management.base import BaseCommand
from mousegame.models import MousegameMap, BotData
import math
import numpy as np
import json

class Command(BaseCommand):
    help = 'Generate and save maze maps by difficulty'

    def add_arguments(self, parser):
        parser.add_argument('--num_stationary', type=int, default=0)
        parser.add_argument('--num_stochastic', type=int, default=0)
        parser.add_argument('--sensor_sensitivity',type=int, default=7)
        parser.add_argument('--grid_size', type=int, default=25)
        parser.add_argument('--max_turns', type=int, default=250)
    
    def handle(self, *args, **options):
        num_stationary = options['num_stationary']
        num_stochastic = options['num_stochastic']
        if num_stationary==0 and num_stochastic==0:
            self.stdout.write(self.style.ERROR('Error: Write --num_stationary and --num_stochastic as arguments to specify number of games to make.'))
            return
        sensor_sensitivity = options['sensor_sensitivity']
        if sensor_sensitivity<1 or sensor_sensitivity>100:
            self.stdout.write(self.style.ERROR('Error: Only ints in [1,100] allowed for sensor sensitivity.'))
            return
        grid_size = options['grid_size']
        if grid_size<5 or grid_size>40:
            self.stdout.write(self.style.ERROR('Error: Grid size should be an int in [5,40].'))
            return
        max_turns = options['max_turns']
        if max_turns < 1:
            self.stdout.write(self.style.ERROR('Error: Enter a positive integer for max_turns.'))
            return
        generated_stationary = self.generate_map(False,num_stationary,grid_size,sensor_sensitivity,max_turns)
        generated_stochastic = self.generate_map(True,num_stochastic,grid_size,sensor_sensitivity,max_turns)
        self.stdout.write(self.style.SUCCESS(
            f'Generated {generated_stationary} stationary and {generated_stochastic} stochastic levels.'
        ))
    
    def generate_map(self,stoch,num,grid_size,sensor_sensitivity,max_turns):
        generated = 0
        attempts = 0
        while(generated<num and attempts<10000):
            grid,botindex,mouseindex= create_grid.place_initial_positions(create_grid.create_grid(grid_size))
            bot1index,bot2index,bot3index,bot4index = botindex,botindex,botindex,botindex
            newmap = MousegameMap()
            newmap.grid,newmap.bot_starting_index,newmap.mouse_starting_index,newmap.stochastic = json.dumps(grid.tolist()),json.dumps(botindex),json.dumps(mouseindex),stoch
            newmap.sensor_sensitivity = sensor_sensitivity
            originalstate = state_logic.get_initial_dist(grid)
            bot1state,bot2state,bot3state,bot4state = originalstate.copy(),originalstate.copy(),originalstate.copy(),originalstate.copy()
            bot1states,bot2states,bot3states,bot4states = [bot1state.tolist()],[bot2state.tolist()],[bot3state.tolist()],[bot4state.tolist()]
            bot1evidence,bot2evidence,bot3evidence,bot4evidence = [None],[None],[None],[None]
            bot1plan,bot2plan,bot3plan,bot4plan = [],[],[],[None,None,None,None,None]
            bot1plans,bot2plans,bot3plans,bot4plans = [],[],[],[bot4plan]
            b1done,b2done,b3done,b4done = False,False,False,False
            alpha = -math.log(0.5)/(sensor_sensitivity-1)
            results = [0,0,0,0]
            mousepath = [mouseindex]
            turn=1
            bot3mode,bot4mode = 0,0
            bot4modeprev = 0
            bot4modeturn = 0
            while((not b1done or not b2done or not b3done or not b4done) and turn<max_turns):
                if not b1done:
                    plantempbot1 = bot1plan.copy()
                    grid,bot1index,bot1evidence,bot1plan,bot1state = bot_logic.bot_1(grid,bot1index,turn,bot1plan,bot1evidence.copy(),mouseindex,alpha,bot1state.copy(),stoch)
                    if plantempbot1==[]:
                        bot1plans.append(bot1plan.copy())
                    bot1states.append(bot1state.tolist())
                if not b2done:
                    grid,bot2index,bot2evidence,bot2plan,bot2state = bot_logic.bot_2(grid,bot2index,turn,bot2plan,bot2evidence.copy(),mouseindex,alpha,bot2state.copy(),stoch)
                    bot2plans.append(bot2plan.copy())
                    bot2states.append(bot2state.tolist())
                if not b3done:
                    plantempbot3 = bot3plan.copy()
                    grid,bot3index,bot3evidence,bot3plan,bot3state,bot3mode = bot_logic.bot_3_alt(grid,bot3index,turn,bot3plan,bot3evidence.copy(),mouseindex,alpha,bot3state.copy(),stoch,bot3mode)
                    if plantempbot3==[]:
                        bot3plans.append(bot3plan.copy())
                    bot3states.append(bot3state.tolist())
                if not b4done:
                    plantempbot4 = bot4plan.copy()
                    grid,bot4index,bot4evidence,bot4plan,bot4state,bot4mode = bot_logic.bot_4(grid,bot4index,turn,bot4plan,bot4evidence.copy(),mouseindex,alpha,bot4state.copy(),stoch,bot4mode)
                    if bot4mode==1 and bot4modeprev==0:
                        bot4modeturn = turn
                    bot4modeprev = bot4mode
                    if plantempbot4 == []:
                        bot4plans.append(bot4plan.copy())
                    bot4states.append(bot4state.tolist())
                if stoch:
                    grid,mouseindex = bot_logic.move_mouse(grid,mouseindex)
                    mousepath.append(mouseindex)
                if bot1index == mouseindex and b1done==False:
                    b1done = True
                    results[0] = turn
                if bot2index == mouseindex and b2done==False:
                    b2done = True
                    results[1] = turn
                if bot3index == mouseindex and b3done==False:
                    b3done = True
                    results[2] = turn
                if bot4index == mouseindex and b4done==False:
                    b4done = True
                    results[3] = turn
                if turn>max_turns:
                    break
                turn +=1
            attempts += 1
            if True:
                generated += 1
                newmap.mouse_path = mousepath
                newmap.num_turns = turn
                bot1data,bot2data,bot3data,bot4data = BotData(),BotData(),BotData(),BotData()
                bot1data.mousegame_map,bot2data.mousegame_map,bot3data.mousegame_map,bot4data.mousegame_map = newmap,newmap,newmap,newmap
                bot1data.evidence,bot2data.evidence,bot3data.evidence,bot4data.evidence = json.dumps(bot1evidence),json.dumps(bot2evidence),json.dumps(bot3evidence),json.dumps(bot4evidence)
                bot1data.states,bot2data.states,bot3data.states,bot4data.states = json.dumps(bot1states),json.dumps(bot2states),json.dumps(bot3states),json.dumps(bot4states)
                bot1data.bot,bot2data.bot,bot3data.bot,bot4data.bot = 1,2,3,4
                bot4data.modechange = bot4modeturn
                bot1data.plans,bot2data.plans,bot3data.plans,bot4data.plans = bot1plans,bot2plans,bot3plans,bot4plans
                newmap.save()
                print(newmap.id)
                bot1data.save(),bot2data.save(),bot3data.save(),bot4data.save()
                print(len(bot1evidence),len(bot2evidence),len(bot3evidence),len(bot4evidence))
        return generated