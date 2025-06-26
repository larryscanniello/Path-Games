import { USERNAME } from "../../constants";
import "../../Styles/mouse.css"

export default function MousegameInstructions(props){
    const stochoptions = ['stationary','stochastic']
    const username = localStorage.getItem(USERNAME);

    return(
        <div className={props.stoch ? "max-h-[100vh] overflow-y-auto rounded-md bg-gray-800/90" : "mousegame-div bg-black max-h-[100vh] z-10 rounded-md overflow-y-auto text-sm"}>
            <div className="pr-8 pl-8 pb-12">
                <p className="text-cyan-200 pt-12 pb-6">
                    You are in deep space aboard the vessel Archaeopteryx,
                    when you receive a system alert: A space mouse has found its way aboard.
                    Space mice are friendly and curious creatures. Their natural habitat is the 
                    vacuum of space. 
                    Unfortunately, they are known to board ships to feed on electrical wires, which can wreak havoc.
                    You must find the space mouse and release it safely back into the wild.
                    What's more, your crewmate Jeff
                    made a bet with you that he can find the mouse before you do.
                    Find the mouse before he does.
                </p>
                
                <div className="flex flex-col items-center">
                <div>
                <div className="flex items-center gap-2 mb-2">
                <div className="relative w-8 h-8"><div className="absolute w-3 h-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600 border border-black"></div></div>
                    <div className="text-white">{username}</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                <div className="relative w-8 h-8"><div className="absolute w-3 h-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black">4</div></div>
                <div className="text-white">Jeff (Bot 4)</div>
                
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
                <p className="text-red-200 pb-6">
                    Both you and Jeff have specially made space mouse sensors to aid you.
                    At every time step, you can either move or sense.
                    You move with the arrow keys and sense with the space bar.
                    In stationary mode, the mouse stays still for the entire game,
                    and in moving mouse mode, at any turn the mouse has equal chance of 
                    (up, down, left, right, stay still) to an open square.
                    The mouse is hidden, but when you or Jeff enter its square, the game is over.
                    If you both enter the mouse's square at the same time, you lose.
                </p>
                <p className="text-red-200 pb-4">
                    
                    Space mice are known to be electromagnetically resistant, and so the sensors
                    do not work consistently. But closer proximity to the mouse will always result in
                    a higher chance of a beep. It is up to you to piece together the noisy readings.
                    Here is a chart that shows some distances and sensor probabilities.
                </p>
                <div className="flex justify-center">
                <table className="table-auto text-left font-small text-red-200 border-collapse transform scale-75">
    <thead>
        <tr>
            <th className="px-4 border-b-2 border-gray-700 bg-gray-700/50">Distance from Mouse</th>
            <th className="px-4 py-2 border-b-2 border-gray-700 bg-gray-700/50">Probability of Beep</th>
            <th className="px-4 py-2 border-b-2 border-gray-700 bg-gray-700/50">Expected Beeps out of 5</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td className="px-4 py-1 border-b border-gray-700">1</td>
            <td className="px-4 py-1 border-b border-gray-700">100%</td>
            <td className="px-4 py-1 border-b border-gray-700">5</td>
        </tr>
        <tr >
            <td className="px-4 py-1 border-b border-gray-700">2</td>
            <td className="px-4 py-1 border-b border-gray-700">89%</td>
            <td className="px-4 py-1 border-b border-gray-700">4.45</td>
        </tr>
        <tr >
            <td className="px-4 py-1 border-b border-gray-700">5</td>
            <td className="px-4 py-1 border-b border-gray-700">63%</td>
            <td className="px-4 py-1 border-b border-gray-700">3.15</td>

        </tr>
        <tr>
            <td className="px-4 py-1 border-b border-gray-700">10</td>
            <td className="px-4 py-1 border-b border-gray-700">35%</td>
            <td className="px-4 py-1 border-b border-gray-700">1.75</td>
        </tr>
        <tr >
            <td className="px-4 py-1 border-b border-gray-700">20</td>
            <td className="px-4 py-1 border-b border-gray-700">11%</td>
            <td className="px-4 py-1 border-b border-gray-700">0.55</td>
        </tr>
        <tr >
            <td className="px-4 py-1 border-b border-gray-700">30</td>
            <td className="px-4 py-1 border-b border-gray-700">3%</td>
            <td className="px-4 py-1 border-b border-gray-700">0.15</td>
        </tr>
    </tbody>
</table>
</div>
   {!props.stoch && <div className="flex flex-col items-center"><p className="text-red-400 py-4">Warning: Moving mouse mode is challenging. Try stationary first.</p></div>}
                {!props.stoch && <div className='text-center text-white pb-8'>
                    <ul>{stochoptions.map((stochvar,i)=>
                    {return props.levelsLeft[i]>0 ? <li key={i}><button className='hover:underline' 
                                            onClick={()=>{props.setStoch(stochvar);
                                            props.setShowInstructions(false);}}
                                        >New {stochvar==='stochastic'?'moving':'stationary'} mouse game ({props.levelsLeft[i]} left)</button></li> 
                                : <li key={i} className="opacity-60">No {stochvar} levels left</li>})}</ul></div>}
                {props.stoch && <div className="flex flex-col items-center">
                                    <button onClick={() => props.setShowInstructions(false)} className="pb-4 text-white hover:underline">
                                        Close
                                    </button>
                                </div> } 
            </div>
            
        </div>
    )
}