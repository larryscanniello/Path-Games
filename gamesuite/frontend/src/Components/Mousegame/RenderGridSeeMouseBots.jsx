
export default function RenderGridSeeBots(props){
    if(!props.data) return <p>Loading...</p>

    const grid = props.data.game.grid.map(rows => [...rows])
    const turn = props.turn    
    const showBot3Probabilities = props.showBot3Probabilities

    function roundTo4DecimalPlaces(number) {
        const factor = Math.pow(10, 4);
        return Math.round(number * factor) / factor;
      }
    
    function processFromFlatIndex(botplans, t) {
    let count = 0;
    for (let i = 0; i < botplans.length; i++) {
        const row = botplans[i];
        if (t < count + row.length) {
            const startIndexInRow = t - count;
            return row.slice(startIndexInRow);
        }
        if(i==0){
            count += row.length
        }
        else{
            count += row.length+1
        }
    }
    throw new Error("Turn t is out of range of botplans");
    }
    if(turn>5){
        const row = processFromFlatIndex(props.data.bot4.plans,props.turn-6)
        for(let i=0;i<row.length;i++){
            if(row[i]!==null){
                grid[row[i][0]][row[i][1]] += 3
            }
        const currindex = props.data.bot4.turn
    }}
    let bot4index;
    if(turn!==0){
        const bot4path = props.data.bot4.evidence.map(([t,type,[i,j]])=> [i,j])
        bot4index = bot4path[Math.min(turn-1,bot4path.length-1)]
    }
    else{
        bot4index = props.data.game.bot_starting_index;
    }
    grid[bot4index[0]][bot4index[1]] +=3
    return(
    <div className='container'>
        {grid.map((row,i)=>(
                row.map((cell,j) => {
                    let bgColor = '';
                    const mod = cell%10;
                    if(mod===1){
                        bgColor = 'black'
                    } else if(mod===2){
                        bgColor = 'green'
                    } else if(mod==3){
                        bgColor = 'aliceblue'
                    }
                    return (<><div 
                    key={j} 
                    className='item'
                    style={{
                        backgroundColor: bgColor,
                        fontSize: "8px",
                    }}
                    >
                    <BotSlot data={props.data} turn={props.turn} showBot3Probabilities={showBot3Probabilities} i={i} j={j}/>
                    {props.showBot3Probabilities ? roundTo4DecimalPlaces(props.data.bot4.states[props.turn][i][j]) : ''}</div>
                    </>
                )})
        ))}
    </div>)
}

function BotSlot(props){
    const turn = props.turn
    let bot1index,bot2index,bot3index,bot4index,mouse_index;
    if(turn!==0){
        const bot1path = props.data.bot1.evidence.map(([t,type,[i,j]])=> [i,j])
        const bot2path = props.data.bot2.evidence.map(([t,type,[i,j]])=> [i,j])
        const bot3path = props.data.bot3.evidence.map(([t,type,[i,j]])=> [i,j])
        const bot4path = props.data.bot4.evidence.map(([t,type,[i,j]])=> [i,j])

        if(!props.data.game.stoch){
            mouse_index = props.data.game.mouse_starting_index
        }else{
            const mouse_path = props.data.game.mouse_path
            mouse_index = mouse_path[Math.min(turn-1,mouse_path.length-1)]
        }
      
        bot1index = bot1path[Math.min(turn-1,bot1path.length-1)]
        bot2index = bot2path[Math.min(turn-1,bot2path.length-1)]
        bot3index = bot3path[Math.min(turn-1,bot3path.length-1)]
        bot4index = bot4path[Math.min(turn-1,bot4path.length-1)]

    } else{
        bot4index = props.data.game.bot_starting_index
        bot1index = bot2index = bot3index = bot4index
        mouse_index = props.data.game.mouse_starting_index
    }
    
    const botsInSpace = []
    if(mouse_index[0]===props.i && mouse_index[1]===props.j){
        botsInSpace.push({ id: 0, position: {top: '50%', left:'50%', transform: 'translate(-50%, -50%)' }, color: 'red'})
    }

    
    /*if(bot1index[0]==props.i && bot1index[1]==props.j){
        botsInSpace.push({ id: 1, position: { top: '2px', left: '2px' }, color: 'blue' })
    }
    if(bot2index[0]==props.i && bot2index[1]==props.j){
        botsInSpace.push({ id: 2, position: { top: '2px', right: '2px' }, color: 'purple' })
    }*/
    if(bot4index[0]==props.i && bot4index[1]==props.j){
        botsInSpace.push({ id: 3, position: { bottom: '2px', left: '2px' }, color: 'orange' })
    }


    const botStyle = {
        position: 'absolute',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: 'blue',
    };



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