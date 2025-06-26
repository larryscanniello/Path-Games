import NavBar from "../NavBar"
import { Link } from "react-router-dom"
import FiregameDifficultyMenu from "./FiregameDifficultyMenu"
import { USERNAME } from "../../constants"

export default function FiregameInstructions(props){
    const username = localStorage.getItem(USERNAME);

    return(
        <div className="relative bg-gray-800/90">
            <div className="pr-8 pl-8 pb-12">
                <p className="text-cyan-200 pt-12 pb-12">
                    You are in deep hibernation on the deep space vessel Archaeopteryx
                    when suddenly, the system wakes you. 
                    It is time for your regular 100000-year fire drill.
                    The vessel has a fire suppression system that is activated by reaching a button.
                    You must avoid the fire and find a path through the ship to find the button.
                </p>
                <div className="flex flex-col items-center">
                <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-8 h-8"><div className="absolute w-3 h-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600 border border-black"></div></div>
                    <div className="text-white">{username}</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[url('/suppresor2.png')] text-white text-xs flex items-center justify-center" style={{backgroundSize: '32px 32px'}}></div>
                <div className="text-white">Fire suppression system</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 text-white text-xs flex items-center justify-center bg-[url('/space_tiles_hyptosis/wool_colored_white.png')]" style={{backgroundSize: '32px 32px'}}></div>
                <div className="text-white">Open square</div>
                </div>
                <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-black text-white text-xs flex items-center justify-center bg-[url('/space_tiles_hyptosis/glass.png')]" style={{backgroundSize: '32px 32px'}}></div>
                <div className="text-white">Closed square</div>
                </div>
                </div>
                </div>
                <p className="text-red-200 pb-6">Use arrow keys to navigate through the ship to the fire suppression system.
                    If you step into a fire square, it's game over.
                </p>
                <p className="text-red-200 pb-6">The fire starts at a random square, and spreads each time you take a step. 
                    Closed squares and the switch cannot catch on fire. An open square with one fire neighbor (up down left right) 
                    has a 40% chance of catching on fire. The more fire neighbors an open square has, 
                    the likelier it will catch on fire. The game has no time limit.
                    Success is possible on each map. Easy maps are worth 50 points, medium maps are worth 100 points, and hard maps are worth 200 points.</p>
                {props.noMoreLevels && <div className="text-white pb-12"> {`You played all the ${props.noMoreLevels} levels. Choose another.`} </div>}
                {(!props.difficulty||props.noMoreLevels) && <FiregameDifficultyMenu difficulty={props.difficulty} setDifficulty={props.setDifficulty} setShowInstructions={props.setShowInstructions}/>}
                {props.difficulty && <div className="flex flex-col items-center">
                    <button onClick={() => props.setShowInstructions(false)} className="text-white hover:underline">
                        Close
                    </button>
                </div> }
            </div>
            
        </div>
    )
}

export function FiregameInstructionsatStart(props){
    const username = localStorage.getItem(USERNAME);
    const levels = ['easy','medium','hard']

    return(
        <div className="max-h-[90vh] border-gray-300 bg-black mt-6 z-10 rounded-md overflow-y-auto">
            <div className="pr-8 pl-8 pb-12">
            <p className="text-cyan-200 pt-12 pb-12">
                    You are in deep hibernation on the deep space vessel Archaeopteryx
                    when suddenly, the system wakes you. 
                    It is time for your regular 100000-year fire drill.
                    The vessel has a fire suppression system that is activated by reaching a button.
                    You must avoid the fire and find a path through the ship to activate the system.
                </p>
                <div className="flex flex-col items-center">
                <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-8 h-8"><div className="absolute w-3 h-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600 border border-black"></div></div>
                    <div className="text-white">{username}</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[url('/suppresor2.png')] text-white text-xs flex items-center justify-center" style={{backgroundSize: '32px 32px'}}></div>
                <div className="text-white">Fire suppression system</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 text-white text-xs flex items-center justify-center bg-[url('/space_tiles_hyptosis/wool_colored_white.png')]" style={{backgroundSize: '32px 32px'}}></div>
                <div className="text-white">Open square</div>
                </div>
                <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-black text-white text-xs flex items-center justify-center bg-[url('/space_tiles_hyptosis/glass.png')]" style={{backgroundSize: '32px 32px'}}></div>
                <div className="text-white">Closed square</div>
                </div>
                </div>
                </div>
                <p className="text-red-200 pb-6">Use arrow keys to navigate through the ship to the fire suppression system.
                    If you step into a fire square, it's game over.
                </p>
                <p className="text-red-200 pb-6">The fire starts at a random square, and spreads each time you take a step. 
                    Closed squares and the switch cannot catch on fire. An open square with one fire neighbor (up down left right) 
                    has a 40% chance of catching on fire. The more fire neighbors an open square has, 
                    the likelier it will catch on fire. The game has no time limit.
                    Success is possible on each map. Easy maps are worth 50 points, medium maps are worth 100 points, and hard maps are worth 200 points.</p>
                <div className='text-center text-white'>
                    <ul>{levels.map((dif,i)=>
                    {return props.levelsLeft[i]>0 ? <li key={i}><button className='hover:underline' 
                                            onClick={()=>{props.setDifficulty(dif);
                                            props.setShowInstructionsatStart(false);}}
                                        >New {dif} game ({props.levelsLeft[i]} left)</button></li> 
                                : <li className="opacity-60">No {dif} levels left</li>})}</ul></div>
            </div>
        </div>
    )
}
