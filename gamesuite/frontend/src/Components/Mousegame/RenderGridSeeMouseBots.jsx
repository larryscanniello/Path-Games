import { USERNAME } from "../../constants"


export default function RenderGridSeeBots(props){
    if(!props.data) return <p>Loading...</p>

    const grid = props.data.game.grid.map(rows => [...rows])
    const turn = props.turn    
    const showProbabilities = props.showProbabilities
    const bot4modechange = props.data.bot4.modechange
    const username = localStorage.getItem(USERNAME)

    function roundTo4DecimalPlaces(number) {
        const factor = Math.pow(10, 4);
        return Math.round(number * factor) / factor;
      }
    
    function processFromFlatIndexBot3and4(botplans, t) {
        let count = 0;
        for (let i = 0; i < botplans.length; i++) {
            const row = botplans[i];
            if(row.length==0&&count>0){
                count +=1;
                continue; 
            }
            if (t < count + row.length) {
                let startIndexInRow;
                startIndexInRow = t-count;
                if(startIndexInRow<0){
                    return [null];
                }
                return row.slice(startIndexInRow);
            }
            if(i==0){
                continue;
            }
            else{
                count += row.length+1
            }
        }
        return []
    }
    function processFromFlatIndexBot3(botplans, t) {
        let count = 0;
        for (let i = 0; i < botplans.length; i++) {
            const row = botplans[i];
            if (t < count + row.length) {
                let startIndexInRow;
                startIndexInRow = t-count;
                if(startIndexInRow<0){
                    return [null];
                }
                return row.slice(startIndexInRow);
            }
            count += row.length+1
        }
        return []
    }
    const bot1plan = processFromFlatIndexBot3(props.data.bot1.plans,turn-1)
    const bot2plan = props.data.bot2.plans
    const bot3plan = processFromFlatIndexBot3(props.data.bot3.plans,turn-1)
    const bot4plan = processFromFlatIndexBot3and4(props.data.bot4.plans,turn-6)


    const currindex = props.data.bot4.turn
    let bot1index,bot2index,bot3index,bot4index;
    if(turn!==0){
        const bot1path = props.data.bot1.path
        const bot2path = props.data.bot2.path
        const bot3path = props.data.bot3.path
        const bot4path = props.data.bot4.path
        bot1index = bot1path[Math.min(turn-1,bot1path.length-1)]
        bot2index = bot2path[Math.min(turn-1,bot2path.length-1)]
        bot3index = bot3path[Math.min(turn-1,bot3path.length-1)]
        bot4index = bot4path[Math.min(turn-1,bot4path.length-1)]
    }
    else{
        bot4index = props.data.game.bot_starting_index;
    }

    bot1plan.push(bot1index);
    bot2plan[Math.min(Math.max(0,turn-1),bot2plan.length-1)].push(bot2index);
    bot3plan.push(bot3index);
    bot4plan.push(bot4index);

    const states = ['',props.data.bot1.states,
                    props.data.bot2.states,
                    props.data.bot3.states,
                    props.data.bot4.states]
    return(
    <div className='grid bg-black grid-rows-25 grid-cols-25'>
        {grid.map((row,i)=>(
                row.map((cell,j) => {
                    let bgColor = '';
                    const mod = cell%10;
                    if(mod==0){
                        bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/wool_colored_white.png')]"
                    }
                    if(mod==1){
                        bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/glass.png')]"
                    }
                    /*
                    if(mod===1){
                        if(i<24){
                            if(grid[i+1][j]!==1){
                                bgColor += 'bg-black border-b border-cyan-100 '
                        }}
                        if(i>0){
                        if(grid[i-1][j]!==1){
                            bgColor += 'bg-black border-t border-cyan-100 '
                        }}
                        if(j<24){
                        if(grid[i][j+1]!==1){
                            bgColor += 'bg-black border-r border-cyan-100 '
                        }}
                        if(j>0){
                        if(grid[i][j-1]!==1){
                            bgColor += 'bg-black border-l border-cyan-100 '
                        }}
                    }else if(mod===3){
                        bgColor = 'bg-yellow-100 border border-cyan-100'
                    }else{
                        bgColor = 'bg-gray-400 border border-cyan-100'
                    }
                    */
                    if(props.showAgent[0]&&turn<=props.data.bot1.evidence.length-1&&bot1plan.some(subarray=>{
                        if(subarray){
                            return subarray[0]==i&&subarray[1]==j
                        }else{
                            return false;
                    }})){
                        bgColor += ' border-2 border-cyan-100'//'bg-yellow-100 border border-cyan-100'
                    }
                    if(turn>0){
                        if(props.showAgent[1]&&turn<=props.data.bot2.evidence.length-1&&turn>0&&bot2plan[turn-1].some(subarray=>{
                            if(subarray){
                                return subarray[0]==i&&subarray[1]==j
                            }else{
                                return false;
                    }})){
                        bgColor += ' border-2 border-cyan-100'//'bg-green-300 border border-cyan-100'
                    }}
                    if(props.showAgent[2]&&turn<=props.data.bot3.evidence.length-1&&bot3plan.some(subarray=>{
                        if(subarray){
                            return subarray[0]==i&&subarray[1]==j
                        }else{
                            return false;
                    }})){
                        bgColor += ' border-2 border-cyan-100'//'bg-indigo-300 border border-cyan-100'
                    }
                    if(props.showAgent[3]&&turn<=props.data.bot4.evidence.length-1&&bot4plan.some(subarray=>{
                        if(subarray){
                            return subarray[0]==i&&subarray[1]==j
                        }else{
                            return false;
                    }})){
                        bgColor += ' border-2 border-cyan-200'//'bg-red-300 border border-cyan-100'
                    }
                    
                    return (<><div 
                    key={j} 
                    className={`w-8 h-8 relative ${bgColor}`}
                    style={{
                        fontSize: "8px",
                        backgroundSize: '32px 32px'
                    }}
                    >
                    <div className="text-black fixed">{props.showProbabilities ? roundTo4DecimalPlaces(states[showProbabilities][Math.min(props.turn,states[showProbabilities].length-1)][i][j]) : ''}</div>
                    <BotSlot data={props.data} 
                            turn={props.turn}
                            botplans={[bot1plan,bot2plan,bot3plan,bot4plan]} 
                            i={i} 
                            j={j}
                            showAgent = {props.showAgent}
                            username={username}
                            frameIndex={props.frameIndex}
                            directionFrames = {props.directionFrames}/>
                    </div>
                    </>
                )})
        ))}
    </div>)
}

function BotSlot(props){
    const showAgent = props.showAgent
    const turn = props.turn
    let bot1index,bot2index,bot3index,bot4index,mouse_index,player_index;
    const [bot1path,bot2path,bot3path,bot4path] = [props.data.bot1.path,props.data.bot2.path,props.data.bot3.path,props.data.bot4.path]
    const [bot1plan,bot2plan,bot3plan,bot4plan] = [props.botplans[0],props.botplans[1],props.botplans[2],props.botplans[3]]
    const player_path = props.data.game.player_path
    if(turn!==0){
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
        player_index = player_path[Math.min(turn-1,player_path.length-1)]

    } else{
        bot4index = props.data.game.bot_starting_index
        bot1index = bot2index = bot3index = player_index = bot4index 
        mouse_index = props.data.game.mouse_starting_index
    }
    
    const botsInSpace = []
    /*if(mouse_index[0]===props.i && mouse_index[1]===props.j){
        botsInSpace.push({ id: 0, className: {top: '50%', left:'50%', transform: 'translate(-50%, -50%)' }, color: 'red'})
    }*/
    if(bot1index[0]==props.i && bot1index[1]==props.j&&showAgent[0]){
        const bot1obj = { id: 1, className:"absolute top-0 left-0 w-3 h-3 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center border border-black"}
        if(turn>bot1path.length-1&&props.data.game.stoch){
            bot1obj.className += " opacity-40"
        }
        botsInSpace.push(bot1obj)
    }
    if(bot2index[0]==props.i && bot2index[1]==props.j&&showAgent[1]){
        const bot2obj = { id: 2, className:"absolute top-0 right-0 w-3 h-3 rounded-full bg-green-600 text-white text-xs flex items-center justify-center border border-black"}
        if(turn>bot2path.length-1&&props.data.game.stoch){
            bot2obj.className += " opacity-40"
        }
        botsInSpace.push(bot2obj)
    }
    if(bot3index[0]==props.i && bot3index[1]==props.j&&showAgent[2]){
        const bot3obj = { id: 3, className:"absolute bottom-0 left-0 w-3 h-3 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center border border-black"}
        if(turn>bot3path.length-1&&props.data.game.stoch){
            bot3obj.className += " opacity-40"
        }
        botsInSpace.push(bot3obj)
    }
    if(bot4index[0]==props.i && bot4index[1]==props.j&&showAgent[3]){
        const bot4obj = { id: 4, className:"absolute bottom-0 right-0 w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black"}
        if(turn>bot4path.length-1&&props.data.game.stoch){
            bot4obj.className += " opacity-40"
        }
        botsInSpace.push(bot4obj)
    }
    if(player_index[0]==props.i&& player_index[1]==props.j&&showAgent[4]){
        const playerobj = {id: 0, className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black"}
        if(turn>player_path.length-1&&props.data.game.stoch){
            playerobj.className += " opacity-40"
        }
        botsInSpace.push(playerobj)
    }
    if(props.showAgent[0]&&turn<=props.data.bot1.evidence.length-1&&bot1plan.some(subarray=>{
        if(subarray){
            return subarray[0]==props.i&&subarray[1]==props.j&&!(props.i===bot1index[0]&&props.j===bot1index[1])
        }else{
            return false;
    }})){
        botsInSpace.push({ id: 11, className:"absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center"})
    }
    if(props.showAgent[1]&&turn<=props.data.bot2.evidence.length-1&&turn>0&&bot2plan[turn-1].some(subarray=>{
        if(subarray){
            return subarray[0]==props.i&&subarray[1]==props.j&&!(props.i===bot2index[0]&&props.j===bot2index[1])
        }else{
            return false;
    }})){
        botsInSpace.push({ id: 12, className:"absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center"})
    }
    if(props.showAgent[2]&&turn<=props.data.bot3.evidence.length-1&&bot3plan.some(subarray=>{
        if(subarray){
            return subarray[0]==props.i&&subarray[1]==props.j&&!(props.i===bot3index[0]&&props.j===bot3index[1])
        }else{
            return false;
    }})){
        botsInSpace.push({ id: 13, className:"absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center"})
    }
    if(props.showAgent[3]&&turn<=props.data.bot3.evidence.length-1&&bot4plan.some(subarray=>{
        if(subarray){
            return subarray[0]==props.i&&subarray[1]==props.j&&!(props.i===bot4index[0]&&props.j===bot4index[1])
        }else{
            return false;
    }})){
        botsInSpace.push({ id: 14, className:"absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center"})
    }

    return(<div className="relative w-full h-full">
        {botsInSpace.map((bot,i)=>(
            <div
                key = {bot.id}
                className={bot.className}
                >
            {(bot.id<6&&bot.id>0)&& bot.id}</div>))}{(mouse_index[0]===props.i&&mouse_index[1]===props.j)&&<img src={`/mouse/sprite_${props.directionFrames[props.frameIndex]}.png`}/>}
    </div>)

}