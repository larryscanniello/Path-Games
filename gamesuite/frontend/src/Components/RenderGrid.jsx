import '../Styles/FiregameStyles.css'

export default function RenderGrid(props){
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
    <div className='container'>
        {grid.map((row,i)=>(
            <div key={i}>
                {row.map((cell,j) => {
                    let bgColor = '';
                    const mod = cell%10;
                    if(mod===2){
                        bgColor = 'red'
                    } else if(mod===1){
                        bgColor = 'black'
                    } else if(mod===5){
                        bgColor = 'green'
                    }
                    return (<><div 
                    key={j} 
                    className='item'
                    style={{
                        backgroundColor: bgColor
                    }}
                    >
                    <BotSlot data={props.data} currentTurn={props.currentTurn} i={i} j={j}/></div>
                    </>
                )})}
            </div>
        ))}
    </div>)
}

function BotSlot(props){
    const currentTurn = props.currentTurn
    let successpossibleindex,bot1index,bot2index,bot3index,bot4index;
    if(currentTurn!==0){
        const successpossiblepath = JSON.parse(props.data.successpossiblepath)
        const bot1path = JSON.parse(props.data.bot1path)
        const bot2path = JSON.parse(props.data.bot2path)
        const bot3path = JSON.parse(props.data.bot3path)
        const bot4path = JSON.parse(props.data.bot4path)
        
        successpossibleindex = successpossiblepath[Math.min(currentTurn-1,successpossiblepath.length-1)]
        bot1index = bot1path[Math.min(currentTurn-1,bot1path.length-1)]
        bot2index = bot2path[Math.min(currentTurn-1,bot2path.length-1)]
        bot3index = bot3path[Math.min(currentTurn-1,bot3path.length-1)]
        bot4index = bot4path[Math.min(currentTurn-1,bot4path.length-1)]
    } else{
        successpossibleindex = JSON.parse(props.data.bot_index)
        bot1index = bot2index = bot3index = bot4index = successpossibleindex
    }
    const botsInSpace = []
    if(successpossibleindex[0]===props.i && successpossibleindex[1]===props.j){
        botsInSpace.push({ id: 0, position: {top: '50%', left:'50%', transform: 'translate(-50%, -50%)' }, color: 'cyan' })
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
    if(bot4index[0]==props.i && bot4index[1]==props.j){
        botsInSpace.push({ id: 4, position: { bottom: '2px', right: '2px' }, color: 'green' })
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