from mousegame.gamelogic import create_grid,state_logic,bot_logic
from django.core.management.base import BaseCommand
from mousegame.models import MousegameMap, BotData
import math
import numpy as np
import json
from scipy.signal import convolve2d

class Command(BaseCommand):
    help = 'Generate and save maze maps by difficulty'

    def add_arguments(self, parser):
        parser.add_argument('--num_stationary', type=int, default=0)
        parser.add_argument('--num_stochastic', type=int, default=0)
        parser.add_argument('--sensor_sensitivity',type=int, default=7)
        parser.add_argument('--grid_size', type=int, default=25)
        parser.add_argument('--max_turns', type=int, default=1000)
    
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
        
        stationary_results = self.run_sim(False,num_stationary,grid_size,sensor_sensitivity,max_turns)
        #generated_stochastic = self.run_sim(True,num_stochastic,grid_size,sensor_sensitivity,max_turns)
        stationary_results = np.array(stationary_results)
        print(np.mean(stationary_results,axis=0))
        print(np.std(stationary_results,axis=0))
        print(stationary_results)
        print(np.sum(stationary_results[:, 2] > stationary_results[:, 3]))

    def run_sim(self,stoch,num,grid_size,sensor_sensitivity,max_turns):
        results = []
        simcount = 0
        while(simcount<num):
            grid,botindex,mouseindex= create_grid.place_initial_positions(create_grid.create_grid(grid_size))
            bot1index,bot2index,bot3index,bot4index = botindex,botindex,botindex,botindex
            originalstate = state_logic.get_initial_dist(grid)
            bot1state,bot2state,bot3state,bot4state = originalstate.copy(),originalstate.copy(),originalstate.copy(),originalstate.copy()
            bot1evidence,bot2evidence,bot3evidence,bot4evidence = [None],[None],[None],[None]
            bot1plan,bot2plan,bot3plan,bot4plan = [],[],[],[]
            b1done,b2done,b3done,b4done = False,False,False,False
            alpha = -math.log(0.5)/(sensor_sensitivity-1)
            bot3mode,bot4mode = 0,0
            turn=1
            while(not b1done or not b2done or not b3done or not b4done):
                if not b1done:
                    grid,bot1index,bot1evidence,bot1plan,bot1state = bot_logic.bot_1(grid,bot1index,turn,bot1plan,bot1evidence.copy(),mouseindex,alpha,bot1state.copy(),stoch)
                if not b2done:
                    grid,bot2index,bot2evidence,bot2plan,bot2state = bot_logic.bot_2(grid,bot2index,turn,bot2plan,bot2evidence.copy(),mouseindex,alpha,bot2state.copy(),stoch)
                if not b3done:
                    grid,bot3index,bot3evidence,bot3plan,bot3state,bot3mode = bot_logic.bot_3_alt(grid,bot3index,turn,bot3plan,bot3evidence.copy(),mouseindex,alpha,bot3state.copy(),stoch,bot3mode)
                if not b4done:
                    grid,bot4index,bot4evidence,bot4plan,bot4state,bot4mode = bot_logic.bot_4(grid,bot4index,turn,bot4plan,bot4evidence.copy(),mouseindex,alpha,bot4state.copy(),stoch,bot4mode)
                    """if bot4mode==1:
                        grid,bot4index,bot4evidence,bot4plan,bot4state = bot_logic.bot_3(grid,bot4index,turn,bot4plan,bot4evidence.copy(),mouseindex,alpha,bot4state.copy(),stoch)"""
                if stoch:
                    grid,mouseindex = bot_logic.move_mouse(grid,mouseindex)
                if bot1index == mouseindex and b1done==False:
                    b1done = True
                if bot2index == mouseindex and b2done==False:
                    b2done = True
                if bot3index == mouseindex and b3done==False:
                    b3done = True
                if bot4index == mouseindex and b4done==False:
                    b4done = True    
                if turn>max_turns:
                    results.append([len(bot1evidence),len(bot2evidence),len(bot3evidence),len(bot4evidence)])
                    break
                turn +=1
            if b1done and b2done and b3done and b4done:
                results.append([len(bot1evidence),len(bot2evidence),len(bot3evidence),len(bot4evidence)])
            simcount+=1
            if simcount%10==0:
                print(simcount,'simulations done')
        return results