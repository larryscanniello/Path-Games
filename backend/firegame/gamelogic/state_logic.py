import numpy as np
import math
from .get_adj_indices import get_adj_indices

def get_initial_dist(grid):
    openlist = []
    initial_dist = np.zeros((len(grid),len(grid)))
    indices= np.where(grid%10==2)
    for i in range(len(indices[0])):
        initial_dist[indices[0][i]][indices[1][i]]=1
    return initial_dist

def predicting(grid,t):
    distribution = get_initial_dist(grid)
    weights = [distribution.copy()]
    for i in range(t,70):
        newdistribution = np.zeros((len(grid),len(grid)))
        for j in range(len(grid)):
            for k in range(len(grid)):
                neighbors = get_adj_indices(j,k,len(grid))
                expectedfireneighbors = 0
                if grid[(j,k)]%10==0:
                    for p in range(len(neighbors)):
                        expectedfireneighbors += distribution[neighbors[p]]
                probignite = 1-(1-.4)**expectedfireneighbors
                newdistribution[(j,k)] = distribution[(j,k)]+(1-distribution[(j,k)])*probignite
        weights.append(newdistribution.copy())
        distribution = newdistribution.copy()
    return weights

def get_bot5_path(weights):
    return