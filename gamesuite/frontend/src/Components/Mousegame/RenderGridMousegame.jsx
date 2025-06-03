
export default function RenderGridMousegame(props){
    if(!props.data) return <p>Loading...</p>

    const grid = props.data.game.grid.map(row => [...row])
    const sensorcounts = Array.from({ length: grid.length }, () =>
        Array.from({ length: grid.length }, () => [0, 0])
      );
    const turn = props.turn;
    const playerIndex = props.playerIndex;
    const playerPath = props.playerPath;
    const sensorLog = props.sensorLog;
    
    if(props.seePath){
        for(let i=0;i<playerPath.length;i++){
            grid[playerPath[i][0]][playerPath[i][1]]=3
        }
    }
    for(let i=0;i<sensorLog.length;i++){
        sensorcounts[sensorLog[i].position[0]][sensorLog[i].position[1]][1] += 1
        if(sensorLog[i].beep){
            sensorcounts[sensorLog[i].position[0]][sensorLog[i].position[1]][0] += 1
        }
    }
    const colors = sensorcounts.map(row => row.map(([a,b]) => b>0 ? getColorFromValue(a,b) : -1))

    function getColorFromValue(a,b) {
        if(a===0){
            return `bg-red-400`
        }
        let c = Math.max(b,8);
        if(a/c<=.2){
            return 'bg-green-100'
        }else if(.2<a/c<=.4){
            return 'bg-green-200'
        }else if(.4<a/c<=.6){
            return 'bg-green-300'
        }else if(.6<a/c<=.8){
            return 'bg-green-400'
        }else{
            return 'bg-green-500'
        }
      }

    return(
    <div className="grid bg-black grid-rows-25 grid-cols-25">
        {grid.map((row,i)=>(
                row.map((cell,j) => {
                    let bgColor = '';
                    let img = ''
                    const mod = cell%10;
                    if(mod===0){
                       img = 'space_tiles_hyptosis/wool_colored_white.png'
                       bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/wool_colored_white.png')]"
                    }
                    if(mod===1){
                        img = 'space_tiles_hyptosis/glass.png'
                        bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/glass.png')]"
                    }
                    /*
                    if(mod===1){
                        bgColor = 'bg-black '
                        if(i<24){
                            if(grid[i+1][j]!==1){
                                bgColor += 'border border-cyan-100 '
                        }}
                        if(i>0){
                        if(grid[i-1][j]!==1){
                            bgColor += 'border border-cyan-100 '
                        }}
                        if(j<24){
                        if(grid[i][j+1]!==1){
                            bgColor += 'border border-cyan-100 '
                        }}
                        if(j>0){
                        if(grid[i][j-1]!==1){
                            bgColor += 'border border-cyan-100 '
                        }}*/
                    if(mod===3){
                        bgColor = "w-8 h-8 border border-gray-400 bg-amber-100"
                    }
                    if(colors[i][j]!==-1&&props.showSenses){
                        bgColor = colors[i][j]
                    }
                    if(props.hoverIndex){
                        if(i===props.hoverIndex[0][0]&&j==props.hoverIndex[0][1]){
                            bgColor = props.hoverIndex[1] ? 'bg-green-500' : 'bg-red-500';
                    }}
                    
    return (<div className="">
                <div key={i.toString()+','+j.toString()} 
                    className= {`w-8 h-8 ${bgColor}`}
                    style={{ backgroundSize: "32px 32px" }}
                    >
                    
                    <div className=" w-8 h-8 top-0 left-0">
                        <div className="text-black text-[9px] fixed">{(sensorcounts[i][j][1]!==0&&props.showSenses)&&`${sensorcounts[i][j][0]}/${sensorcounts[i][j][1]}`}</div>
                        <BotSlot
                                data={props.data} 
                                playerIndex={props.playerIndex} 
                                turn={turn} 
                                i={i} 
                                j={j}
                                frameIndex = {props.frameIndex}
                                gameStatus = {props.gameStatus}/>
                    </div>
                </div>
            </div>
                )})
        ))}
    </div>)
}

function BotSlot(props){
    const playerIndex = props.playerIndex
    const bot4path = props.data.bot4.evidence.map(([t,type,[i,j]])=> [i,j])

    let botsInSpace = []
    let bot4index;
    if(props.turn!==0){
        bot4index = bot4path[Math.min(props.turn-1,bot4path.length-1)];
    }
    else{
        bot4index = props.data.game.botStartingIndex;
    }   
    
    if(bot4index[0]===props.i && bot4index[1]===props.j){
        if(playerIndex[0]===props.i && playerIndex[1]===props.j){
            const bot4obj = { id: 4, className:"absolute top-1/2 left-2/7 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black z-30"}
            const playerobj = {id: 0, className:"absolute top-1/2 left-5/7 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black z-30"}
            botsInSpace.push(bot4obj)
            botsInSpace.push(playerobj)
        }else{
            const bot4obj = { id: 4, className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black z-30"}
            botsInSpace.push(bot4obj)
        }
    }
    if(playerIndex[0]===props.i && playerIndex[1]===props.j&&!(bot4index[0]===props.i && bot4index[1]===props.j)){
        const playerobj = {id: 0, className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black z-30"}
        botsInSpace.push(playerobj)
    }
    
    
    return(<div className="relative w-full h-full z-30">
        {(props.gameStatus==='lose'&&bot4index[0]===props.i && bot4index[1]===props.j)&&<img src={`/mouse/sprite_${['03','04','05'][props.frameIndex]}.png`}/>}
        {(props.gameStatus==='win'&&playerIndex[0]==props.i&&playerIndex[1]==props.j)&&<img src={`/mouse/sprite_${['03','04','05'][props.frameIndex]}.png`}/>}
        {botsInSpace.map((bot,i)=>(
            <div
                key = {bot.id}
                className={bot.className}
                >
            {(bot.id!==0) && bot.id}</div>))}
    </div>)
}