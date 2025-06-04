import math
import random
from . import bot_logic, state_logic,get_adj_indices
import numpy as np
import heapq
from collections import deque
from scipy.signal import convolve2d

def bot_1(grid,bot1index,t,plan,bot1evidence,mouseindex,a,bot1state,stoch):
    if plan == []:
        d = calc_manhattan_dist(bot1index,mouseindex)
        if random.random()<math.exp(-a*(d-1)):
            newevidence = (t,1,bot1index)
            bot1evidence.append(newevidence)
        else:
            newevidence = (t,0,bot1index)
            bot1evidence.append(newevidence)
        bot1state = state_logic.filtering(bot1state.copy(),stoch,bot1evidence.copy(),t,grid.copy(),a)
        destinationindex = np.unravel_index(bot1state.argmax(), bot1state.shape)
        plan = bfs(grid,bot1index,destinationindex,1)
        return grid,bot1index,bot1evidence,plan,bot1state
    
    else:
        bot1index = plan[0]
        plan.pop(0)
        newevidence = (t,2,bot1index)
        bot1evidence.append(newevidence)
        bot1state = state_logic.filtering(bot1state.copy(),stoch,bot1evidence.copy(),t,grid.copy(),a)
        return grid,bot1index,bot1evidence,plan,bot1state 

def bot_2(grid,bot2index,t,plan,bot2evidence,mouseindex,a,bot2state,stoch):
    if plan == []:
        d = calc_manhattan_dist(bot2index,mouseindex)
        if random.random()<math.exp(-a*(d-1)):
            newevidence = (t,1,bot2index)
            bot2evidence.append(newevidence)
        else:
            newevidence = (t,0,bot2index)
            bot2evidence.append(newevidence)
        bot2state = state_logic.filtering(bot2state.copy(),stoch,bot2evidence.copy(),t,grid,a)
        destinationindex = np.unravel_index(bot2state.argmax(), bot2state.shape)
        if bot2index == destinationindex:
            statecopy = bot2state.copy()
            statecopy[bot2index]-=1
            destinationindex = np.unravel_index(statecopy.argmax(), bot2state.shape)
        plan = bfs(grid,bot2index,destinationindex,2)
        return grid,bot2index,bot2evidence,plan,bot2state
    if plan[0]==None:
        d = calc_manhattan_dist(bot2index,mouseindex)
        if random.random()<math.exp(-a*(d-1)):
            newevidence = (t,1,bot2index)
            bot2evidence.append(newevidence)
        else:
            newevidence = (t,0,bot2index)
            bot2evidence.append(newevidence)
        bot2state = state_logic.filtering(bot2state.copy(),stoch,bot2evidence.copy(),t,grid,a)
        plan.pop(0)
        destinationindex = np.unravel_index(bot2state.argmax(), bot2state.shape)
        if not plan[len(plan)-1] == destinationindex:
            plan = bfs(grid,bot2index,destinationindex,2)
        return grid,bot2index,bot2evidence,plan,bot2state
    else:
        bot2index = plan[0]
        plan.pop(0)
        newevidence = (t,2,bot2index)
        bot2evidence.append(newevidence)
        bot2state= state_logic.filtering(bot2state.copy(),stoch,bot2evidence.copy(),t,grid,a)
        return grid,bot2index,bot2evidence,plan,bot2state

def bot_3(grid,bot3index,t,plan,bot3evidence,mouseindex,a,bot3state,stoch):
    if plan == []:
        d = calc_manhattan_dist(bot3index,mouseindex)
        if random.random()<math.exp(-a*(d-1)):
            newevidence = (t,1,bot3index)
            bot3evidence.append(newevidence)
        else:
            newevidence = (t,0,bot3index)
            bot3evidence.append(newevidence)
        bot3state = state_logic.filtering(bot3state.copy(),stoch,bot3evidence.copy(),t,grid.copy(),a)
        destinationindex = np.unravel_index(bot3state.argmax(), bot3state.shape)
        if bot3index == destinationindex:
            statecopy = bot3state.copy()
            statecopy[bot3index]-=1
            destinationindex = np.unravel_index(statecopy.argmax(), bot3state.shape)
        if stoch:
            estd = calc_manhattan_dist(bot3index,destinationindex)
            if estd>3:
                plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,bot3state.copy(),3,stoch,bot3evidence.copy(),t)
                return grid,bot3index,bot3evidence,plan,bot3state
            else:
                plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,bot3state.copy(),1,stoch,bot3evidence.copy(),t)
                return grid,bot3index,bot3evidence,plan,bot3state
        else:
            plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,bot3state.copy(),3,stoch,bot3evidence.copy(),t)
            return grid,bot3index,bot3evidence,plan,bot3state
    if plan[0]==None:
        d = calc_manhattan_dist(bot3index,mouseindex)
        if random.random()<math.exp(-a*(d-1)):
            newevidence = (t,1,bot3index)
            bot3evidence.append(newevidence)
        else:
            newevidence = (t,0,bot3index)
            bot3evidence.append(newevidence)
        bot3state= state_logic.filtering(bot3state.copy(),stoch,bot3evidence.copy(),t,grid,a)
        plan.pop(0)
        return grid,bot3index,bot3evidence,plan,bot3state
    else:
        bot3index = plan[0]
        plan.pop(0)
        newevidence = (t,2,bot3index)
        bot3evidence.append(newevidence)
        bot3state = state_logic.filtering(bot3state.copy(),stoch,bot3evidence.copy(),t,grid,a)
        return grid,bot3index,bot3evidence,plan,bot3state

def bot_3_alt(grid,bot3index,turn,plan,bot3evidence,mouseindex,a,bot3state,stoch,mode):
    if not plan==[]:
        if plan[0]==None:
            d = calc_manhattan_dist(bot3index,mouseindex)
            if random.random()<math.exp(-a*(d-1)):
                newevidence = (turn,1,bot3index)
                bot3evidence.append(newevidence)
            else:
                newevidence = (turn,0,bot3index)
                bot3evidence.append(newevidence)
            bot3state= state_logic.filtering(bot3state.copy(),stoch,bot3evidence.copy(),turn,grid,a)
            plan.pop(0)
            return grid,bot3index,bot3evidence,plan,bot3state,mode
        else:
            bot3index = plan[0]
            plan.pop(0)
            newevidence = (turn,2,bot3index)
            bot3evidence.append(newevidence)
            bot3state = state_logic.filtering(bot3state.copy(),stoch,bot3evidence.copy(),turn,grid,a)
            return grid,bot3index,bot3evidence,plan,bot3state,mode
    d = calc_manhattan_dist(bot3index,mouseindex)
    if random.random()<math.exp(-a*(d-1)):
        newevidence = (turn,1,bot3index)
        bot3evidence.append(newevidence)
    else:
        newevidence = (turn,0,bot3index)
        bot3evidence.append(newevidence)
    bot3state = state_logic.filtering(bot3state.copy(),stoch,bot3evidence,turn,grid,a)
    if mode==0:
        kernel = np.ones((7, 7))
        block_sums = convolve2d(bot3state, kernel, mode='valid')
        if not np.any(block_sums > 0.5):
            bot3state = state_logic.filtering(bot3state.copy(),stoch,bot3evidence.copy(),turn,grid.copy(),a)
            destinationindex = np.unravel_index(bot3state.argmax(), bot3state.shape)
            if bot3index == destinationindex:
                statecopy = bot3state.copy()
                statecopy[bot3index]-=1
                destinationindex = np.unravel_index(statecopy.argmax(), bot3state.shape)
            plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,bot3state.copy(),3,stoch,bot3evidence.copy(),turn)
            return grid,bot3index,bot3evidence,plan,bot3state,mode
        else:
            mode=1
    #at this point mode=1
    bot3state = state_logic.filtering(bot3state.copy(),stoch,bot3evidence.copy(),turn,grid.copy(),a)
    destinationindex = np.unravel_index(bot3state.argmax(), bot3state.shape)
    if stoch:
        plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,bot3state,3,stoch,bot3evidence,turn)
    else:
        plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,bot3state,1,stoch,bot3evidence,turn)
    return grid,bot3index,bot3evidence,plan,bot3state,mode    
    
def bot_4(grid,bot4index,turn,plan,bot4evidence,mouseindex,a,bot4state,stoch,mode):
    if not plan==[]:
        if plan[0]==None:
            d = calc_manhattan_dist(bot4index,mouseindex)
            if random.random()<math.exp(-a*(d-1)):
                newevidence = (turn,1,bot4index)
                bot4evidence.append(newevidence)
            else:
                newevidence = (turn,0,bot4index)
                bot4evidence.append(newevidence)
            bot4state= state_logic.filtering(bot4state.copy(),stoch,bot4evidence.copy(),turn,grid,a)
            plan.pop(0)
            return grid,bot4index,bot4evidence,plan,bot4state,mode
        else:
            bot4index = plan[0]
            plan.pop(0)
            newevidence = (turn,2,bot4index)
            bot4evidence.append(newevidence)
            bot4state = state_logic.filtering(bot4state.copy(),stoch,bot4evidence.copy(),turn,grid,a)
            return grid,bot4index,bot4evidence,plan,bot4state,mode

    #at this point, plan is empty, we need to sense and get new plan
    d = calc_manhattan_dist(bot4index,mouseindex)
    if random.random()<math.exp(-a*(d-1)):
        newevidence = (turn,1,bot4index)
        bot4evidence.append(newevidence)
    else:
        newevidence = (turn,0,bot4index)
        bot4evidence.append(newevidence)
    bot4state = state_logic.filtering(bot4state.copy(),stoch,bot4evidence,turn,grid,a)
    if mode==0:
        kernel = np.ones((7, 7))
        block_sums = convolve2d(bot4state, kernel, mode='valid')
        if not np.any(block_sums > 0.5):
            information_gain_array = state_logic.calculate_expected_entropy_reduction(bot4state,stoch,grid,a,bot4index)
            destinationindex = np.unravel_index(information_gain_array.argmax(), information_gain_array.shape)
            if bot4index == destinationindex:
                information_gain_array[bot4index]-=10000
                destinationindex = np.unravel_index(information_gain_array.argmax(), bot4state.shape)
            plan = bot_3_dynamic_UFCS(grid,bot4index,destinationindex,bot4state,4,stoch,bot4evidence,turn)
            return grid,bot4index,bot4evidence,plan,bot4state,mode
        else:
            mode=1
            return grid,bot4index,bot4evidence,plan,bot4state,mode
    #at this point mode=1
    bot4state = state_logic.filtering(bot4state.copy(),stoch,bot4evidence.copy(),turn,grid.copy(),a)
    destinationindex = np.unravel_index(bot4state.argmax(), bot4state.shape)
    if stoch:
        plan = bot_3_dynamic_UFCS(grid,bot4index,destinationindex,bot4state,3,stoch,bot4evidence,turn)
    else:
        plan = bot_3_dynamic_UFCS(grid,bot4index,destinationindex,bot4state,1,stoch,bot4evidence,turn)
    return grid,bot4index,bot4evidence,plan,bot4state,mode
    
    
    """kernel = np.ones((7, 7))
    block_sums = convolve2d(bot4state, kernel, mode='valid')
    destinationpreindex = np.unravel_index(block_sums.argmax(), block_sums.shape)
    i,j = destinationpreindex[0],destinationpreindex[1]
    if (i <= bot4index[0] < i+7) and (j <= bot4index[1] < j+7):
        subarray = bot4state[i:i+7, j:j+7]
        local_max_idx = np.unravel_index(np.argmax(subarray), subarray.shape)
        destinationindex = (local_max_idx[0] + i, local_max_idx[1] + j)        
        plan = bot_3_dynamic_UFCS(grid,bot4index,destinationindex,bot4state,3,stoch,bot4evidence,turn)
    else:
        destinationindex = (destinationpreindex[0]+3,destinationpreindex[1]+3)
        plan = bot_3_dynamic_UFCS(grid,bot4index,destinationindex,bot4state,1,stoch,bot4evidence,turn)
    return grid,bot4index,bot4evidence,plan,bot4state,mode"""


def bfs(grid,start,end,bot):
    prev = {}
    marked = []
    queue = deque()
    queue.append(start)
    prev[start] = None
    marked.append(start)
    while not len(queue)==0:
        currentstate = queue.popleft()
        if currentstate == end:
            return make_bfs_path_list(prev,currentstate,bot)
        adjindexlist = get_adj_indices.get_adj_indices(currentstate[0],currentstate[1],len(grid))
        for item in adjindexlist:
            if (grid[item]%10==0 or grid[item]%10==2) and item not in marked:
                queue.append(item)
                marked.append(item)
                prev[item] = currentstate
    return []
    
def make_bfs_path_list(prev,currentstate,bot):
    #An extension of the bfs function, just makes the actual list of indices/tuples to return
    if bot==4:
        bfslist = [None,None,None,None]
        while not prev[currentstate]==None:
            bfslist.append(currentstate)
            currentstate = prev[currentstate]
        bfslist.reverse()
        return bfslist
    bfslist = []
    while not prev[currentstate]==None:
        #print('Current state: ',currentstate)
        bfslist.append(currentstate)
        if bot==2 or bot==3:
            bfslist.append(None)
        currentstate = prev[currentstate]
    if bot==2 or bot==3:
        bfslist.pop()
    bfslist.reverse()
    if bot==3:
        while len(bfslist)>9:
            bfslist.pop()
    return bfslist

def move_mouse(grid,mouseindex):
    adjlist = get_adj_indices.get_adj_indices(mouseindex[0],mouseindex[1],len(grid))
    openadjlist = []
    for index in adjlist:
        if grid[index]%10==0:
            openadjlist.append(index)
    randomint = math.floor(random.random()*(len(openadjlist)+1))
    if randomint == len(openadjlist):
        return grid,mouseindex
    else:
        mouseindex = openadjlist[randomint]
        return grid,mouseindex

def calc_manhattan_dist(tup1,tup2):
    return int(math.fabs(tup1[0]-tup2[0])+math.fabs(tup1[1]-tup2[1]))

def bot_3_dynamic_UFCS(grid,start,destinationindex,state,bot,stoch,evidence,t):
    #turn 3d UFCS into 2d by making weights list of arrays into a hashmap/graph that UFCS algorithm can traverse
    newweights = {(0,start,0):None}
    seen = []
    currlevel = [(0,start,0)]
    j=0
    rowsign = destinationindex[0]-start[0]
    colsign = destinationindex[1]-start[1]
    check = False
    predictedstate = state
    while not currlevel==[]:
        predictedstate = state_logic.predicting(predictedstate.copy(),stoch,evidence.copy(),grid)
        nextlevel = []
        for item in currlevel:
            newweights[item] = None
            if item[1] == destinationindex:
                check = True
                break
            adjsqrs = get_adj_indices.get_adj_indices(item[1][0],item[1][1],len(grid))
            for sq in adjsqrs:
                if (grid[sq]%10==0 or grid[sq]%10==2) and not sq in seen:
                    #These next four lines are made so that if the destination is up and to the right of the start for instance,
                    #the UFCS graph can only point up or right
                    if (sq[0]-item[1][0]==0 or (sq[0]-item[1][0]>0 and rowsign>0) or (sq[0]-item[1][0]<0 and rowsign <0)):
                        if (sq[1]-item[1][1]==0 or (sq[1]-item[1][1]>0 and colsign>0) or (sq[1]-item[1][1]<0 and colsign<0)):
                            if min(start[0],destinationindex[0])<=sq[0]<=max(start[0],destinationindex[0]):
                                if min(start[1],destinationindex[1])<=sq[1]<=max(start[1],destinationindex[1]):
                                    new = (1+math.log(1-predictedstate[sq]),sq,item[2]+1)
                                    if not new in nextlevel:
                                        nextlevel.append(new)
                                    if newweights[item]==None:
                                        newweights[item]=[new]
                                    else:
                                        newweights[item].append(new)
            seen.append(item[1])
        if check == True:
            break
        currlevel = nextlevel
        j+=1
    check = False
    for item in list(newweights.values()):
        if not item == None:
            for item2 in item:
                if item2[1]==destinationindex:
                    check = True
    if not check:
        newweights = {(0,start,0):None}
        seen = []
        currlevel = [(0,start,0)]
        j=0
        check = False
        predictedstate = state
        while not currlevel==[]:
            predictedstate = state_logic.predicting(predictedstate.copy(),stoch,evidence.copy(),grid)
            nextlevel = []
            for item in currlevel:
                newweights[item] = None
                if item[1] == destinationindex:
                    check = True
                    break
                adjsqrs = get_adj_indices.get_adj_indices(item[1][0],item[1][1],len(grid))
                for sq in adjsqrs:
                    if (grid[sq]%10==0 or grid[sq]%10==2) and not sq in seen:
                        new = (1+math.log(1-predictedstate[sq]),sq,item[2]+1)
                        if not new in nextlevel:
                            nextlevel.append(new)
                        if newweights[item]==None:
                            newweights[item]=[new]
                        else:
                            newweights[item].append(new)
                seen.append(item[1])
            if check == True:
                break
            currlevel = nextlevel
            j+=1
    distances = {}
    prev = {}
    fringe = []
    distances[(0,start,0)]=0
    prev[start]= None
    heapq.heappush(fringe,(0,start,0))
    while not fringe == []:
        curr = heapq.heappop(fringe)
        if curr[1]==destinationindex:
            return make_bfs_path_list(prev,curr[1],bot)
        #adjlist = get_adj_indices(curr[1][0],curr[1][1],len(grid))
        if curr in newweights.keys():
            if not newweights[curr]==None:
                for child in newweights[curr]:
                    if grid[child[1]]%10==0 or grid[child[1]]%10==2:
                        temp_dist = distances[curr]+child[0]
                        if (not child in distances) or temp_dist<distances[child]:
                            distances[child]=temp_dist
                            prev[child[1]]=curr[1]
                            heapq.heappush(fringe,child)
    
    return []

