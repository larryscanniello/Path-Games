import '../../Styles/flame.css'

export default function RenderGridSeeBots(props){
    const currentTurn = props.currentTurn
    const grid = props.fireGrid.map(row=>[...row])
    const indices = props.indices
    for(let i=0;i<indices.length;i++){
      if(indices[i]){
        grid[indices[i][0]][indices[i][1]] += 2 ** (3+i)
      }
    }

    return(
    <div className="grid grid-rows-25 grid-cols-25">
        {grid.map((row,i)=>(
                row.map((g,j) => {
                let bgColor = '';
                if(g===0||g>=8){
                    bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/wool_colored_white.png')]"
                  }
                  if(g===1){
                    bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/glass.png')]"
                  }
                  if(g&4){
                    bgColor = "w-8 h-8 bg-[url('/suppresor2.png')]"
                  }
                    return (<>
                        {!(g&2) ? <div
                          key={i*25+j}
                          className={`w-8 h-8 relative flex items-center justify-center ${bgColor}`}
                          style={{backgroundSize: '32px 32px'}}>
                          {!!((g&8)||(g&16)||(g&32)||(g&64)||(g&128)||(g&256)) && <BotSlot
                            indices = {props.indices}
                            difficulty = {props.difficulty}
                            playerIndex={props.playerIndex}
                            currentTurn={props.currentTurn}
                            result={props.result}
                            i={i}
                            j={j}
                          />}
                        </div>
                        : <div className='container'><div
                          key={i*25+j}
                          className={`open-sq`}
                        >
                          {!!((g&8)||(g&16)||(g&32)||(g&64)||(g&128)||(g&256)) && <BotSlot
                            check = {0}
                            indices = {props.indices}
                            playerIndex={props.playerIndex}
                            currentTurn={props.currentTurn}
                            result={props.result}
                            i={i}
                            j={j}
                          />}
                        </div><div className='fire-sprite'></div></div>}
                        </>
                      );})
        ))}
    </div>)
}

function BotSlot(props){
    const [bot1index,bot2index,bot3index,bot4index,successpossibleindex,playerindex] = props.indices
    const botsInSpace = []
    if(props.result!=='forfeit'){
      if(playerindex[0]==props.i&& playerindex[1]==props.j){
        botsInSpace.push({id: 0, className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black"})
    }
    }
    
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