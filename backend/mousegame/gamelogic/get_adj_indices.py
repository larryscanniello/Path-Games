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

