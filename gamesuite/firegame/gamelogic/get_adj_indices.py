
def get_adj_indices(row,col,D):
        #Citation: I got the idea of this from https://stackoverflow.com/questions/51657128/how-to-access-the-adjacent-cells-of-each-elements-of-matrix-in-python
        #I use this function very frequently
        #Just returns indices and accounts for borders
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