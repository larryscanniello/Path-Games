
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
    <div className="grid bg-gray-300 grid-rows-25 grid-cols-25">
        {grid.map((row,i)=>(
                row.map((cell,j) => {
                    let bgColor = '';
                    const mod = cell%10;
                    if(mod===1){
                        if(i<24){
                            if(grid[i+1][j]!==1){
                                bgColor += 'bg-black border-b-2 border-purple-400 '
                        }}
                        if(i>0){
                        if(grid[i-1][j]!==1){
                            bgColor += 'bg-black border-t-2 border-purple-400 '
                        }}
                        if(j<24){
                        if(grid[i][j+1]!==1){
                            bgColor += 'bg-black border-r-2 border-purple-400 '
                        }}
                        if(j>0){
                        if(grid[i][j-1]!==1){
                            bgColor += 'bg-black border-l-2 border-purple-400 '
                        }}
                    }else if(mod===3){
                        bgColor = 'bg-yellow-100 border border-cyan-100'
                    }else{
                        bgColor = 'bg-gray-300 border border-cyan-100'
                    }
                    if(colors[i][j]!==-1&&props.showSenses){
                        bgColor = colors[i][j]
                    }
                    /*if(props.hoverIndex){
                        if(i===props.hoverIndex[0]&&j==props.hoverIndex[1]){
                            bgColor = colors[i][j].charAt(4)==='0' ? 'green' : 'red';
                    }}*/
                    
                    return (<><div key={i.toString()+','+j.toString()} 
                    className= {`w-8 h-8 relative flex items-center justify-center ${bgColor}`}
                    style={{
                        backgroundColor: bgColor
                    }}
                    ><div className="text-black text-xs">{(sensorcounts[i][j][1]!==0&&props.showSenses)&&`${sensorcounts[i][j][0]}/${sensorcounts[i][j][1]}`}</div>
                    <BotSlot data={props.data} 
                            playerIndex={props.playerIndex} 
                            turn={turn} 
                            i={i} 
                            j={j}/>
                    </div>
                    </>
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
    if(playerIndex[0]===props.i && playerIndex[1]===props.j){
        botsInSpace.push({ id: 0, position: {top: '50%', left:'50%', transform: 'translate(-50%, -50%)' }, color: 'blue' })
    }
    if(bot4index[0]===props.i && bot4index[1]===props.j){
        botsInSpace.push({ id: 1, position: {top: '50%', left:'50%', transform: 'translate(-50%, -50%)' }, color: 'orange' })
    }
    const botStyle = {
        position: 'absolute',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: 'blue',
    };
    /*return(<>
        <div
        key = {playerSpace.id}
        style ={{
            ...botStyle,
            ...playerSpace.position,
            backgroundColor: playerSpace.color
        }}
        ></div>
    </>

    )*/
    return(<>{botsInSpace.map((bot)=>(
        <div
        key = {botsInSpace.id}
        style ={{
            ...botStyle,
            ...bot.position,
            backgroundColor: bot.color
        }}
        ></div>
    ))}</>

    )
}