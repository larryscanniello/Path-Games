import numpy as np
import math
from . import get_adj_indices

def get_initial_dist(grid,stoch,mouseindex):
    if True:
        openlist = []
        for i in range(len(grid)):
            for j in range(len(grid)):
                if grid[(i,j)]==0 or grid[(i,j)]==2:
                    openlist.append((i,j))
        initial_dist = np.zeros((len(grid),len(grid)))
        for item in openlist:
            initial_dist[item] = 1/len(openlist)
        return initial_dist
    else:
        initial_dist = np.zeros((len(grid),len(grid)))
        initial_dist[mouseindex] += 1
        return initial_dist


def filtering(filterstate,stoch,filterevidence,t,grid,a):
    #First we find P(X_t|e_{t-1},...,e_1), the prediction of the new state from old evidence
    if not stoch:
        pred = filterstate
    else:
        pred = np.zeros((len(grid),len(grid)))
        for i in range(len(grid)):
            for j in range(len(grid)):
                if grid[(i,j)]%10==0 or grid[(i,j)]%10==2 and not (i,j)==filterevidence[t][2]:
                    adjlist = get_adj_indices.get_adj_indices(i,j,len(grid))
                    openadjlist = []
                    for index in adjlist:
                        if grid[index]%10==0 or grid[index]%10==2 and not (i,j)==filterevidence[t][2]:
                            openadjlist.append(index)
                    temppred = np.zeros((len(grid),len(grid)))
                    temppred[(i,j)]+=1/(len(openadjlist)+1)
                    if len(openadjlist)>0:
                        for index in openadjlist:
                            temppred[index]+=1/(len(openadjlist)+1)
                    pred += temppred*filterstate[(i,j)]
    #Now we need a second array: P(e_t|X_t), the probability of getting our evidence conditioned on the state
    #which will be different for all 3 evidence types
    probevidence = np.zeros((len(grid),len(grid)))
    #Next line is if new evidence is stepping into an empty square, thereby that empty square does not contain the mouse:
    open_mask = np.logical_or(grid % 10 == 0, grid % 10 == 2)
    exclude = filterevidence[t][2]
    open_mask[exclude[0], exclude[1]] = False
    if filterevidence[t][1]==2:
        probevidence[open_mask] = 1
    #If new evidence is a positive sense:
    if filterevidence[t][1]==1:
        rows, cols = np.indices(grid.shape)
        dists = np.abs(rows - exclude[0]) + np.abs(cols - exclude[1])
        probevidence[open_mask] = np.exp(-a * (dists[open_mask] - 1))
    #If new evidence is a negative sense:
    if filterevidence[t][1]==0:
        rows, cols = np.indices(grid.shape)
        dists = np.abs(rows - exclude[0]) + np.abs(cols - exclude[1])
        probevidence[open_mask] = 1-np.exp(-a * (dists[open_mask] - 1))
    stateunnormalized = pred * probevidence
    #Now we normalize probabilities
    newstate = stateunnormalized*(1/np.sum(stateunnormalized))
    return newstate

def make_bfs_path_list(prev,currentstate,bot):
    #An extension of the bfs function, just makes the actual list of indices/tuples to return
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


def predicting(initialstate,stoch,evidence,grid):
    if not stoch:
        return initialstate
    predictedstate = np.zeros((len(grid),len(grid)))
    for i in range(len(grid)):
        for j in range(len(grid)):
            if (grid[(i,j)]%10==0 or grid[(i,j)]%10==2) and not (i,j)==evidence[len(evidence)-1][2]:
                adjlist = get_adj_indices.get_adj_indices(i,j,len(grid))
                openadjlist = []
                for index in adjlist:
                    if grid[index]%10==0 or grid[index]%10==2 and not index==evidence[len(evidence)-1][2]:
                        openadjlist.append(index)
                temppred = np.zeros((len(grid),len(grid)))
                temppred[(i,j)]+=1/(len(openadjlist)+1)
                if len(openadjlist)>0:
                    for index in openadjlist:
                        temppred[index]+=1/(len(openadjlist)+1)
                predictedstate += temppred*initialstate[(i,j)]
    return predictedstate


def calc_manhattan_dist(tup1,tup2):
    return int(math.fabs(tup1[0]-tup2[0])+math.fabs(tup1[1]-tup2[1]))

def calculate_KL_divergence(state,stoch,grid,a):
    divergencearr = np.zeros((len(state),len(state)))
    for i in range(len(state)):
        for j in range(len(state)):
            if state[(i,j)]>1e-5:
                newstate = filtering(state,stoch,[(0,0,(i,j))],0,grid,a)
                eps = 1e-10
                try:
                    divergence = np.sum(state[newstate>0]*np.log(state[newstate>0]/newstate[newstate>0]))
                    divergencearr[i][j] = divergence
                except:
                    divergencearr[i][j]=0
    return divergencearr

def calculate_expected_entropy_reduction(state,stoch,grid,a,botindex):
    H = calc_entropy(state)

    open_mask = np.logical_or(grid % 10 == 0, grid % 10 == 2)
    rows, cols = np.indices(grid.shape)

    entropy_array = np.zeros((len(state),len(state)))
    for i in range(len(state)):
        for j in range(len(state)):
            dists = np.abs(rows - i) + np.abs(cols - j)
            probevidencebeep,probevidencenobeep = np.zeros((len(state),len(state))),np.zeros((len(state),len(state)))
            probevidencebeep[open_mask] = np.exp(-a * (dists[open_mask] - 1))
            Pbeep = np.sum(state*probevidencebeep)
            probevidencenobeep[open_mask] = 1-np.exp(-a * (dists[open_mask] - 1))
            Pnobeep = np.sum(state*probevidencenobeep)
            """Hbeepx = filtering(state,stoch,[(0,1,(i,j))],0,grid,a)
            Hnobeepx = filtering(state,stoch,[(0,0,(i,j))],0,grid,a)"""
            #entropy_array[i][j] = H-Pbeep*calc_entropy(probevidencebeep*state/Pbeep)-Pnobeep*calc_entropy(probevidencenobeep*state/Pnobeep)
            entropy_array[i][j] = H-Pnobeep*calc_entropy(probevidencenobeep*state/Pnobeep)

    return entropy_array




def calc_entropy(state):
    state = state.flatten()
    state = state[state > 0]
    stateentropy = -np.sum(state*np.log(state))
    return stateentropy
