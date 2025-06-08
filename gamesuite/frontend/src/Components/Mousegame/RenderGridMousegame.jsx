import '../../Styles/mouse.css'
import {motion,AnimatePresence} from 'framer-motion'
import { useWindowSize } from '../useWindowSize'
import '../../Styles/mouse.css'

export default function RenderGridMousegame(props){
    if(!props.grid) return <p>Loading...</p>
    const grid = props.grid.map(row=>[...row])
    const sensorcounts = props.sensorCounts;
    const turn = props.turn;
    const playerIndex = props.playerIndex;
    const bot4index = props.bot4index;
    const mouseIndex = props.mouseIndex;
    const playerPath = props.playerPath;
    const sensorLog = props.sensorLog;
    const colors = props.colors;
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

      const getMouseSprites = () => {
        if(width<1000||height<785) return "mouse-sprite-2";
        if(width<1100||height<900) return "mouse-sprite-1";
        return "mouse-sprite-0"
      }

    const getMouseWindowNumber = () => {
        if(width<1000||height<785) return "2";
        if(width<1100||height<900) return "1";
        return "0"
        }
    

    if(props.seePath){
        for(let i=0;i<playerPath.length;i++){
            grid[playerPath[i][0]][playerPath[i][1]]= 2
        }
    }
    grid[playerIndex[0]][playerIndex[1]] += 4
    grid[bot4index[0]][bot4index[1]] += 8
    grid[mouseIndex[0]][mouseIndex[1]] += 64
    for(let i=0;i<colors.length;i++){
        for(let j=0;j<colors[i].length;j++){
            if(colors[i][j]!==-1){
                grid[i][j]+=16
            }
        }
    }
    if(props.hoverIndex){
        grid[props.hoverIndex[0][0]][props.hoverIndex[0][1]]+=32
    }
    return(
    <div className="grid bg-black grid-rows-25 grid-cols-25">
        {grid.map((row,i)=>(
                row.map((g,j) => {
                    let bgColor = '';
                    if(g==0||g>1){
                       bgColor = "bg-[url('/space_tiles_hyptosis/wool_colored_white.png')]"
                    }
                    if(g==1){
                        bgColor = "bg-[url('/space_tiles_hyptosis/glass.png')]"
                    }
                    if(g&2){
                        bgColor = "border border-gray-400 bg-amber-100"
                    }
                    if(g&16 && props.showSenses){
                        bgColor = colors[i][j]
                    }
                    if(props.hoverIndex){
                        if(g&32){
                            bgColor = props.hoverIndex[1] ? 'border border-gray bg-green-500' : 'border border-gray bg-red-500';
                    }}
                    
                return (<div key={i*25 +j} 
                    className= {`${getTileSize()} ${bgColor}`}
                    style={{ backgroundSize: `${getBackgroundSize()}` }}
                    >
                    <div className={`${getTileSize()} top-0 left-0`}>
                        <div className="text-black text-[9px] fixed">{(sensorcounts[i][j][1]!==0&&props.showSenses)&&`${sensorcounts[i][j][0]}/${sensorcounts[i][j][1]}`}</div>
                        {!!(g&4||g&8||g&64) && <BotSlot
                                data={props.data} 
                                playerIndex={props.playerIndex} 
                                turn={turn} 
                                i={i} 
                                j={j}
                                frameIndex = {props.frameIndex}
                                gameStatus = {props.gameStatus}
                                bot4index = {props.bot4index}
                                mouseIndex = {props.mouseIndex}
                                flashState = {props.flashState}
                                flashList = {props.flashList}
                                width={width}
                                height={height}/>}
                    </div>
                </div>
                )})
        ))}
    </div>)
}

function BotSlot(props){
    const playerIndex = props.playerIndex
    const bot4index = props.bot4index
    const width = props.width
    const height = props.height
    const mouseIndex = props.mouseIndex
    let botsInSpace = [] 

    const getMouseSprites = () => {
        if(width<1000||height<785) return "mouse-sprite-2";
        if(width<1100||height<900) return "mouse-sprite-1";
        return "mouse-sprite-0"
      }

    const getMouseWindowNumber = () => {
        if(width<1000||height<785) return "2";
        if(width<1100||height<900) return "1";
        return "0"
    }

    if(bot4index[0]===props.i && bot4index[1]===props.j){
        if(playerIndex[0]===props.i && playerIndex[1]===props.j){
            const bot4obj = { id: 4, className:"absolute top-1/2 left-2/7 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black z-30"}
            const playerobj = {id: 0, className:"absolute top-1/2 left-5/7 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black z-30"}
            botsInSpace.push(bot4obj)
            botsInSpace.push(playerobj)
        }else{
            const bot4obj = { id: 4, className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black z-30"}
            botsInSpace.push(bot4obj)
        }
    }
    if(playerIndex[0]===props.i && playerIndex[1]===props.j&&!(bot4index[0]===props.i && bot4index[1]===props.j)){
        const playerobj = {id: 0, className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black"}
        botsInSpace.push(playerobj)
    }

    let mouseclass = '';
    if(props.gameStatus!=='in_progress'&&props.mouseIndex[0]===props.i && props.mouseIndex[1]===props.j){
        botsInSpace.push({id: 6, className:'open-sq mouse-sprite anim-r'})
    }

    return(<AnimatePresence><div className="relative w-full h-full z-30">
        {(playerIndex[0] === props.i && playerIndex[1] === props.j) && props.flashList.map(flash=>
                    <motion.div
                        key={flash.id}
                        className={`absolute inset-0 rounded-full ${flash.color} opacity-60 z-20`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 2, opacity: [0, 0.8, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }} 
                    />
                )}{/**/}
        {botsInSpace.map((bot,i)=>(
            <motion.div
            layout
            layoutId={'bot ' + bot.id.toString()}
            key = {'bot ' + bot.id.toString()}
            className={bot.className}
            initial={{ opacity: .7 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
                layout: { duration: .02 },
                opacity: { duration: 1 }
                }}
                >
            {(bot.id!==0&&bot.id!==6) && bot.id}</motion.div>))}
            {(props.gameStatus!=='in_progress' && props.i==mouseIndex[0] && props.j==mouseIndex[1]) && <div className={`open-sq ${getMouseSprites()} anim-r-${getMouseWindowNumber()}`}></div>}
    </div></AnimatePresence>)
}