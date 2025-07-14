import '../../Styles/flame.css'
import { AnimatePresence,motion } from 'framer-motion'
import {useWindowSize} from "../useWindowSize"

export default function RenderGridSeeBots(props){
    const currentTurn = props.currentTurn
    const grid = props.fireGrid.map(row=>[...row])
    const indices = props.indices
    const [width,height] = useWindowSize();

    const getTileSize = () => {
      if(width<1000||height<785) return "w-6 h-6"
      if(width<1100||height<900) return "w-7 h-7";
      return "w-8 h-8"
    }

    const getBackgroundSize = () => {
      if(width<1000||height<785) return "24px 24px";
      if(width<1100||height<900) return "28px 28px";
      return "32px 32px"
    }

    const getFireSprite = () => {
      if(width<1000||height<785) return 'fire-sprite-2'
      if(width<1100||height<900) return 'fire-sprite-1'
      return "fire-sprite-0"
    }

    const getFireSqBackground = () => {
      if(width<1000||height<785) return 'open-sq-2'
      if(width<1100||height<900) return 'open-sq-1'
      return "open-sq-0"
    }


    for(let i=0;i<indices.length;i++){
      if(indices[i]){
        grid[indices[i][0]][indices[i][1]] += 2 ** (3+i)
      }
    }


    /*
    +1 - closed cell
    +2 - fire square
    +4 - supressor
    +>=8 - one of the bots or player (the encoding of individual bots doesnt really do anything - which bot is which is determined
     in the BotSlot component using i,j , not the encoding. No harm in keeping it like this though)
    Binary representations are used. So 10=2+8 is a fire square with bot 3, etc.
    */

    return(
    <div>
    <div className="grid grid-rows-25 grid-cols-25 shadow-[0_0_12px_rgba(34,211,238,0.2)] border-b-2 border-t-1 border-l-3 border-r-3 border-cyan-400/30">
        {grid.map((row,i)=>(
                row.map((g,j) => {
                let bgColor = '';
                if(g===0||g>=8){
                    bgColor = "bg-[url('/space_tiles_hyptosis/wool_colored_white.png')] "
                  }
                  if(g===1){
                    bgColor = "bg-[url('/space_tiles_hyptosis/glass.png')]"
                  }
                  if(g&4){
                    bgColor = "bg-[url('/suppresor2.png')]"
                  }
                  
                    return (<>
                        {!(g&2) ? <div
                          key={i*25+j}
                          className={`${getTileSize()} relative flex items-center justify-center ${bgColor}`}
                          style={{backgroundSize: `${getBackgroundSize()}`}}>
                          {/*Again, the actual values of g>=8 are meaningless here. 
                          But BotSlot only gets processed if there's actually a bot there,
                          which improves performance*/}
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
                          className={`${getFireSqBackground()}`}
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
                        </div><div className={`${getFireSprite()}`}></div></div>}
                        </>
                      );})
        ))}
    </div></div>)
}

function BotSlot(props){
    const [bot1index,bot2index,bot3index,bot4index,successpossibleindex,playerindex] = props.indices
    const botsInSpace = []
    //This component manually checks each bot index to see if this is the botslot corresponding to that index

    //If result is forfeit then there is no player data, so we only read playerIndex if the result is forfeit
    if(props.result!=='forfeit'){
      if(playerindex[0]==props.i&& playerindex[1]==props.j){
        botsInSpace.push({id: 0, className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black z-20"})
    }
    }
    //There is only success possible bot if difficulty is hard
    if(props.difficulty==='hard'){
        if(successpossibleindex[0]===props.i && successpossibleindex[1]===props.j){
            botsInSpace.push({ id: 5, className:"absolute top-0 left-0 w-3 h-3 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center border border-black z-10"})
        }
    }
    else{
        if(bot1index[0]==props.i && bot1index[1]==props.j){
            botsInSpace.push({ id: 1, className:"absolute top-0 left-0 w-3 h-3 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center border border-black z-10"})
        }
    }
    if(bot2index[0]==props.i && bot2index[1]==props.j){
        botsInSpace.push({ id: 2, className:"absolute top-0 right-0 w-3 h-3 rounded-full bg-green-600 text-white text-xs flex items-center justify-center border border-black z-10"})
    }
    if(bot3index[0]==props.i && bot3index[1]==props.j){
        botsInSpace.push({ id: 3, className:"absolute bottom-0 left-0 w-3 h-3 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center border border-black z-10"})
    }
    if(bot4index[0]==props.i && bot4index[1]==props.j){
        botsInSpace.push({ id: 4, className:"absolute bottom-0 right-0 w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black z-10"})
    }

    return(<AnimatePresence><div className="relative w-full h-full">
        {botsInSpace.map((bot)=>(
            <div><motion.div
                layoutId={'bot ' + bot.id.toString()}
                key = {bot.id}
                className={bot.className}
                initial={{ opacity: .7 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                    layout: { duration: .02 },
                    opacity: { duration: 1 }
                    }}
                >{(bot.id!==0) && bot.id}</motion.div>
            </div>
        ))}
    </div></AnimatePresence>)

}