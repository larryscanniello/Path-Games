import '../../Styles/FiregameStyles.css'

export default function RenderGridMousegame(props){
    if(!props.data) return <p>Loading...</p>

    const grid = props.data.game.grid.map(row => [...row])
    const grid2 = Array.from({ length: grid.length }, () =>
        Array.from({ length: grid.length }, () => [0, 0])
      );
    const turn = props.turn;
    const playerIndex = props.playerIndex;
    const playerPath = props.playerPath;
    const sensorLog = props.sensorLog;
    
    if(!props.data.game.stoch){
        for(let i=0;i<playerPath.length;i++){
            grid[playerPath[i][0]][playerPath[i][1]]=3
        }
    }
    for(let i=0;i<sensorLog.length;i++){
        grid2[sensorLog[i].position[0]][sensorLog[i].position[1]][1] += 1
        if(sensorLog[i].beep){
            grid2[sensorLog[i].position[0]][sensorLog[i].position[1]][0] += 1
        }
    }
    const grid3 = grid2.map(row => row.map(([a,b]) => b>0 ? getRGBColorFromValue(a/b) : -1))

    function getRGBColorFromValue(value) {
        const clamped = Math.max(0, Math.min(1, value));
        let r;
        if(value===0){
            return `rgb(255,0,0,${1-value})`
        }
        const g = Math.round(255 * clamped);
        return `rgb(0,200,0,${value})`;
      }

    return(
    <div className='container'>
        {grid.map((row,i)=>(
                row.map((cell,j) => {
                    let bgColor = '';
                    const mod = cell%10;
                    if(mod===1){
                        bgColor = 'black'
                    } else if(mod===3){
                        bgColor = 'seashell'
                    }
                    if(grid3[i][j]!==-1&&props.showSenses){
                        bgColor = grid3[i][j]
                    }
                    if(props.hoverIndex){
                        if(i===props.hoverIndex[0]&&j==props.hoverIndex[1]){
                            bgColor = grid3[i][j].charAt(4)==='0' ? 'green' : 'red';
                    }}
                    return (<><div key={i.toString()+','+j.toString()} 
                    className= 'item'
                    style={{
                        backgroundColor: bgColor
                    }}
                    >
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