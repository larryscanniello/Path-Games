
export default function RenderGridSeeBots(props){
    if(!props.data) return <p>Loading...</p>

    const grid = props.data.game.grid
    const turn = props.turn    

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
                    }
                    return (<><div 
                    key={j} 
                    className='item'
                    style={{
                        backgroundColor: bgColor
                    }}
                    >
                    <BotSlot data={props.data} turn={props.turn} i={i} j={j}/></div>
                    </>
                )})
        ))}
    </div>)
}

function BotSlot(props){
    const turn = props.turn
    let bot1index,bot2index,bot3index,mouse_index;
    if(turn!==0){
        const bot1path = props.data.bot1.evidence.map(([t,type,[i,j]])=> [i,j])
        const bot2path = props.data.bot2.evidence.map(([t,type,[i,j]])=> [i,j])
        const bot3path = props.data.bot3.evidence.map(([t,type,[i,j]])=> [i,j])
        if(!props.data.game.stoch){
            mouse_index = props.data.game.mouse_starting_index
        }else{
            const mouse_path = props.data.game.mouse_path
            mouse_index = mouse_path[Math.min(turn-1,mouse_path.length-1)]
        }
      
        bot1index = bot1path[Math.min(turn-1,bot1path.length-1)]
        bot2index = bot2path[Math.min(turn-1,bot2path.length-1)]
        bot3index = bot3path[Math.min(turn-1,bot3path.length-1)]

    } else{
        bot3index = props.data.game.bot_starting_index
        bot1index = bot2index = bot3index
        mouse_index = props.data.game.mouse_starting_index
    }
    
    const botsInSpace = []
    if(mouse_index[0]===props.i && mouse_index[1]===props.j){
        botsInSpace.push({ id: 0, position: {top: '50%', left:'50%', transform: 'translate(-50%, -50%)' }, color: 'red' })
    }

    
    if(bot1index[0]==props.i && bot1index[1]==props.j){
        botsInSpace.push({ id: 1, position: { top: '2px', left: '2px' }, color: 'blue' })
    }
    if(bot2index[0]==props.i && bot2index[1]==props.j){
        botsInSpace.push({ id: 2, position: { top: '2px', right: '2px' }, color: 'purple' })
    }
    if(bot3index[0]==props.i && bot3index[1]==props.j){
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