import json
import numpy as np


def main():
    grid = np.array([[0,1,0,0,0],
                [0,1,0,0,1],
                [0,0,0,1,0],
                [0,0,0,1,0],
                [0,0,0,0,0]])
    a = 1/20
    probs = np.array([[a,0,a,a,a],
                [a,0,a,a,0],
                [a,a,a,0,a],
                [a,a,a,0,a],
                [a,a,a,a,a]])

    print(calculate_expected_entropy_reduction(probs,False,grid,.1155,(0,4)))


def calculate_expected_entropy_reduction(state,stoch,grid,a,botindex):
    H = calc_entropy(state)

    #calculate P(beep) and P(no beep)
    open_mask = np.logical_or(grid % 10 == 0, grid % 10 == 2)
    rows, cols = np.indices(grid.shape)
    dists = np.abs(rows - botindex[0]) + np.abs(cols - botindex[1])
    probevidencebeep,probevidencenobeep = np.zeros((25,25)),np.zeros((25,25))
    probevidencebeep[open_mask] = np.exp(-a * (dists[open_mask] - 1))
    Pbeep = np.sum(state*probevidencebeep)
    probevidencenobeep[open_mask] = 1-np.exp(-a * (dists[open_mask] - 1))
    Pnobeep = np.sum(state*probevidencenobeep)

    entropy_array = np.zeros((len(state),len(state)))
    for i in range(len(state)):
        for j in range(len(state)):
            Hbeepx = filtering(state,stoch,[(0,1,(i,j))],0,grid,a)
            Hnobeepx = filtering(state,stoch,[(0,0,(i,j))],0,grid,a)
            entropy_array[i][j] = H-Pbeep*calc_entropy(Hbeepx)-Pnobeep*calc_entropy(Hnobeepx)
    return entropy_array

def calc_entropy(state):
    state = state.flatten()
    state = state[state > 1e-10]
    stateentropy = -np.sum(state*np.log(state))
    return stateentropy

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

def get_adj_indices(row,col,D):
    adjindlist = []
    if row+1<D:
        adjindlist.append((row+1,col))
    if row>0:
        adjindlist.append((row-1,col))
    if col+1<D:
        adjindlist.append((row,col+1))
    if col>0:
        adjindlist.append((row,col-1))
    return adjindlist

if __name__ == "__main__":
    main()