import { USERNAME } from "../../constants"
import '../../Styles/mouse.css'
import {motion, AnimatePresence} from 'framer-motion'
import React from "react"


export default function RenderGridSeeBots(props){
    if(!props.grid) return <p>Loading...</p>
    const grid = props.grid.map(rows => [...rows])
    const turn = props.turn    
    const showProbabilities = props.showProbabilities
    const username = localStorage.getItem(USERNAME)

    function roundTo4DecimalPlaces(number) {
        const factor = Math.pow(10, 4);
        return Math.round(number * factor) / factor;
      }

    const indices = props.indices
    const plans = props.plans


    for(let i=0;i<6;i++){
        grid[indices[i][0]][indices[i][1]] += 2 ** (i+5)
    }
    
    for(let i=0;i<plans.length;i++){
        if(plans[i]){
            if(plans[i].length>0){
                for(let j=0;j<plans[i].length;j++){
                    if(plans[i][j]){
                        grid[plans[i][j][0]][plans[i][j][1]] += 2 ** (i+1)
                    }
                }
            }
        }    
    }
    const states = props.states
    const showAgent = props.showAgent

    return(
    <div className='grid bg-black grid-rows-25 grid-cols-25'>
        {grid.map((row,i)=>(<React.Fragment key={i}>
                {row.map((g,j) => {
                    let bgColor = '';
                    if(g==0||g>1){
                        bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/wool_colored_white.png')]"
                    }
                    if(g==1){
                        bgColor = "w-8 h-8 bg-[url('/space_tiles_hyptosis/glass.png')]"
                    }

                    if(g&2**1 && showAgent[0]&&turn<=props.simlengths[0]-1){
                        bgColor += ' border-2 border-cyan-100 '
                    }
                    if(turn>0){
                        if(g&2**2 && showAgent[1]&&turn<=props.simlengths[1]-1&&turn>0){
                        bgColor += ' border-2 border-cyan-100 '
                    }}
                    if(g&2**3 && showAgent[2]&&turn<=props.simlengths[2]-1){
                        bgColor += ' border-2 border-cyan-100 '
                    }
                    if(g&2**4 && showAgent[3]&&turn<=props.simlengths[3]-1){
                        bgColor += ' border-2 border-cyan-100 '
                    }

                    const condition0 = showAgent[0]&&(g&2||g&2**5)
                    const condition1 = showAgent[1]&&(g&4||g&2**6)
                    const condition2 = showAgent[2]&&(g&8||g&2**7)
                    const condition3 = showAgent[3]&&(g&16||g&2**8)
                    const condition4 = g>=2**9

                    return (<><div 
                    key={j} 
                    className={`w-8 h-8 relative ${bgColor}`}
                    style={{
                        fontSize: "8px",
                        backgroundSize: '32px 32px'
                    }}
                    >
                    {!!showProbabilities&& <div className="text-black fixed"> {roundTo4DecimalPlaces(states[showProbabilities][i][j])}</div>}
                    {(condition0||condition1||condition2||condition3||condition4)&&<BotSlot 
                            g={g}
                            stoch = {props.stoch}
                            paths = {props.paths}
                            player_path = {props.player_path} 
                            plans = {props.plans}
                            turn={props.turn}
                            botplans={props.plans} 
                            mouse_starting_index = {props.mouse_starting_index}
                            mouse_path = {props.mouse_path}
                            bot_starting_index = {props.bot_starting_index}
                            indices = {props.indices}
                            showAgent = {props.showAgent}
                            username={username}
                            frameIndex={props.frameIndex}
                            directionFrames = {props.directionFrames}
                            result = {props.result}
                            simlengths = {props.simlengths}
                            flashList = {props.flashList}
                            />}
                    </div>
                    </>
                )})
            }</React.Fragment>))}
    </div>)
}

function BotSlot(props){
    const showAgent = props.showAgent;
    const turn = props.turn;
    const g = props.g;
    const flashList = props.flashList;
    const simlengths = props.simlengths
    
    const botsInSpace = []
    if(g&2**5 &&showAgent[0]){
        const bot1obj = { id: 1, isDimmed: turn > simlengths[0]-1, className:"absolute top-0 left-0 w-3 h-3 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center border border-black"}
        botsInSpace.push(bot1obj)
    }
    if(g&2**6 &&showAgent[1]){
        const bot2obj = { id: 2, isDimmed: turn> simlengths[1]-1,className:"absolute top-0 right-0 w-3 h-3 rounded-full bg-green-600 text-white text-xs flex items-center justify-center border border-black"}
        botsInSpace.push(bot2obj)
    }
    if(g&2**7 &&showAgent[2]){
        const bot3obj = { id: 3, isDimmed: turn> simlengths[2]-1, className:"absolute bottom-0 left-0 w-3 h-3 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center border border-black"}
        botsInSpace.push(bot3obj)
    }
    if(g&2**8 &&showAgent[3]){
        const bot4obj = { id: 4, isDimmed: turn> simlengths[3]-1, className:"absolute bottom-0 right-0 w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black"}
        botsInSpace.push(bot4obj)
    }
    if(props.result!=='forfeit'){
        if(g&2**9 &&showAgent[4]){
            const playerobj = {id: 0, isDimmed: turn> simlengths[4]-2, className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-purple-500 border border-black"}
            botsInSpace.push(playerobj)
        }
    }
    if(g&2**1 &&props.showAgent[0]&&turn<=props.simlengths[0]-1){
        botsInSpace.push({ id: 11, className:"absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-yellow-600 text-white text-xs flex items-center justify-center"})
    }
    if(g&2**2 && props.showAgent[1]&&turn<=props.simlengths[1]-1&&turn>0){
        botsInSpace.push({ id: 12, className:"absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center"})
    }
    if(g&2**3 && props.showAgent[2]&&turn<=props.simlengths[2]-1){
        botsInSpace.push({ id: 13, className:"absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center"})
    }
    if(g&2**4 && props.showAgent[3]&&turn<=props.simlengths[3]-1){
        botsInSpace.push({ id: 14, className:"absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center"})
    }
    return <AnimatePresence>
        {flashList.map((arr,i)=> !!(g&2**(5+i))&&showAgent[i] && arr.map(flash=> {
        return <motion.div
        key={flash.id}
        className={`absolute rounded-full ${flash.color} opacity-60 z-20`}
        style={{
            top: flash.flashPosition.top,
            left: flash.flashPosition.left,
            transform: "translate(-50%, -50%)", // centers the flash on that point
            width: '24px',
            height: '24px',
          }}
        initial={{ scale: .5, opacity: .8 }}
        animate={{ scale: 2, opacity: [0, 0.8, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: .3, ease: "easeOut" }} 
        /> }))}
        {/*botsInSpace.map((bot)=>{
            return bot.id <= 4 ? <div
            key = {bot.id}
            className={bot.className}
            
                >
            {!!(bot.id<6&&bot.id>0)&& bot.id}</div>
            : <div 
                className={bot.className}
                key={bot.id}
                >
                </div>})*/}
        {botsInSpace.map((bot)=>{
            return bot.id <= 4 ? <motion.div
            layout 
            layoutId={'bot ' + bot.id.toString()}
            key = {'bot ' + bot.id.toString()}
            className={bot.className}
            initial={{ opacity: .7 }}
            animate={{ opacity: bot.isDimmed ? 0.4 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
                layout: { duration: .03 },
                opacity: { duration: .03 }
                }}
                >
            {!!(bot.id<6&&bot.id>0)&& bot.id}</motion.div>
            : <div 
                className={bot.className}
                key={bot.id}
                >
                </div>})}
            {!!(g&2**10) && <div className={"open-sq mouse-sprite "+ props.directionFrames}></div>}
    </AnimatePresence>
}