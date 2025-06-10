import '../../Styles/flame.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowSize } from '../useWindowSize';


export default function RenderGridFiregame(props){
    const [width,height] = useWindowSize()

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

    const fireGrid = props.fireGrid
    return (
        <div>
          <div className="grid bg-black grid-rows-25 grid-cols-25">
            {fireGrid.map((row, i) =>
              row.map((cell, j) => {
                let bgColor = '';
                const mod = cell % 10;
                if(mod===0){
                  bgColor = "bg-[url('/space_tiles_hyptosis/wool_colored_white.png')]"
                }
                if(mod===1){
                  bgColor = "bg-[url('/space_tiles_hyptosis/glass.png')]"
                }
                if(mod===5){
                  bgColor = "border-green-300 bg-[url('/suppresor2.png')]"
                }
                
                return (<div key={`${i},${j}`}>
                  {mod!==2 ? <div
                    key={i*25+j}
                    className={`${getTileSize()} relative flex items-center justify-center ${bgColor}`}
                    style={{backgroundSize: `${getBackgroundSize()}`}}
                  >
                    <BotSlot
                      data={props.data}
                      playerIndex={props.playerIndex}
                      currentTurn={props.currentTurn}
                      i={i}
                      j={j}
                    />
                  </div>:<div className='container'><div
                    key={`${i+25},${j+25}`}
                    className={`${getFireSqBackground()}`}
                  >
                    <BotSlot
                      data={props.data}
                      playerIndex={props.playerIndex}
                      currentTurn={props.currentTurn}
                      i={i}
                      j={j}
                    />
                  </div><div className={`${getFireSprite()}`}></div></div>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
}

function BotSlot(props){
    const playerIndex = props.playerIndex
    const isPlayerHere = playerIndex[0] === props.i && playerIndex[1] === props.j;

    return(<AnimatePresence>
        {isPlayerHere && (
                <motion.div
                    layoutId="player"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black z-10"
                    initial={{ opacity: .7 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                        layout: { duration: .01 },
                        opacity: { duration: 1 }
                    }}
                />
            )}
    </AnimatePresence>

    )
}