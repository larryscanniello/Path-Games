import math
import random
from .get_adj_indices import get_adj_indices
import numpy as np

def create_grid(D):
        #create array
        newgrid = np.ones((D,D),dtype=int)
        #select random block to open
        row = math.floor((random.random())*D)
        col = math.floor((random.random())*D)
        newgrid[row][col] = 0
        oneneighborlist = get_adj_indices(row,col,D)
        #iteratively open new blocks
        while not oneneighborlist==[]:
            #Randomly select from one-neighbor list to open
            listsize = len(oneneighborlist)
            listchoice = math.floor(listsize*random.random())
            newgrid[oneneighborlist[listchoice]] = 0
            #Iterate through grid to find all cells with exactly one open neighbor
            oneneighborlist = []
            for i in range(D):
                for j in range(D):
                    if newgrid[i][j]==1:
                        adjlist = get_adj_indices(i,j,D)
                        openneighborcount = 0
                        for item in adjlist:
                            if newgrid[item]==0:
                                openneighborcount += 1
                        if openneighborcount == 1:
                            oneneighborlist.append((i,j))
        #Get list of open cells with one open neighbor
        deadends = []
        for i in range(D):
            for j in range(D):
                if newgrid[i][j]==0:
                    adjlist = get_adj_indices(i,j,D)
                    openneighborcount = 0
                    for item in adjlist:
                        if newgrid[item]==0:
                            openneighborcount += 1
                    if openneighborcount == 1:
                        deadends.append((i,j))
        #Get list of closed neighbors of deadend cells
        closednbrsofdeadends = []
        for item in deadends:
            adjlist = get_adj_indices(item[0],item[1],D)
            for item2 in adjlist:
                if newgrid[item2] == 1:
                    closednbrsofdeadends.append(item2)
        #Open approximately half of these closed neighbors of deadend cells
        openeddeadends = []
        for item in closednbrsofdeadends:
            if random.random() > .55:
                newgrid[item] = 0
                openeddeadends.append(item)
        #print(newgrid)
        #print('Before: ',len(closednbrsofdeadends),' After: ', len(closednbrsofdeadends)-len(openeddeadends))
        return newgrid

def place_initial_positions(grid):
        D=len(grid)
        #Goal: Place bots, extinguisher, and initial fire cell
        #First step: Create list of all open cells
        opencelllist=[]
        for i in range(D):
            for j in range(D):
                if grid[i][j]==0:
                    opencelllist.append((i,j))
        #Randomly pick an open cell to place bots
        botindex = opencelllist[math.floor(random.random()*len(opencelllist))]
        while not ((botindex[0]<9 or botindex[0]>17) and (botindex[1]<9 or botindex[1]>17)):
            botindex = opencelllist[math.floor(random.random()*len(opencelllist))]
        grid[botindex] = 10
        opencelllist.remove(botindex)
        #Randomly pick an open cell to place extinguisher
        extindex = opencelllist[math.floor(random.random()*len(opencelllist))]
        if(manhattandistance(extindex,botindex)<25):
            extindex = opencelllist[math.floor(random.random()*len(opencelllist))]
        grid[extindex] = 5
        opencelllist.remove(extindex)
        #Randomly pick an open cell to start fire
        fireindex = opencelllist[math.floor(random.random()*len(opencelllist))]
        grid[fireindex] = 2
        opencelllist.remove(fireindex)
        return grid,botindex,extindex,fireindex

def manhattandistance(coords1,coords2):
    return abs(coords1[0]-coords2[0])+abs(coords1[1]-coords2[1])