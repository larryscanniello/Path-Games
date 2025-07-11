import math
import random
from . import get_adj_indices
import numpy as np

def create_grid(D):
    #create array
    newgrid = np.ones((D,D))
    #select random block to open
    row = math.floor((random.random())*D)
    col = math.floor((random.random())*D)
    newgrid[row][col] = 0
    oneneighborlist = get_adj_indices.get_adj_indices(row,col,D)
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
                    adjlist = get_adj_indices.get_adj_indices(i,j,D)
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
                adjlist = get_adj_indices.get_adj_indices(i,j,D)
                openneighborcount = 0
                for item in adjlist:
                    if newgrid[item]==0:
                        openneighborcount += 1
                if openneighborcount == 1:
                    deadends.append((i,j))
    #Get list of closed neighbors of deadend cells
    closednbrsofdeadends = []
    for item in deadends:
        adjlist = get_adj_indices.get_adj_indices(item[0],item[1],D)
        for item2 in adjlist:
            if newgrid[item2] == 1:
                closednbrsofdeadends.append(item2)
    #Open approximately half of these closed neighbors of deadend cells
    #Well, a bit more than half, it seemed like this gave greater variance in success rates and thus made things a little bit more interesting
    #i.e. more corridors to choose from, more significant choices for the bots to make
    openeddeadends = []
    for item in closednbrsofdeadends:
        if random.random() < .5:
            newgrid[item] = 0
            openeddeadends.append(item)
    return newgrid

def place_initial_positions(grid):
    opencelllist=[]
    for i in range(len(grid)):
        for j in range(len(grid)):
            if grid[(i,j)]==0:
                opencelllist.append((i,j))
    botindex = opencelllist[math.floor(random.random()*len(opencelllist))]
    opencelllist.remove(botindex)
    mouseindex = opencelllist[math.floor(random.random()*len(opencelllist))]
    return grid,botindex,mouseindex