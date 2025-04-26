import heapq
from collections import deque
from . import get_adj_indices,fire_step
import numpy as np

def bfs(grid,start):
        #Just a straightforward bfs that searches the grid for a shortest path from the start to the button
        prev = {}
        marked = []
        queue = deque()
        queue.append(start)
        prev[start] = None
        marked.append(start)
        while not len(queue)==0:
            currentstate = queue.popleft()
            if grid[currentstate]%10==5:
                bfslist = make_bfs_path_list(prev,currentstate)
                return bfslist
            adjindexlist = get_adj_indices.get_adj_indices(currentstate[0],currentstate[1],len(grid))
            for item in adjindexlist:
                if (grid[item]%10==0 or grid[item]%10==5) and item not in marked:
                    queue.append(item)
                    marked.append(item)
                    prev[item] = currentstate
        return []

def make_bfs_path_list(prev,currentstate):
        #An extension of the bfs function, just makes the actual list of indices/tuples to return
        bfslist = []
        while not prev[currentstate] == None:
            bfslist.append(currentstate)
            currentstate = prev[currentstate]
        bfslist.append(currentstate)
        bfslist.reverse()
        return bfslist

def move_bot_2(grid,bot2index):
    if grid[bot2index]%10==2 or grid[bot2index]%10==5:
        return grid,bot2index
    #bot 2 does bfs at every step
    bfslist = bfs(grid,bot2index)
    if bfslist == []:
        return grid,bot2index
    """ grid[bfslist[0]] -= 10
    grid[bfslist[1]] += 10"""
    bot2index = bfslist[1]
    return grid,bot2index

def move_bot_3(grid,bot3index):
    if grid[bot3index]%10==2 or grid[bot3index]%10==5:
        return grid,bot3index
    #change all open cells with fire neighbors to 3
    altgrid = grid.copy()
    for i in range(len(altgrid)):
        for j in range(len(altgrid)):
            if grid[(i,j)]%10==0:
                adjlist = get_adj_indices.get_adj_indices(i,j,len(altgrid))
                for item in adjlist:
                    if grid[item]%10==2:
                        altgrid[(i,j)]=3
                        break
    #do bfs on alt grid, if that doesn't work, do bfs on normal grid                
    bfslist = bfs(altgrid,bot3index)
    file = open('results.txt','a')
    file.write(str(altgrid))
    file.close()
    if not bfslist == []:
        """grid[bot3index] -= 100
        grid[bfslist[1]] += 100"""
        bot3index = bfslist[1]
        return grid,bot3index
    else:
        bfslist = bfs(grid,bot3index)
        if not bfslist==[]:
            """grid[bot3index] -= 100
            grid[bfslist[1]] += 100"""
            return grid,bfslist[1]
        else:
            return grid,bot3index
        
def move_bot_4(grid,bot4index,bot4route,safeguard):
    if grid[bot4index]%10==2 or grid[bot4index]%10==5:
        return grid,bot4index,safeguard
    if bot4route==[]:
        return grid,bot4index,safeguard 
    #safeguard==True means bot 4 is in bot 3 mode  
    if safeguard:
        grid,bot4index = bot_4_does_bot_3(grid,bot4index)
        return grid,bot4index,safeguard
    else:
        #At every step, checks to see if bot 3 mode needed
        safeguard = bot_4_check_route(grid,bot4index,bot4route)
        if not safeguard:
            index = bot4route.index(bot4index)
            grid[bot4index]-=10
            grid[bot4route[index+1]]+=10
            return grid,bot4route[index+1],safeguard
        else:
            grid,bot4index = bot_4_does_bot_3(grid,bot4index)
            return grid,bot4index,safeguard
        
def get_bot_4_weights(grid,q):
        #this is explained in detail in my write-up
        weightarrlist = []
        for i in range(50):
            gridcopy = grid.copy()
            firesequence = [gridcopy]
            for k in range(70):
                gridcopy,firelist = fire_step.fire_step(gridcopy)
                firesequence.append(gridcopy)
            for i in range(len(firesequence)):
                if len(weightarrlist)>i:
                    weightarrlist[i][firesequence[i]%10==2]+=1
                else:
                    weightarrlist.append(np.ones((len(grid),len(grid))))
                    weightarrlist[i][firesequence[i]%10==2]+=1
        return weightarrlist

def bot_4_UFCS(grid,start,weights):
        #turn 3d UFCS into 2d by making weights list of arrays into a hashmap/graph that UFCS algorithm can traverse
        #this entire function is also explained in detail in my write-up, so I will add no more comments
        newweights = {(0,start,0):None}
        seen = []
        currlevel = [(0,start,0)]
        j=0
        while j+1<len(weights) and not currlevel==[]:
            nextlevel = []
            for item in currlevel:
                newweights[item] = None
                adjsqrs = get_adj_indices.get_adj_indices(item[1][0],item[1][1],len(grid))
                for sq in adjsqrs:
                    if (grid[sq]%10==0 or grid[sq]%10==5) and not sq in seen:
                        new = (weights[item[2]+1][sq],sq,item[2]+1)
                        if not new in nextlevel:
                            nextlevel.append(new)
                        if newweights[item]==None:
                            newweights[item]=[new]
                        else:
                            newweights[item].append(new)
                seen.append(item[1])
            currlevel = nextlevel
            j+=1
        #now for the UFCS
        #print(len(weights))
        #print(newweights)
        distances = {}
        prev = {}
        fringe = []
        distances[(0,start,0)]=0
        prev[start]= None
        heapq.heappush(fringe,(0,start,0))
        while not fringe == []:
            curr = heapq.heappop(fringe)
            if grid[curr[1]]%10==5:
                return make_bfs_path_list(prev,curr[1])
            #adjlist = get_adj_indices(curr[1][0],curr[1][1],len(grid))
            try:
                if not newweights[curr]==None:
                    for child in newweights[curr]:
                        if grid[child[1]]%10==0 or grid[child[1]]%10==5:
                            temp_dist = distances[curr]+child[0]
                            if (not child in distances) or temp_dist<distances[child]:
                                distances[child]=temp_dist
                                prev[child[1]]=curr[1]
                                heapq.heappush(fringe,child)
            except:
                print('Error in Bot_4_UFCS')
        return []

def bot_4_check_route(grid,start,route):
        #For every index along the route, check adjacent tiles to see if they're on fire. If so, return True, else return False
        index = route.index(start)
        for i in range(index,len(route)):
            adjlist = get_adj_indices.get_adj_indices(route[i][0],route[i][1],len(grid))
            for item in adjlist:
                if grid[item]%10==2:
                    return True
        return False

def bot_4_does_bot_3(grid,index):
    #Literally just the bot 3 code with very few adjustments, I could've done it in one function but whatever.
    altgrid = grid.copy()
    for i in range(len(altgrid)):
        for j in range(len(altgrid)):
            if grid[(i,j)]==0:
                adjlist = get_adj_indices.get_adj_indices(i,j,len(altgrid))
                checkfireneighbor = False
                for item in adjlist:
                    if grid[item]==2:
                        checkfireneighbor = True
                        break
                if checkfireneighbor==True:
                    altgrid[(i,j)]=3
    bfslist = bfs(altgrid,index)
    if not bfslist == []:
        grid[index] -= 10
        grid[bfslist[1]] += 10
        return grid,bfslist[1]
    else:
        bfslist = bfs(grid,index)
        if not bfslist==[]:
            grid[index] -= 10
            grid[bfslist[1]] += 10
            return grid,bfslist[1]
        else:
            return grid,index
