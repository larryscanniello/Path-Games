import random
from .get_adj_indices import get_adj_indices
import numpy as np

def fire_step(grid):
        q = .4
        newgrid = np.array(grid)
        firelist = []
        for i in range(len(grid)):
            for j in range(len(grid)):
                if newgrid[(i,j)]%10==0:
                    adjlist = get_adj_indices(i,j,len(grid))
                    neighborfirecount = 0
                    for item in adjlist:
                        if newgrid[item]%10 == 2:
                            neighborfirecount+=1
                    if random.random()<(1-(1-q)**neighborfirecount) and not newgrid[(i,j)]%10==2:
                        firelist.append((i,j))
        for index in firelist:
             newgrid[index]+=2
        return newgrid, firelist