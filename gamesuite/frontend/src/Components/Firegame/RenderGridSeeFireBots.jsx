
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
                if (mod === 2) {
                  /*img = '/../../public/pixelfire.png';*/
                  bgColor = 'bg-red-500 border-purple-400';
                } else if (mod === 1) {
                  bgColor = 'bg-black border-purple-400';
                } else if (mod === 5) {
                  bgColor = 'bg-green-700 border border-cyan-100';
                } else {
                  bgColor = 'bg-gray-400 border border-cyan-100';
                }
                    return (<><div 
                    key={j} 
                    className={`w-8 h-8 relative flex items-center justify-center ${bgColor}`}
                    style={{
                        backgroundColor: bgColor
                    }}
                    >
                    <BotSlot data={props.data} currentTurn={props.currentTurn} i={i} j={j} difficulty={props.difficulty}/></div>
                    </>
                )})
        ))}
    </div>)
}

function BotSlot(props){
    const currentTurn = props.currentTurn
    let successpossibleindex,bot1index,bot2index,bot3index,bot4index,playerindex;
    if(currentTurn!==0){
        const successpossiblepath = JSON.parse(props.data.successpossiblepath)
        const bot1path = JSON.parse(props.data.bot1path);
        const bot2path = JSON.parse(props.data.bot2path);
        const bot3path = JSON.parse(props.data.bot3path);
        const bot4path = JSON.parse(props.data.bot4path);
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
    if(playerindex[0]==props.i&& playerindex[1]==props.j){
        botsInSpace.push({id: 0, img:'./mouse.png'})
    }
    if(props.difficulty==='hard'){
        if(successpossibleindex[0]===props.i && successpossibleindex[1]===props.j){
            botsInSpace.push({ id: 5,className:"absolute top-0 left-0 w-3 h-3 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center border border-black"})
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

    /*return(<>{botsInSpace.map((bot)=>(
        <div
        key = {botsInSpace.id}
        style ={{
            ...botStyle,
            ...bot.position,
            backgroundColor: bot.color
        }}
        >{botsInSpace.id}</div>
    ))}</>

    )*/
}