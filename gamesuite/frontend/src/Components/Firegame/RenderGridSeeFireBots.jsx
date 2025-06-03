import '../../Styles/flame.css'

export default function RenderGridSeeBots(props){
    if(!props.data) return <p>Loading...</p>

    const grid = JSON.parse(props.data.initial_board)
    const firelist = JSON.parse(props.data.fire_progression)
    const currentTurn = props.currentTurn
    for(let i=0;i<Math.min(firelist.length-1,currentTurn);i++){
        for(let j=0;j<firelist[i].length;j++){
            grid[firelist[i][j][0]][firelist[i][j][1]] += 2;
        };
    };
    

    return(
    <div className="grid grid-rows-25 grid-cols-25">
        {grid.map((row,i)=>(
                row.map((cell,j) => {
                let bgColor = '';
                const mod = cell % 10;
                if(mod===0){
                    bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/wool_colored_white.png')]"
                  }
                  if(mod===1){
                    bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/glass.png')]"
                  }
                  if(mod===5){
                    bgColor = "w-8 h-8 bg-[url('/suppresor2.png')]"
                  }
                /*if (mod === 2) {
                  bgColor = 'bg-red-500 border border-cyan-100';
                } else if (mod === 1) {
                    if(i<24){
                        if(grid[i+1][j]!==1){
                            bgColor += 'bg-black border-b-1 border-cyan-100 '
                        }
                      }
                      if(i>0){
                        if(grid[i-1][j]!==1){
                          bgColor += 'bg-black border-t-1 border-cyan-100 '
                        }
                      }
                      if(j<24){
                        if(grid[i][j+1]!==1){
                          bgColor += 'bg-black border-r-1 border-cyan-100 '
                        }
                      }
                      if(j>0){
                        if(grid[i][j-1]!==1){
                          bgColor += 'bg-black border-l-1 border-cyan-100 '
                        }
                      }
                } else if (mod === 5) {
                  bgColor = 'bg-green-700 border border-cyan-100';
                } else {
                  bgColor = 'bg-gray-400 border border-cyan-100';
                }*/
                    return (<>
                        {mod!==2 ? <div
                          key={`${i},${j}`}
                          className={`w-8 h-8 relative flex items-center justify-center ${bgColor}`}
                          style={{backgroundSize: '32px 32px'}}
                        >
                          <BotSlot
                            data={props.data}
                            difficulty = {props.difficulty}
                            playerIndex={props.playerIndex}
                            currentTurn={props.currentTurn}
                            result={props.result}
                            i={i}
                            j={j}
                          />
                        </div>:<div className='container'><div
                          key={`${i},${j}`}
                          className={`open-sq`}
                        >
                          <BotSlot
                            data={props.data}
                            playerIndex={props.playerIndex}
                            currentTurn={props.currentTurn}
                            result={props.result}
                            i={i}
                            j={j}
                          />
                        </div><div className='fire-sprite'></div></div>}
                        </>
                      );})
        ))}
    </div>)
}

function BotSlot(props){
    const currentTurn = props.currentTurn
    let successpossibleindex,bot1index,bot2index,bot3index,bot4index,playerindex;
    if(currentTurn!==0){
        const successpossiblepath = props.data.successpossiblepath
        const bot1path = props.data.bot1path;
        const bot2path = props.data.bot2path;
        const bot3path = props.data.bot3path;
        const bot4path = props.data.bot4path;
        const playerpath = props.data.player_path;

        successpossibleindex = successpossiblepath[Math.min(currentTurn-1,successpossiblepath.length-1)]
        bot1index = bot1path[Math.min(currentTurn-1,bot1path.length-1)]
        bot2index = bot2path[Math.min(currentTurn-1,bot2path.length-1)]
        bot3index = bot3path[Math.min(currentTurn-1,bot3path.length-1)]
        bot4index = bot4path[Math.min(currentTurn-1,bot4path.length-1)]
        playerindex = playerpath[Math.min(currentTurn-1,playerpath.length-1)]
    } else{
        successpossibleindex = JSON.parse(props.data.bot_index)
        bot1index = bot2index = bot3index = bot4index = playerindex = successpossibleindex
    }
    const botsInSpace = []
    if(props.result!=='forfeit'){
      if(playerindex[0]==props.i&& playerindex[1]==props.j){
        botsInSpace.push({id: 0, className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black"})
    }
    }
    
    console.log('pd: ',props.difficulty);
    if(props.difficulty==='hard'){
        if(successpossibleindex[0]===props.i && successpossibleindex[1]===props.j){
            botsInSpace.push({ id: 5, className:"absolute top-0 left-0 w-3 h-3 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center border border-black"})
        }
    }
    else{
        if(bot1index[0]==props.i && bot1index[1]==props.j){
            botsInSpace.push({ id: 1, className:"absolute top-0 left-0 w-3 h-3 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center border border-black"})
        }
    }
    if(bot2index[0]==props.i && bot2index[1]==props.j){
        botsInSpace.push({ id: 2, className:"absolute top-0 right-0 w-3 h-3 rounded-full bg-green-600 text-white text-xs flex items-center justify-center border border-black"})
    }
    if(bot3index[0]==props.i && bot3index[1]==props.j){
        botsInSpace.push({ id: 3, className:"absolute bottom-0 left-0 w-3 h-3 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center border border-black"})
    }
    if(bot4index[0]==props.i && bot4index[1]==props.j){
        botsInSpace.push({ id: 4, className:"absolute bottom-0 right-0 w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black"})
    }

    return(<div className="relative w-full h-full">
        {botsInSpace.map((bot)=>(
            <div
                key = {bot.id}
                className={bot.className}
                >
            {(bot.id!==0) && bot.id}</div>
        ))}
    </div>)

}