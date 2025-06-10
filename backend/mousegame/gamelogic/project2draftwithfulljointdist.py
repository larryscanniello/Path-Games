import numpy as np
import random
import math
import heapq
import pandas as pd
import itertools
from collections import deque
from collections import Counter
from statistics import median

#Note: Please install numpy and pandas before running!
def main():
    menunum = -1
    np.set_printoptions(suppress=True,threshold=np.inf)
    while not menunum == 0:
        menunum = int(input("""Select mode:
1) Random layout, random a
2) Random layout, fixed a
3) Fixed layout, fixed a                          
4) Delete old shipresults file                            
0) Exit                                                        
"""))
        if menunum == 1 or menunum == 2 or menunum==3:
            sim_interface(menunum)
        if menunum == 4:
            file = open('shipresults.txt','w')
            file.write(' ')
            file.close()

def sim_interface(menunum):
    iterations = int(input('Enter number of times to run test '))
    printyn = int(input('Enter 1 to write all intermediate grids to shipresults.txt, 0 otherwise '))
    stoch = int(input('Enter 1 to run tests on stationary mice, 2 on stochastic mice '))
    if stoch == 2:
        stoch = True
    else:
        stoch = False
    nummice = int(input('Enter the number of mice (1 or 2) '))
    D = int(input('To make DxD grid, enter D '))
    if menunum == 1 and nummice==1:
        mainresultsarrarr = []
        mainresultsarr = []
        for i in range(iterations):
            newgrid = create_grid(D)
            num4coinflip = math.floor(random.random()*496)+4
            a = -math.log(0.5)/(num4coinflip-1)
            runsimresults = run_sim_1mouse(newgrid.copy(),a,nummice,stoch,printyn)
            mainresultsarr.append(runsimresults)
            if i%10 == 0 and i>0:
                print(i,' simulations done')
        mainresultsarrarr.append(mainresultsarr)
    if menunum == 1 and nummice==2:
        mainresultsarrarr = []
        mainresultsarr = []
        for i in range(iterations):
            newgrid = create_grid(D)
            num4coinflip = math.floor(random.random()*96)+4
            a = -math.log(0.5)/(num4coinflip-1)
            runsimresults = run_sim_2mice(newgrid.copy(),a,nummice,stoch,printyn)
            mainresultsarr.append(runsimresults)
            if i%10 == 0 and i>0:
                print(i,' simulations done')
        mainresultsarrarr.append(mainresultsarr)
    if menunum == 2 and nummice ==1:
        a = float(input('Enter a>0, lower value = higher sensitivity of the mouse detector, recommended range [0.06,0.23] '))
        mainresultsarrarr = []
        mainresultsarr = []
        for i in range(1,iterations+1):
            newgrid = create_grid(D)
            runsimresults = run_sim_1mouse(newgrid.copy(),a,nummice,stoch,printyn)
            mainresultsarr.append(runsimresults)
            if i%10 == 0 and i>0:
                print(i,' simulations done')
        mainresultsarrarr.append(mainresultsarr)
    if menunum == 2 and nummice == 2:
        a = float(input('Enter a>0, lower value = higher sensitivity of the mouse detector, recommended range [0.1,0.23] '))
        mainresultsarr = []
        for i in range(1,iterations+1):
            newgrid = create_grid(D)
            runsimresults = run_sim_2mice(newgrid.copy(),a,nummice,stoch,printyn)
            mainresultsarr.append(runsimresults)
        mainresultsarrarr = [mainresultsarr]
    if menunum == 3 and nummice == 1:
        a = float(input('Enter a>0, lower value = higher sensitivity of the mouse detector, recommended range [0.1,0.23] '))
        newgrid = create_grid(D)
        for i in range(iterations):
            steps = run_sim_1mouse(newgrid.copy(),a,nummice,stoch,printyn)
    for arr in mainresultsarrarr:
        df = pd.DataFrame(arr,index=range(1,len(arr)+1),columns=['Bot 1 mouse 1','Bot 1 mouse 2','Bot 2 mouse 1','Bot 2 mouse 2','Bot 3 mouse 1','Bot 3 mouse 2','Alpha'])
        df.loc['Mean']=df.mean()
        df.loc['Median']=df.median()
        df.loc['Max']=df.max()
        df.loc['Std']=df.std()
        """x3bar,x2bar,x1bar = df.loc['Mean']['Bot 3'],df.loc['Mean']['Bot 2'],df.loc['Mean']['Bot 1']
        s3,s2,s1 = df.loc['Std']['Bot 3'],df.loc['Std']['Bot 2'],df.loc['Std']['Bot 1']
        z1 = (x1bar-x3bar)/math.sqrt(((s3**2)/len(arr))+((s1**2)/len(arr)))
        z2 = (x2bar-x3bar)/math.sqrt(((s3**2)/len(arr))+((s2**2)/len(arr)))
        newrow = [z1,z2,None,None]
        df.loc[-1] = newrow  # adding a row
        df=df.rename(index={-1:'Z-score'})"""
        #df.index = df.index + 1  # shifting index
        #df = df.sort_index()  # sorting by index
        df.to_csv('data.csv',mode='a')
        print(df)
        """avgs = ['Avg',None,None,None]
        medianlist = ['Median',None,None,None]
        bot1total,bot2total,bot3total = 0,0,0
        bot1list4median,bot2list4median,bot3list4median = [],[],[]
        for i in range(1,len(mainresultsarr)):ßßßß
            bot1total+= mainresultsarr[i][1]
            bot2total+= mainresultsarr[i][2]
            try:
                bot3total+= mainresultsarr[i][3]
            except:
                print('Error: ',mainresultsarr)
            bot1list4median.append(mainresultsarr[i][1])
            bot2list4median.append(mainresultsarr[i][2])
            bot3list4median.append(mainresultsarr[i][3])
        avgs[1] = bot1total/(len(mainresultsarr)-1)
        avgs[2] = bot2total/(len(mainresultsarr)-1)
        avgs[3] = bot3total/(len(mainresultsarr)-1)
        mainresultsarr.append(avgs)
        medianlist[1] = median(bot1list4median)
        medianlist[2] = median(bot2list4median)
        medianlist[3] = median(bot3list4median)
        bot1sqdiff,bot2sqdiff,bot3sqdiff=0,0,0
        for i in range(1,len(mainresultsarr)):
            bot1sqdiff = mainresultsarr[i]
        mainresultsarr.append(medianlist)
        mainresultsarr = np.array(mainresultsarr)
        print(np.array2string(mainresultsarr))"""
    return

def run_sim_1mouse(grid,a,nummice,stoch,printyn):
    grid,botindex,mouseindex,mouseindex2 = place_initial_positions(grid,nummice)
    if printyn:
        file = open('shipresults.txt','a')
        file.write('t= 0 \n')
        file.write(np.array2string(grid,max_line_width=1000))
        file.write('\n')
        file.close()
    bot1index,bot2index,bot3index = botindex,botindex,botindex
    done = False
    #print(np.array2string(grid,max_line_width=1000))
    estimatedstatedists = get_initial_dist(grid)
    bot1eststates,bot2eststates,bot3eststates = estimatedstatedists,estimatedstatedists,estimatedstatedists
    bot1evidence,bot2evidence,bot3evidence = [None],[None],[None]
    #Evidence format: (t,type,tuple of index on ship) 
    #where type = 0 if negative sense, 1 if positive sense, 2 if walked into square"""
    bot1plan,bot2plan,bot3plan = [],[],[]
    b1,b2,b3 = False,False,False
    t = 1
    runsimresults = [None,None,None,None,None,None,a]
    while b1 == False or b2 == False or b3 == False:
        if not b1:
            grid,bot1index,bot1evidence,bot1plan,bot1eststates = bot_1(grid,bot1index,t,bot1plan,bot1evidence.copy(),mouseindex,a,bot1eststates.copy(),stoch)
        if not b2:
            grid,bot2index,bot2evidence,bot2plan,bot2eststates = bot_2(grid,bot2index,t,bot2plan,bot2evidence.copy(),mouseindex,a,bot2eststates.copy(),stoch)
        if not b3:
            grid,bot3index,bot3evidence,bot3plan,bot3eststates = bot_3(grid,bot3index,t,bot3plan,bot3evidence.copy(),mouseindex,a,bot3eststates.copy(),stoch)
        if stoch:
            grid,mouseindex = move_mouse(grid,mouseindex)
        if bot1index == mouseindex and b1==False:
            b1 = True
            grid[(bot1index)]-= 10
            runsimresults[0] = t
        if bot2index == mouseindex and b2==False:
            b2 = True
            grid[(bot2index)]-=100
            runsimresults[2] = t
        if bot3index == mouseindex and b3==False:
            b3 = True
            grid[(bot3index)]-=1000
            runsimresults[4] = t
        if printyn:
            file = open('shipresults.txt','a')
            file.write('t= ')
            file.write(str(t))
            if b1==False:
                file.write(' Bot 1: ')
                file.write(str(bot1evidence[t]))
            if b2==False:
                file.write(' Bot 2: ')
                file.write(str(bot2evidence[t]))
            if b3==False:
                file.write(' Bot 3: ')
                file.write(str(bot3evidence[t]))
            file.write('\n')
            file.write(np.array2string(grid, max_line_width=1000))
            file.write('\n')
            if b1==False:
                """file.write('\n Bot 1 evidence: ')
                file.write(str(bot1evidence))"""
                file.write('\n Bot 1 estimated state: \n')
                file.write(np.array2string(bot1eststates[t],max_line_width=1000))
                file.write('\n')
            if b2==False:
                """file.write('Bot 2 evidence: ')
                file.write(str(bot2evidence))"""
                file.write('\n Bot 2 estimated state: \n')
                file.write(np.array2string(bot2eststates[t],max_line_width=1000))
                file.write('\n')
            if b3==False:
                """file.write('Bot 3 evidence: ')
                file.write(str(bot3evidence))"""
                file.write('\n Bot 3 plan: ')
                file.write(str(bot3plan))
                file.write('\n Bot 3 estimated state: \n')
                file.write(np.array2string(bot3eststates[t],max_line_width=1000))
                file.write('\n')
            file.close()
        if t>5000:
            file = open('shipresults.txt','a')
            file.write(np.array2string(grid,max_line_width=1000))
            file.write('\n')
            if b1 == False:
                file.write(np.array2string(bot1eststates[t],max_line_width=1000))
                file.write('\n')
                runsimresults[0] = 5000
            if b2 == False:
                file.write(np.array2string(bot2eststates[t],max_line_width=1000))
                file.write('\n')
                runsimresults[1] = 5000
            if b3 == False:
                file.write(np.array2string(bot3eststates[t],max_line_width=1000))
                file.write('\n')
                runsimresults[2] = 5000
            print('t>5000,  bot 1: ',b1,' bot 2: ', b2,' bot 3: ',b3)
            return runsimresults
        t += 1
    return runsimresults

def run_sim_2mice(grid,a,nummice,stoch,printyn):
    grid,botindex,mouseindex1,mouseindex2 = place_initial_positions(grid,nummice)
    if printyn:
        file = open('shipresults.txt','a')
        file.write('t= 0 \n')
        file.write(np.array2string(grid,max_line_width=1000))
        file.write('\n')
        file.close()
    bot1index,bot2index,bot3index = botindex,botindex,botindex
    done = False
    currentstate,openpairslist = get_initial_dist_2mice(grid)
    bot1state,bot2state,bot3state = currentstate.copy(),currentstate.copy(),currentstate.copy()
    bot1evidence,bot2evidence,bot3evidence = [1],[2],[3]
    #Evidence format: (t,type,tuple of index on ship) 
    #where type = 0 if negative sense, 1 if positive sense, 2 if walked into square"""
    bot1plan,bot2plan,bot3plan = [],[],[]
    bot1mode,bot2mode,bot3mode = 2,2,2
    b1secondmouse,b2secondmouse,b3secondmouse = 0,0,0
    t = 1
    runsimresults = [None,None,None,None,None,None,a]
    while bot1mode>0 or bot2mode>0 or bot3mode>0:
        try:
            if bot1mode==2:
                grid,bot1index,bot1evidence,bot1plan,bot1state,bot1margstate = bot_1_2mice(grid,bot1index,t,bot1plan,bot1evidence.copy(),mouseindex1,mouseindex2,a,bot1state.copy(),stoch,openpairslist)
            if bot2mode==2:
                grid,bot2index,bot2evidence,bot2plan,bot2state = bot_2_2mice(grid,bot2index,t,bot2plan,bot2evidence.copy(),mouseindex1,mouseindex2,a,bot2state.copy(),stoch,openpairslist)
            if bot3mode==2:
                grid,bot3index,bot3evidence,bot3plan,bot3state = bot_3_2mice(grid,bot3index,t,bot3plan,bot3evidence.copy(),mouseindex1,mouseindex2,a,bot3state.copy(),stoch,openpairslist)
            
            if bot1mode==1:
                if b1secondmouse == 1:
                    grid,bot1index,bot1evidence,bot1plan,bot1state1mouse = bot_1(grid,bot1index,t,bot1plan,bot1evidence.copy(),mouseindex1,a,bot1state1mouse.copy(),stoch)
                if b1secondmouse == 2:
                    grid,bot1index,bot1evidence,bot1plan,bot1state1mouse = bot_1(grid,bot1index,t,bot1plan,bot1evidence.copy(),mouseindex2,a,bot1state1mouse.copy(),stoch)
            if bot2mode==1:
                if b2secondmouse == 1:
                    grid,bot2index,bot2evidence,bot2plan,bot2state1mouse = bot_2(grid,bot2index,t,bot2plan,bot2evidence.copy(),mouseindex1,a,bot2state1mouse.copy(),stoch)
                if b2secondmouse == 2:
                    grid,bot2index,bot2evidence,bot2plan,bot2state1mouse = bot_2(grid,bot2index,t,bot2plan,bot2evidence.copy(),mouseindex2,a,bot2state1mouse.copy(),stoch)
            if bot3mode==1:
                if b3secondmouse == 1:
                    grid,bot3index,bot3evidence,bot3plan,bot3state1mouse = bot_3(grid,bot3index,t,bot3plan,bot3evidence.copy(),mouseindex1,a,bot3state1mouse.copy(),stoch)
                if b3secondmouse == 2:
                    grid,bot3index,bot3evidence,bot3plan,bot3state1mouse = bot_3(grid,bot3index,t,bot3plan,bot3evidence.copy(),mouseindex2,a,bot3state1mouse.copy(),stoch)
        except Exception as e:
            print('Fatal error')
            print(e)
            return [None,None,None,None,None,None,a]
        if stoch:
            grid,mouseindex1,mouseindex2 = move_mice(grid,mouseindex1,mouseindex2,bot1mode,bot2mode,bot3mode,b1secondmouse,b2secondmouse,b3secondmouse)
        
        if bot1mode==2 and (bot1index==mouseindex1 or bot1index==mouseindex2):
            bot1mode=1
            if bot1index==mouseindex1:
                bot1mode=1
                b1secondmouse=2
                grid[bot1index]+=10
                bot1state1mouse = calc_marginal_dists(bot1state.copy(),openpairslist,len(grid))
                #print(np.array2string(bot1state1mouse,max_line_width=1000))
            if bot1index==mouseindex2:
                bot1mode=1
                b1secondmouse=1
                grid[bot1index]+=10
                bot1state1mouse = calc_marginal_dists(bot1state.copy(),openpairslist,len(grid))
            runsimresults[0]=t
            bot1plan = []
        if bot2mode==2 and (bot2index==mouseindex1 or bot2index==mouseindex2):
            bot2mode=1
            if bot2index==mouseindex1:
                b2secondmouse=2
                grid[bot2index]+=100
                bot2state1mouse = calc_marginal_dists(bot2state.copy(),openpairslist,len(grid))
                #print(np.array2string(bot1state1mouse,max_line_width=1000))
            if bot2index==mouseindex2:
                bot2mode=1
                b2secondmouse=1
                grid[bot2index]+=100
                bot2state1mouse = calc_marginal_dists(bot2state.copy(),openpairslist,len(grid))
            runsimresults[2]=t
            bot1plan = []
        if bot3mode==2 and (bot3index==mouseindex1 or bot3index==mouseindex2):    
            bot3mode=1
            if bot3index==mouseindex1:
                b3secondmouse=2
                grid[bot3index]+=1000
                bot3state1mouse = calc_marginal_dists(bot3state.copy(),openpairslist,len(grid))
                #print(np.array2string(bot1state1mouse,max_line_width=1000))
            if bot3index==mouseindex2:
                bot3mode=1
                b3secondmouse=1
                grid[bot3index]+=1000
                bot3state1mouse = calc_marginal_dists(bot3state.copy(),openpairslist,len(grid))
            runsimresults[4]=t
            bot1plan = []
               
        if bot1mode==1 and ((b1secondmouse==1 and bot1index==mouseindex1) or (b1secondmouse==2 and bot1index==mouseindex2)):
            grid[bot1index]-=10
            if b1secondmouse==1:
                grid[mouseindex2]-=10
            else:
                grid[mouseindex1]-=10
            runsimresults[1] = t
            bot1mode = 0
        if bot2mode==1 and ((b2secondmouse==1 and bot2index==mouseindex1) or (b2secondmouse==2 and bot2index==mouseindex2)):
            grid[bot2index]-=100
            if b2secondmouse==1:
                grid[mouseindex2]-=100
            else:
                grid[mouseindex1]-=100
            runsimresults[3] = t
            bot2mode = 0
        if bot3mode==1 and ((b3secondmouse==1 and bot3index==mouseindex1) or (b3secondmouse==2 and bot3index==mouseindex2)):
            grid[bot3index]-=1000
            if b3secondmouse==1:
                grid[mouseindex2]-=1000
            else:
                grid[mouseindex1]-=1000
            runsimresults[5] = t
            bot3mode = 0
        if printyn:
            file = open('shipresults.txt','a')
            file.write('t= ')
            file.write(str(t))
            file.write('\n')
            file.write(np.array2string(grid, max_line_width=1000))
            file.write('\n')
        if printyn:
            file = open('shipresults.txt','a')
            if bot1mode>0:
                file.write('\n Bot 1 recent evidence: ')
                file.write(str(bot1evidence[t]))
                file.write('\n Bot 1 estimated state: \n')
                if bot1mode==2:
                    file.write(np.array2string(bot1margstate,max_line_width=1000))
                if bot1mode==1:
                    file.write(np.array2string(bot1state1mouse,max_line_width=1000))
                file.write('\n')
            if bot2mode>0:
                file.write('\n Bot 2 recent evidence: ')
                file.write(str(bot2evidence[t]))
                file.write('\n Bot 2 estimated state: \n')
                if bot1mode==2:
                    file.write(np.array2string(bot1margstate,max_line_width=1000))
                if bot1mode==1:
                    file.write(np.array2string(bot1state1mouse,max_line_width=1000))
                file.write('\n')
        if t>2500:
            if bot1mode>0:
                runsimresults[1] = 5000
                bot1mode=0
            if bot2mode>0:
                runsimresults[3] = 5000
                bot2mode=0
            if bot3mode>0:
                runsimresults[5] = 5000
                bot3mode=0
            """if b2==False:
                file.write(' Bot 2: ')
                file.write(str(bot2evidence[t]))
            if b3==False:
                file.write(' Bot 3: ')
                file.write(str(bot3evidence[t]))"""

            """if b2==False:
                file.write('Bot 2 evidence: ')
                file.write(str(bot2evidence))
                file.write('\n Bot 2 estimated state: \n')
                file.write(np.array2string(bot2eststates[t],max_line_width=1000))
                file.write('\n')
            if b3==False:
                file.write('Bot 3 evidence: ')
                file.write(str(bot3evidence))
                file.write('\n Bot 3 plan: ')
                file.write(str(bot3plan))
                file.write('\n Bot 3 estimated state: \n')
                file.write(np.array2string(bot3eststates[t],max_line_width=1000))
                file.write('\n')
            file.close()
        if t>5000:
            file = open('shipresults.txt','a')
            file.write(np.array2string(grid,max_line_width=1000))
            file.write('\n')
            if b1 == False:
                file.write(np.array2string(bot1eststates[t],max_line_width=1000))
                file.write('\n')
                runsimresults[0] = 5000
            if b2 == False:
                file.write(np.array2string(bot2eststates[t],max_line_width=1000))
                file.write('\n')
                runsimresults[1] = 5000
            if b3 == False:
                file.write(np.array2string(bot3eststates[t],max_line_width=1000))
                file.write('\n')
                runsimresults[2] = 5000
            print('t>5000,  bot 1: ',b1,' bot 2: ', b2,' bot 3: ',b3)
            return runsimresults"""
        t += 1
    file = open('backupresults','a')
    for i in range(len(runsimresults)):
        file.write(str(runsimresults[i]))
        file.write(',')
    file.write('\n')
    file.close()
    return runsimresults

def bot_1_2mice(grid,bot1index,t,plan,bot1evidence,mouseindex1,mouseindex2,a,bot1state,stoch,openpairslist):
    if plan == []:
        d1 = calc_manhattan_dist(bot1index,mouseindex1)
        d2 = calc_manhattan_dist(bot1index,mouseindex2)
        if random.random()<1-((1-math.exp(-a*(d1-1)))*(1-math.exp(-a*(d2-1)))):
            newevidence = (t,1,bot1index)
            bot1evidence.append(newevidence)
        else:
            newevidence = (t,0,bot1index)
            bot1evidence.append(newevidence)
        bot1state = filtering_2mice(bot1state.copy(),stoch,bot1evidence.copy(),t,grid.copy(),a,openpairslist)
        probmouseat = calc_marginal_dists(bot1state.copy(),openpairslist,len(grid))
        """file = open('shipresults.txt','a')
        file.write('probmouseat bot 1: \n')
        file.write(np.array2string(probmouseat,max_line_width=1000))
        file.write('\n')
        file.close()"""
        destinationindex = np.unravel_index(probmouseat.argmax(), probmouseat.shape)
        plan = bfs(grid,bot1index,destinationindex,1)
        #print('plan: ',plan)
        #print('destinationindex: ',destinationindex)
        #print('probmouseat: ',probmouseat)
        return grid,bot1index,bot1evidence,plan,bot1state,probmouseat
    
    else:
        grid[bot1index]-=10
        grid[plan[0]]+=10
        bot1index = plan[0]
        plan.pop(0)
        newevidence = (t,2,bot1index)
        bot1evidence.append(newevidence)
        bot1state = filtering_2mice(bot1state.copy(),stoch,bot1evidence.copy(),t,grid.copy(),a,openpairslist)
        probmouseat = calc_marginal_dists(bot1state.copy(),openpairslist,len(grid))
        """file = open('shipresults.txt','a')
        file.write('probmouseat bot 1: \n')
        file.write(np.array2string(probmouseat,max_line_width=1000))
        file.write('\n')
        file.close()"""
        return grid,bot1index,bot1evidence,plan,bot1state,probmouseat
def bot_2_2mice(grid,bot2index,t,plan,bot2evidence,mouseindex1,mouseindex2,a,bot2state,stoch,openpairslist):
    if plan == []:
        d1 = calc_manhattan_dist(bot2index,mouseindex1)
        d2 = calc_manhattan_dist(bot2index,mouseindex2)
        if random.random()<1-((1-math.exp(-a*(d1-1)))*(1-math.exp(-a*(d2-1)))):
            newevidence = (t,1,bot2index)
            bot2evidence.append(newevidence)
        else:
            newevidence = (t,0,bot2index)
            bot2evidence.append(newevidence)
        bot2state = filtering_2mice(bot2state.copy(),stoch,bot2evidence.copy(),t,grid,a,openpairslist)
        probmouseat = calc_marginal_dists(bot2state,openpairslist,len(grid))
        destinationindex = np.unravel_index(probmouseat.argmax(), probmouseat.shape)
        if bot2index == destinationindex:
            statecopy = probmouseat.copy()
            statecopy[bot2index]-=1
            destinationindex = np.unravel_index(statecopy.argmax(), statecopy.shape)
        plan = bfs(grid,bot2index,destinationindex,2)
        return grid,bot2index,bot2evidence,plan,bot2state
    if plan[0]==None:
        d1 = calc_manhattan_dist(bot2index,mouseindex1)
        d2 = calc_manhattan_dist(bot2index,mouseindex2)
        if random.random()<1-((1-math.exp(-a*(d1-1)))*(1-math.exp(-a*(d2-1)))):
            newevidence = (t,1,bot2index)
            bot2evidence.append(newevidence)
        else:
            newevidence = (t,0,bot2index)
            bot2evidence.append(newevidence)
        bot2state = filtering_2mice(bot2state.copy(),stoch,bot2evidence.copy(),t,grid,a,openpairslist)
        probmouseat = calc_marginal_dists(bot2state,openpairslist,len(grid))
        plan.pop(0)
        destinationindex = np.unravel_index(probmouseat.argmax(), bot2state.shape)
        if bot2index == destinationindex:
            statecopy = probmouseat.copy()
            statecopy[bot2index]-=1
            destinationindex = np.unravel_index(statecopy.argmax(), statecopy.shape)
        if not plan[len(plan)-1] == destinationindex:
            plan = bfs(grid,bot2index,destinationindex,2)
        return grid,bot2index,bot2evidence,plan,bot2state
    else:
        grid[bot2index]-=100
        grid[plan[0]]+=100
        bot2index = plan[0]
        plan.pop(0)
        newevidence = (t,2,bot2index)
        bot2evidence.append(newevidence)
        bot2state = filtering_2mice(bot2state.copy(),stoch,bot2evidence.copy(),t,grid,a,openpairslist)
        return grid,bot2index,bot2evidence,plan,bot2state
    return
def bot_3_2mice(grid,bot3index,t,plan,bot3evidence,mouseindex1,mouseindex2,a,bot3state,stoch,openpairslist):
    if plan == []:
        d1 = calc_manhattan_dist(bot3index,mouseindex1)
        d2 = calc_manhattan_dist(bot3index,mouseindex2)
        if random.random()<1-((1-math.exp(-a*(d1-1)))*(1-math.exp(-a*(d2-1)))):
            newevidence = (t,1,bot3index)
            bot3evidence.append(newevidence)
        else:
            newevidence = (t,0,bot3index)
            bot3evidence.append(newevidence)
        bot3state = filtering_2mice(bot3state.copy(),stoch,bot3evidence.copy(),t,grid.copy(),a,openpairslist)
        probmouseat = calc_marginal_dists(bot3state.copy(),openpairslist,len(grid))
        destinationindex = np.unravel_index(probmouseat.argmax(), probmouseat.shape)
        if bot3index == destinationindex:
            statecopy = probmouseat.copy()
            statecopy[bot3index]-=1
            destinationindex = np.unravel_index(statecopy.argmax(), bot3state.shape)
        if stoch:
            estd = calc_manhattan_dist(bot3index,destinationindex)
            if estd>3:
                plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,probmouseat.copy(),3,stoch,bot3evidence.copy(),t)
                return grid,bot3index,bot3evidence,plan,bot3state
            else:
                plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,probmouseat.copy(),1,stoch,bot3evidence.copy(),t)
                return grid,bot3index,bot3evidence,plan,bot3state
        else:
            plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,probmouseat.copy(),3,stoch,bot3evidence.copy(),t)
            return grid,bot3index,bot3evidence,plan,bot3state
    if plan[0]==None:
        d1 = calc_manhattan_dist(bot3index,mouseindex1)
        d2 = calc_manhattan_dist(bot3index,mouseindex2)
        if random.random()<1-((1-math.exp(-a*(d1-1)))*(1-math.exp(-a*(d2-1)))):
            newevidence = (t,1,bot3index)
            bot3evidence.append(newevidence)
        else:
            newevidence = (t,0,bot3index)
            bot3evidence.append(newevidence)
        bot3state= filtering_2mice(bot3state.copy(),stoch,bot3evidence.copy(),t,grid,a,openpairslist)
        plan.pop(0)
        return grid,bot3index,bot3evidence,plan,bot3state
    else:
        grid[bot3index]-=1000
        grid[plan[0]]+=1000
        bot3index = plan[0]
        plan.pop(0)
        newevidence = (t,2,bot3index)
        bot3evidence.append(newevidence)
        bot3state = filtering_2mice(bot3state.copy(),stoch,bot3evidence.copy(),t,grid,a,openpairslist)
        return grid,bot3index,bot3evidence,plan,bot3state

def move_mouse(grid,mouseindex):
    adjlist = get_adj_indices(mouseindex[0],mouseindex[1],len(grid))
    openadjlist = []
    for index in adjlist:
        if grid[index]%10==0:
            openadjlist.append(index)
    randomint = math.floor(random.random()*(len(openadjlist)+1))
    if randomint == len(openadjlist):
        return grid,mouseindex
    else:
        grid[mouseindex]-=2
        grid[openadjlist[randomint]]+=2
        mouseindex = openadjlist[randomint]
        return grid,mouseindex
def move_mice(grid,mouseindex1,mouseindex2,bot1mode,bot2mode,bot3mode,b1secondmouse,b2secondmouse,b3secondmouse):
    adjlist1 = get_adj_indices(mouseindex1[0],mouseindex1[1],len(grid))
    adjlist2 = get_adj_indices(mouseindex2[0],mouseindex2[1],len(grid))
    openadjlist1,openadjlist2 = [],[]
    for index1 in adjlist1:
        if grid[index1]%10==0 or grid[index1]%10==2:
            openadjlist1.append(index1)
    for index2 in adjlist2:
        if grid[index2]%10==0 or grid[index2]%10==2:
            openadjlist2.append(index2)
    openadjlist1.append(mouseindex1)
    openadjlist2.append(mouseindex2)
    possiblemoves = [[i,j] for i,j in itertools.product(openadjlist1,openadjlist2) if not i==j]
    movetopick = math.floor(random.random()*len(possiblemoves))
    mouse1 = grid[mouseindex1]
    mouse2 = grid[mouseindex2]
    grid[mouseindex1]-=2
    grid[mouseindex2]-=2
    grid[possiblemoves[movetopick][0]]+=2
    grid[possiblemoves[movetopick][1]]+=2
    if bot1mode==1 and b1secondmouse==2:
        grid[mouseindex1]-=10
        grid[possiblemoves[movetopick][0]]+=10
    if bot1mode==1 and b1secondmouse==1:
        grid[mouseindex2]-=10
        grid[possiblemoves[movetopick][1]]+=10
    if bot2mode==1 and b2secondmouse==2:
        grid[mouseindex1]-=100
        grid[possiblemoves[movetopick][0]]+=100
    if bot2mode==1 and b2secondmouse==1:
        grid[mouseindex2]-=100
        grid[possiblemoves[movetopick][1]]+=100
    if bot3mode==1 and b3secondmouse==2:
        grid[mouseindex1]-=1000
        grid[possiblemoves[movetopick][0]]+=1000
    if bot3mode==1 and b3secondmouse==1:
        grid[mouseindex2]-=1000
        grid[possiblemoves[movetopick][1]]+=1000
    """if bot1mode==1
        if (mouse1//10)%10>0 and not ((mouse2//10)%10>0 and bot1index==mouseindex1):
            grid[mouseindex1]-=10
            grid[possiblemoves[movetopick][0]]+=10
        if (mouse2//10)%10>0 and not ((mouse1//10)%10>0 and bot1index==mouseindex2):
            grid[mouseindex1]-=10
            grid[mouseindex2]-=10
            grid[possiblemoves[movetopick][1]]+=10
    if bot2mode==1:
        if((mouse1//10)//10)%10>0 and not ((mouse2//10)%10>0 and bot2index==mouseindex1):
            grid[mouseindex1]-=100
            grid[possiblemoves[movetopick][0]]+=100
        if ((mouse2//10)//10)%10>0 and not ((mouse1//10)%10>0 and bot2index==mouseindex2):
            grid[mouseindex2]-=100
            grid[possiblemoves[movetopick][1]]+=100
    if bot3mode==1:
        if (((mouse1//10)//10)//10)%10>0 and not ((mouse2//10)%10>0 and bot2index==mouseindex1):
            grid[mouseindex1]-=1000
            grid[possiblemoves[movetopick][0]]+=1000 
        if (((mouse2//10)//10)//10)%10>0 and not ((mouse2//10)%10>0 and bot2index==mouseindex2):
            grid[mouseindex2]-=1000
            grid[possiblemoves[movetopick][1]]+=1000
    """
    
    mouseindex1 = possiblemoves[movetopick][0]
    mouseindex2 = possiblemoves[movetopick][1]

    return grid,mouseindex1,mouseindex2

def bot_1(grid,bot1index,t,plan,bot1evidence,mouseindex,a,bot1state,stoch):
    if plan == []:
        d = calc_manhattan_dist(bot1index,mouseindex)
        if random.random()<math.exp(-a*(d-1)):
            newevidence = (t,1,bot1index)
            bot1evidence.append(newevidence)
        else:
            newevidence = (t,0,bot1index)
            bot1evidence.append(newevidence)
        bot1state = filtering(bot1state.copy(),stoch,bot1evidence.copy(),t,grid.copy(),a)
        destinationindex = np.unravel_index(bot1state.argmax(), bot1state.shape)
        plan = bfs(grid,bot1index,destinationindex,1)
        return grid,bot1index,bot1evidence,plan,bot1state
    
    else:
        grid[bot1index]-=10
        grid[plan[0]]+=10
        bot1index = plan[0]
        plan.pop(0)
        newevidence = (t,2,bot1index)
        bot1evidence.append(newevidence)
        bot1state = filtering(bot1state.copy(),stoch,bot1evidence.copy(),t,grid.copy(),a)
        return grid,bot1index,bot1evidence,plan,bot1state 
def bot_2(grid,bot2index,t,plan,bot2evidence,mouseindex,a,bot2state,stoch):
    if plan == []:
        d = calc_manhattan_dist(bot2index,mouseindex)
        if random.random()<math.exp(-a*(d-1)):
            newevidence = (t,1,bot2index)
            bot2evidence.append(newevidence)
        else:
            newevidence = (t,0,bot2index)
            bot2evidence.append(newevidence)
        bot2state = filtering(bot2state.copy(),stoch,bot2evidence.copy(),t,grid,a)
        destinationindex = np.unravel_index(bot2state.argmax(), bot2state.shape)
        if bot2index == destinationindex:
            statecopy = bot2state.copy()
            statecopy[bot2index]-=1
            destinationindex = np.unravel_index(statecopy.argmax(), bot2state.shape)
        plan = bfs(grid,bot2index,destinationindex,2)
        return grid,bot2index,bot2evidence,plan,bot2state
    if plan[0]==None:
        d = calc_manhattan_dist(bot2index,mouseindex)
        if random.random()<math.exp(-a*(d-1)):
            newevidence = (t,1,bot2index)
            bot2evidence.append(newevidence)
        else:
            newevidence = (t,0,bot2index)
            bot2evidence.append(newevidence)
        bot2state = filtering(bot2state.copy(),stoch,bot2evidence.copy(),t,grid,a)
        plan.pop(0)
        destinationindex = np.unravel_index(bot2state.argmax(), bot2state.shape)
        if not plan[len(plan)-1] == destinationindex:
            plan = bfs(grid,bot2index,destinationindex,2)
        return grid,bot2index,bot2evidence,plan,bot2state
    else:
        grid[bot2index]-=100
        grid[plan[0]]+=100
        bot2index = plan[0]
        plan.pop(0)
        newevidence = (t,2,bot2index)
        bot2evidence.append(newevidence)
        bot2state= filtering(bot2state.copy(),stoch,bot2evidence.copy(),t,grid,a)
        return grid,bot2index,bot2evidence,plan,bot2state
def bot_3(grid,bot3index,t,plan,bot3evidence,mouseindex,a,bot3state,stoch):
    if plan == []:
        d = calc_manhattan_dist(bot3index,mouseindex)
        if random.random()<math.exp(-a*(d-1)):
            newevidence = (t,1,bot3index)
            bot3evidence.append(newevidence)
        else:
            newevidence = (t,0,bot3index)
            bot3evidence.append(newevidence)
        bot3state = filtering(bot3state.copy(),stoch,bot3evidence.copy(),t,grid.copy(),a)
        destinationindex = np.unravel_index(bot3state.argmax(), bot3state.shape)
        if bot3index == destinationindex:
            statecopy = bot3state.copy()
            statecopy[bot3index]-=1
            destinationindex = np.unravel_index(statecopy.argmax(), bot3state.shape)
        if stoch:
            estd = calc_manhattan_dist(bot3index,destinationindex)
            if estd>3:
                plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,bot3state.copy(),3,stoch,bot3evidence.copy(),t)
                return grid,bot3index,bot3evidence,plan,bot3state
            else:
                plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,bot3state.copy(),1,stoch,bot3evidence.copy(),t)
                return grid,bot3index,bot3evidence,plan,bot3state
        else:
            plan = bot_3_dynamic_UFCS(grid,bot3index,destinationindex,bot3state.copy(),3,stoch,bot3evidence.copy(),t)
            return grid,bot3index,bot3evidence,plan,bot3state
    if plan[0]==None:
        d = calc_manhattan_dist(bot3index,mouseindex)
        if random.random()<math.exp(-a*(d-1)):
            newevidence = (t,1,bot3index)
            bot3evidence.append(newevidence)
        else:
            newevidence = (t,0,bot3index)
            bot3evidence.append(newevidence)
        bot3state= filtering(bot3state.copy(),stoch,bot3evidence.copy(),t,grid,a)
        plan.pop(0)
        return grid,bot3index,bot3evidence,plan,bot3state
    else:
        grid[bot3index]-=1000
        grid[plan[0]]+=1000
        bot3index = plan[0]
        plan.pop(0)
        newevidence = (t,2,bot3index)
        bot3evidence.append(newevidence)
        bot3state = filtering(bot3state.copy(),stoch,bot3evidence.copy(),t,grid,a)
        return grid,bot3index,bot3evidence,plan,bot3state

def get_initial_dist(grid):
    openlist = []
    for i in range(len(grid)):
        for j in range(len(grid)):
            if grid[(i,j)]==0 or grid[(i,j)]==2:
                openlist.append((i,j))
    initial_dist = np.zeros((len(grid),len(grid)))
    for item in openlist:
        initial_dist[item] = 1/len(openlist)
    #print(np.array2string(initial_dist,max_line_width=1000))
    return initial_dist
def get_initial_dist_2mice(grid):
    openlist = []
    l = len(grid)
    for i in range(l):
        for j in range(l):
            if grid[(i,j)]==0 or grid[(i,j)]==2:
                openlist.append((i,j))
    numopenpairs = len(openlist)*(len(openlist)+1)/2
    #twomiceprobdict = {((i%l,i//l),(j%l,j//l)):1/numopenpairs for i in range(l**2) for j in range(i,l**2) if ((grid[(i%l,i//l)]==0 or grid[(i%l,i//l)]==2) and (grid[(j%l,j//l)]==0 or grid[(j%l,j//l)]==2))}
    twomicearr = np.zeros((l,l,l,l))
    openpairslist = []
    for i in range(l**2):
        for j in range(i,l**2):
            if (grid[(i//l,i%l)]==0 or grid[(i//l,i%l)]==2) and (grid[(j//l,j%l)]==0 or grid[(j//l,j%l)]==2):
                twomicearr[(i//l,i%l,j//l,j%l)]+=1/numopenpairs
                openpairslist.append((i//l,i%l,j//l,j%l))
    return twomicearr,openpairslist

def filtering(filterstate,stoch,filterevidence,t,grid,a):
    #First we find P(X_t|e_{t-1},...,e_1), the prediction of the new state from old evidence
    if not stoch:
        pred = filterstate
    else:
        pred = np.zeros((len(grid),len(grid)))
        for i in range(len(grid)):
            for j in range(len(grid)):
                if grid[(i,j)]%10==0 or grid[(i,j)]%10==2 and not (i,j)==filterevidence[t][2]:
                    adjlist = get_adj_indices(i,j,len(grid))
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
                    """file = open('shipresults.txt','a')
                    file.write('temppred ('+str(i)+','+str(j)+') and states[t-1][(i,j)] = '+str(states[t-1][(i,j)])+ '\n')
                    file.write(np.array2string(temppred,max_line_width=1000))
                    file.write('\n')
                    file.close()"""
    #Now we need a second array: P(e_t|X_t), the probability of getting our evidence conditioned on the state
    #which will be different for all 3 evidence types
    probevidence = np.zeros((len(grid),len(grid)))
    #Next line is if new evidence is stepping into an empty square, thereby that empty square does not contain the mouse:
    if filterevidence[t][1]==2:
        for i in range(len(grid)):
            for j in range(len(grid)):
                if (grid[(i,j)]%10==0 or grid[i,j]%10==2) and not (i,j)==filterevidence[t][2]:
                    probevidence[(i,j)] += 1
    #If new evidence is a positive sense:
    if filterevidence[t][1]==1:
        for i in range(len(grid)):
            for j in range(len(grid)):
                if (grid[(i,j)]%10==0 or grid[i,j]%10==2) and not (i,j)==filterevidence[t][2]:
                    d = calc_manhattan_dist((i,j),filterevidence[t][2])
                    probevidence[(i,j)]=math.exp(-a*(d-1))
    #If new evidence is a negative sense:
    if filterevidence[t][1]==0:
        for i in range(len(grid)):
            for j in range(len(grid)):
                if (grid[(i,j)]%10==0 or grid[i,j]%10==2) and not (i,j)==filterevidence[t][2]:
                    d = calc_manhattan_dist((i,j),filterevidence[t][2])
                    probevidence[(i,j)]=1-math.exp(-a*(d-1))
    """file = open('shipresults.txt','a')
    file.write('probevidence: \n')
    file.write(np.array2string(probevidence,max_line_width=1000))
    file.write('\n')
    file.close()"""
    stateunnormalized = pred * probevidence
    #Now we normalize probabilities
    newstate = stateunnormalized*(1/np.sum(stateunnormalized))
    return newstate
def filtering_2mice(filterstate,stoch,filterevidence,t,grid,a,openpairslist):
      #First we find P(X_t|e_{t-1},...,e_1), the prediction of the new state from old evidence
    if not stoch:
        pred = filterstate
    else:
        pred = np.zeros((len(grid),len(grid),len(grid),len(grid)))
        probmouseat = calc_marginal_dists(filterstate.copy(),openpairslist,len(grid))
        predprobmouseat = predicting_2mice(probmouseat,stoch,filterevidence.copy(),grid.copy())
        for bigtup in openpairslist:
            pred[bigtup]=predprobmouseat[(bigtup[0],bigtup[1])]*predprobmouseat[(bigtup[2],bigtup[3])]
        """p = 0
        pred = np.zeros((len(grid),len(grid),len(grid),len(grid)))
        for bigtup in openpairslist:
            print('p= ',p)
            if not (bigtup[0],bigtup[1])==filterevidence[t][2] and not (bigtup[2],bigtup[3])==filterevidence[t][2]:
                adjlist1 = get_adj_indices(bigtup[0],bigtup[1],len(grid))
                adjlist2 = get_adj_indices(bigtup[2],bigtup[3],len(grid))
                openadjpairs = []
                for index1 in adjlist1:
                    for index2 in adjlist2:
                        if (grid[index1]%10==0 or grid[index1]%10==2) and (grid[index2]%10==0 or grid[index2]%10==2) and not index1==filterevidence[t][2] and not index2==filterevidence[t][2] and not index1==index2:
                            if index1<index2:
                                openadjpairs.append((index1[0],index1[1],index2[0],index2[1]))
                            else:
                                openadjpairs.append((index2[0],index2[1],index1[0],index1[1]))
                temppred = np.zeros((len(grid),len(grid),len(grid),len(grid)))
                temppred[bigtup]+=1/(len(openadjpairs)+1)
                if len(openadjpairs)>0:
                    for bigopentup in openadjpairs:
                        temppred[bigopentup]+=1/(len(openadjpairs)+1)
                pred += temppred*filterstate[bigtup]
            p+=1"""
    #Now we need a second array: P(e_t|X_t), the probability of getting our evidence conditioned on the state
    #which will be different for all 3 evidence types
    probevidence = np.zeros((len(grid),len(grid),len(grid),len(grid)))
    #Next line is if new evidence is stepping into an empty square, thereby that empty square does not contain the mouse:
    if filterevidence[t][1]==2:
        for index in openpairslist:
            if (not (index[0],index[1])==filterevidence[t][2]) and (not (index[2],index[3])==filterevidence[t][2]):
                probevidence[index] += 1
    #If new evidence is a positive sense:
    if filterevidence[t][1]==1:
        for index in openpairslist:
            #if not (index[0],index[1])==filterevidence[t][2] and not (index[2],index[3])==filterevidence[t][2]:
            d1 = calc_manhattan_dist((index[0],index[1]),filterevidence[t][2])
            d2 = calc_manhattan_dist((index[2],index[3]),filterevidence[t][2])
            probevidence[index]=1-(1-math.exp(-a*(d1-1)))*(1-math.exp(-a*(d2-1)))
    #If new evidence is a negative sense:
    if filterevidence[t][1]==0:
        for index in openpairslist:
            #if not (index[0],index[1])==filterevidence[t][2] and not (index[2],index[3])==filterevidence[t][2]:
            d1 = calc_manhattan_dist((index[0],index[1]),filterevidence[t][2])
            d2 = calc_manhattan_dist((index[2],index[3]),filterevidence[t][2])
            probevidence[index]=(1-math.exp(-a*(d1-1)))*(1-math.exp(-a*(d2-1)))
    """file = open('shipresults.txt','a')
    file.write('probevidence: \n')
    file.write(np.array2string(probevidence,max_line_width=1000))
    file.write('\n')
    file.close()"""
    stateunnormalized = pred * probevidence
    #Now we normalize probabilities
    newstate = stateunnormalized*(1/np.sum(stateunnormalized))
    return newstate
def calc_marginal_dists(state,openpairlist,D):
    probmouseat = np.zeros((D,D))
    for bigtup in openpairlist:
        probmouseat[(bigtup[0],bigtup[1])]+=state[bigtup]
        if not (bigtup[0],bigtup[1])==(bigtup[2],bigtup[3]):
            probmouseat[(bigtup[2],bigtup[3])]+=state[bigtup]
    return probmouseat
def get_marginal_dist_for_index(state,margindex,openpairslist,D,grid,check):
    newstate = np.zeros((D,D))
    for bigtup in openpairslist:
        if (bigtup[0],bigtup[1]) == margindex:
            newstate[(bigtup[2],bigtup[3])]+=state[bigtup]
        if (bigtup[2],bigtup[3]) == margindex and not (bigtup[0],bigtup[1])==(bigtup[2],bigtup[3]):
            newstate[(bigtup[0],bigtup[1])]+=state[bigtup]
       #print('bigtup: ',bigtup,'\n prob: ',state[bigtup])
    if np.all(newstate==0) and check==False:
        print('Error: Initial distribution restored')

        """openlist = []
        for i in range(len(grid)):
            for j in range(len(grid)):
                if grid[(i,j)]%10==0 or grid[(i,j)]%10==2:
                    openlist.append((i,j))
        initial_dist = np.zeros((len(grid),len(grid)))
        for item in openlist:
            initial_dist[item] = 1/len(openlist)
        return initial_dist"""
    if np.all(newstate==0):
        return newstate
    newstate *= 1/np.sum(newstate)
    return newstate

def predicting(initialstate,stoch,evidence,grid):
    if not stoch:
        return initialstate
    predictedstate = np.zeros((len(grid),len(grid)))
    for i in range(len(grid)):
        for j in range(len(grid)):
            if (grid[(i,j)]%10==0 or grid[(i,j)]%10==2) and not (i,j)==evidence[len(evidence)-1][2]:
                adjlist = get_adj_indices(i,j,len(grid))
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
    """file = open('shipresults.txt','a')
    i = 0
    for item in predlist:
        if i==0 or i==len(predlist)-1:
            file.write('Max: ')
            file.write(str(np.unravel_index(predlist[i].argmax(), predlist[i].shape)))
            file.write('\n')
            file.write(np.array2string(item,max_line_width=1000))
            file.write('\n')
        i+=1
    file.close()"""
    return predictedstate
def predicting_2mice(initialstate,stoch,evidence,grid):
    if not stoch:
        return initialstate
    predictedstate = np.zeros((len(grid),len(grid)))
    for i in range(len(grid)):
        for j in range(len(grid)):
            if (grid[(i,j)]%10==0 or grid[(i,j)]%10==2):
                adjlist = get_adj_indices(i,j,len(grid))
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
def bot_3_dynamic_UFCS(grid,start,destinationindex,state,bot,stoch,evidence,t):
    #turn 3d UFCS into 2d by making weights list of arrays into a hashmap/graph that UFCS algorithm can traverse
    newweights = {(0,start,0):None}
    seen = []
    currlevel = [(0,start,0)]
    j=0
    rowsign = destinationindex[0]-start[0]
    colsign = destinationindex[1]-start[1]
    check = False
    predictedstate = state
    while not currlevel==[]:
        predictedstate = predicting(predictedstate.copy(),stoch,evidence.copy(),grid)
        nextlevel = []
        for item in currlevel:
            newweights[item] = None
            if item[1] == destinationindex:
                check = True
                break
            adjsqrs = get_adj_indices(item[1][0],item[1][1],len(grid))
            for sq in adjsqrs:
                if (grid[sq]%10==0 or grid[sq]%10==2) and not sq in seen:
                    #These next four lines are made so that if the destination is up and to the right of the start for instance,
                    #the UFCS graph can only point up or right
                    if (sq[0]-item[1][0]==0 or (sq[0]-item[1][0]>0 and rowsign>0) or (sq[0]-item[1][0]<0 and rowsign <0)):
                        if (sq[1]-item[1][1]==0 or (sq[1]-item[1][1]>0 and colsign>0) or (sq[1]-item[1][1]<0 and colsign<0)):
                            if min(start[0],destinationindex[0])<=sq[0]<=max(start[0],destinationindex[0]):
                                if min(start[1],destinationindex[1])<=sq[1]<=max(start[1],destinationindex[1]):
                                    new = (1+math.log(1-predictedstate[sq]),sq,item[2]+1)
                                    if not new in nextlevel:
                                        nextlevel.append(new)
                                    if newweights[item]==None:
                                        newweights[item]=[new]
                                    else:
                                        newweights[item].append(new)
            seen.append(item[1])
        if check == True:
            break
        currlevel = nextlevel
        j+=1
    check = False
    for item in list(newweights.values()):
        if not item == None:
            for item2 in item:
                if item2[1]==destinationindex:
                    check = True
    if not check:
        newweights = {(0,start,0):None}
        seen = []
        currlevel = [(0,start,0)]
        j=0
        check = False
        predictedstate = state
        while not currlevel==[]:
            predictedstate = predicting(predictedstate.copy(),stoch,evidence.copy(),grid)
            nextlevel = []
            for item in currlevel:
                newweights[item] = None
                if item[1] == destinationindex:
                    check = True
                    break
                adjsqrs = get_adj_indices(item[1][0],item[1][1],len(grid))
                for sq in adjsqrs:
                    if (grid[sq]%10==0 or grid[sq]%10==2) and not sq in seen:
                        new = (1+math.log(1-predictedstate[sq]),sq,item[2]+1)
                        if not new in nextlevel:
                            nextlevel.append(new)
                        if newweights[item]==None:
                            newweights[item]=[new]
                        else:
                            newweights[item].append(new)
                seen.append(item[1])
            if check == True:
                break
            currlevel = nextlevel
            j+=1
    #print(newweights)
    """file = open('shipresults.txt','a')
    file.write('Check = ')
    file.write(str(check))
    file.write('\n')
    file.write('Destination index: ')
    file.write(str(destinationindex))
    file.write('\n Weight graph: ')
    file.write(str(newweights))
    file.write('\n')
    file.close()"""
    distances = {}
    prev = {}
    fringe = []
    distances[(0,start,0)]=0
    prev[start]= None
    heapq.heappush(fringe,(0,start,0))
    while not fringe == []:
        curr = heapq.heappop(fringe)
        if curr[1]==destinationindex:
            return make_bfs_path_list(prev,curr[1],bot)
        #adjlist = get_adj_indices(curr[1][0],curr[1][1],len(grid))
        if curr in newweights.keys():
            if not newweights[curr]==None:
                for child in newweights[curr]:
                    if grid[child[1]]%10==0 or grid[child[1]]%10==2:
                        temp_dist = distances[curr]+child[0]
                        if (not child in distances) or temp_dist<distances[child]:
                            distances[child]=temp_dist
                            prev[child[1]]=curr[1]
                            heapq.heappush(fringe,child)
    
    return []

def bfs(grid,start,end,bot):
    prev = {}
    marked = []
    queue = deque()
    queue.append(start)
    prev[start] = None
    marked.append(start)
    while not len(queue)==0:
        currentstate = queue.popleft()
        if currentstate == end:
            return make_bfs_path_list(prev,currentstate,bot)
        adjindexlist = get_adj_indices(currentstate[0],currentstate[1],len(grid))
        for item in adjindexlist:
            if (grid[item]%10==0 or grid[item]%10==2) and item not in marked:
                queue.append(item)
                marked.append(item)
                prev[item] = currentstate
    return []
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

def create_grid(D):
    #create array
    newgrid = np.ones((D,D))
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
    #Well, a bit more than half, it seemed like this gave greater variance in success rates and thus made things a little bit more interesting
    #i.e. more corridors to choose from, more significant choices for the bots to make
    openeddeadends = []
    for item in closednbrsofdeadends:
        if random.random() < .5:
            newgrid[item] = 0
            openeddeadends.append(item)
    #print(newgrid)
    #print('Before: ',len(closednbrsofdeadends),' After: ', len(closednbrsofdeadends)-len(openeddeadends))
    return newgrid
def place_initial_positions(grid,nummice):
    opencelllist=[]
    for i in range(len(grid)):
        for j in range(len(grid)):
            if grid[(i,j)]==0:
                opencelllist.append((i,j))
    botindex = opencelllist[math.floor(random.random()*len(opencelllist))]
    grid[botindex] = 1110
    opencelllist.remove(botindex)
    mouseindex1 = opencelllist[math.floor(random.random()*len(opencelllist))]
    grid[mouseindex1] = 2
    if nummice == 2:
        opencelllist.remove(mouseindex1)
        mouseindex2 = opencelllist[math.floor(random.random()*len(opencelllist))]
        grid[mouseindex2] = 2
        return grid,botindex,mouseindex1,mouseindex2
    else:
        return grid,botindex,mouseindex1,None
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
def calc_manhattan_dist(tup1,tup2):
    return int(math.fabs(tup1[0]-tup2[0])+math.fabs(tup1[1]-tup2[1]))
def run_sim_2mice_bot1only(grid,a,nummice,stoch,printyn):
    grid,botindex,mouseindex1,mouseindex2 = place_initial_positions(grid,nummice)
    if printyn:
        file = open('shipresults.txt','a')
        file.write('t= 0 \n')
        file.write(np.array2string(grid,max_line_width=1000))
        file.write('\n')
        file.close()
    bot1index,bot2index,bot3index = botindex,botindex,botindex
    done = False
    currentstate,openpairslist = get_initial_dist_2mice(grid)
    bot1state,bot2state,bot3state = currentstate.copy(),currentstate.copy(),currentstate.copy()
    bot1evidence,bot2evidence,bot3evidence = [None],[None],[None]
    #Evidence format: (t,type,tuple of index on ship) 
    #where type = 0 if negative sense, 1 if positive sense, 2 if walked into square"""
    bot1plan,bot2plan,bot3plan = [],[],[]
    bot1mode,bot2mode,bot3mode = 2,2,2
    t = 1
    runsimresults = [None,None,None,None,None,None,a]
    while bot1mode>0:
        if bot1mode==2:
            grid,bot1index,bot1evidence,bot1plan,bot1state,bot1margstate = bot_1_2mice(grid,bot1index,t,bot1plan,bot1evidence.copy(),mouseindex1,mouseindex2,a,bot1state.copy(),stoch,openpairslist)
        if bot1mode==1:
            if b1secondmouse == 1:
                grid,bot1index,bot1evidence,bot1plan,bot1state1mouse = bot_1(grid,bot1index,t,bot1plan,bot1evidence.copy(),mouseindex1,a,bot1state1mouse.copy(),stoch)
            if b1secondmouse == 2:
                grid,bot1index,bot1evidence,bot1plan,bot1state1mouse = bot_1(grid,bot1index,t,bot1plan,bot1evidence.copy(),mouseindex2,a,bot1state1mouse.copy(),stoch)
        if stoch:
            grid,mouseindex1,mouseindex2 = move_mice(grid,mouseindex1,mouseindex2,bot1mode)
        if bot1mode==2 and (bot1index==mouseindex1 or bot1index==mouseindex2):
            bot1mode=1
            if bot1index==mouseindex1:
                bot1mode=1
                b1secondmouse=2
                grid[bot1index]+=10
                bot1oldstate = currentstate.copy()

                print(np.array2string(calc_marginal_dists(bot1oldstate,openpairslist,len(grid)),max_line_width=1000))
                for k in range(1,t):
                    if not bot1evidence[k][2]==mouseindex1:
                        bot1oldstate = filtering_2mice(bot1oldstate.copy(),stoch,bot1evidence.copy(),k,grid.copy(),a,openpairslist)
                        print(bot1evidence[k])
                        print(np.array2string(calc_marginal_dists(bot1oldstate,openpairslist,len(grid)),max_line_width=1000))
                        k+=1
                bot1state1mouse = get_marginal_dist_for_index(bot1oldstate.copy(),mouseindex1,openpairslist,len(grid),grid.copy())
                #print(np.array2string(bot1state1mouse,max_line_width=1000))
            if bot1index==mouseindex2:
                bot1mode=1
                b1secondmouse=1
                grid[bot1index]+=10
                bot1oldstate = currentstate.copy()
                k=1
                print(np.array2string(calc_marginal_dists(bot1oldstate,openpairslist,len(grid)),max_line_width=1000))
                for k in range(1,t):
                    if not bot1evidence[k][2]==mouseindex2:
                        bot1oldstate = filtering_2mice(bot1oldstate.copy(),stoch,bot1evidence.copy(),k,grid.copy(),a,openpairslist)
                        print(bot1evidence[k])
                        print(np.array2string(calc_marginal_dists(bot1oldstate,openpairslist,len(grid)),max_line_width=1000))
                bot1state1mouse = get_marginal_dist_for_index(bot1oldstate.copy(),mouseindex1,openpairslist,len(grid),grid.copy())
            runsimresults[0]=t
            bot1plan = []

        if bot1mode==1 and ((b1secondmouse==1 and bot1index==mouseindex1) or (b1secondmouse==2 and bot1index==mouseindex2)):
            grid[bot1index]-=10
            if b1secondmouse==1:
                grid[mouseindex2]-=10
            else:
                grid[mouseindex1]-=10
            runsimresults[1] = t
            bot1mode = 0
        #if stoch:
         #   grid,mouseindex1,mouseindex2 = move_mice(grid,mouseindex)
        if printyn:
            file = open('shipresults.txt','a')
            file.write('t= ')
            file.write(str(t))
            file.write('\n')
            file.write(np.array2string(grid, max_line_width=1000))
            file.write('\n')
        if printyn:
            if bot1mode>0:
                file.write('\n Bot 1 recent evidence: ')
                file.write(str(bot1evidence[t]))
                #file.write('\n Bot 1 full evidence: ')
                #file.write(str(bot1evidence))
                file.write('\n Bot 1 estimated state: \n')
                if bot1mode==2:
                    file.write(np.array2string(bot1margstate,max_line_width=1000))
                if bot1mode==1:
                    file.write(np.array2string(bot1state1mouse,max_line_width=1000))
                file.write('\n')
            
            """if b2==False:
                file.write(' Bot 2: ')
                file.write(str(bot2evidence[t]))
            if b3==False:
                file.write(' Bot 3: ')
                file.write(str(bot3evidence[t]))"""

            """if b2==False:
                file.write('Bot 2 evidence: ')
                file.write(str(bot2evidence))
                file.write('\n Bot 2 estimated state: \n')
                file.write(np.array2string(bot2eststates[t],max_line_width=1000))
                file.write('\n')
            if b3==False:
                file.write('Bot 3 evidence: ')
                file.write(str(bot3evidence))
                file.write('\n Bot 3 plan: ')
                file.write(str(bot3plan))
                file.write('\n Bot 3 estimated state: \n')
                file.write(np.array2string(bot3eststates[t],max_line_width=1000))
                file.write('\n')
            file.close()
        if t>5000:
            file = open('shipresults.txt','a')
            file.write(np.array2string(grid,max_line_width=1000))
            file.write('\n')
            if b1 == False:
                file.write(np.array2string(bot1eststates[t],max_line_width=1000))
                file.write('\n')
                runsimresults[0] = 5000
            if b2 == False:
                file.write(np.array2string(bot2eststates[t],max_line_width=1000))
                file.write('\n')
                runsimresults[1] = 5000
            if b3 == False:
                file.write(np.array2string(bot3eststates[t],max_line_width=1000))
                file.write('\n')
                runsimresults[2] = 5000
            print('t>5000,  bot 1: ',b1,' bot 2: ', b2,' bot 3: ',b3)
            return runsimresults"""
        t += 1
    return runsimresults

if __name__ == '__main__':
    main()