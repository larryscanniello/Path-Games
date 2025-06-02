import random
from .get_adj_indices import get_adj_indices
import numpy as np
from scipy.signal import convolve2d

"""
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
        return newgrid, firelist"""


def fire_step(grid):
    q = 0.4
    grid = np.array(grid)
    fire_mask = (grid % 10 == 2)
    flammable_mask = (grid % 10 == 0)
    kernel = np.array([[0, 1, 0],
                       [1, 0, 1],
                       [0, 1, 0]])
    fire_neighbor_count = convolve2d(fire_mask, kernel, mode='same', boundary='fill', fillvalue=0)
    prob = 1 - (1 - q) ** fire_neighbor_count
    rand_vals = np.random.rand(*grid.shape)
    ignition_mask = (rand_vals < prob) & flammable_mask
    grid[ignition_mask] += 2
    firelist = [ (int(i), int(j)) for i, j in zip(*np.where(ignition_mask)) ]
    return grid, firelist