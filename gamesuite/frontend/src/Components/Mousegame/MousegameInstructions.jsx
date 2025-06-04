import { USERNAME } from "../../constants";

export default function MousegameInstructions(props){
    const stochoptions = ['stationary','stochastic']
    const username = localStorage.getItem(USERNAME);

    return(
        <div className={props.stoch ? "border border-white rounded-md bg-gray-800/90" : "bg-black"}>
            <div className="pr-8 pl-8 pb-12">
                <p className="text-cyan-200 pt-12 pb-6">
                    You are in deep space aboard the ship Archaeopteryx,
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
                <div className="flex items-center gap-2 mb-2">
                    <div className=" w-3 h-3 rounded-full bg-purple-600 border border-black"></div>
                    <div className="text-white">{username}</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center border border-black">4</div>
                <div className="text-white">Jeff (Bot 4)</div>
                </div>
                </div>
                <p className="text-red-200 pb-12">
                    Both you and Jeff have specially made space mouse sensors to aid you.
                    At every time step, you can either move or sense.
                    You move with the arrow keys and sense with the space bar.
                    In stationary mode, the mouse stays still for the entire game,
                    and in stochastic mode, the mouse moves to an adjacent space or stays still randomly.
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
        </tr>
    </thead>
    <tbody>
        <tr>
            <td className="px-4 py-1 border-b border-gray-700">1</td>
            <td className="px-4 py-1 border-b border-gray-700">100%</td>
        </tr>
        <tr >
            <td className="px-4 py-1 border-b border-gray-700">2</td>
            <td className="px-4 py-1 border-b border-gray-700">89%</td>
        </tr>
        <tr >
            <td className="px-4 py-1 border-b border-gray-700">5</td>
            <td className="px-4 py-1 border-b border-gray-700">63%</td>
        </tr>
        <tr>
            <td className="px-4 py-1 border-b border-gray-700">10</td>
            <td className="px-4 py-1 border-b border-gray-700">35%</td>
        </tr>
        <tr >
            <td className="px-4 py-1 border-b border-gray-700">20</td>
            <td className="px-4 py-1 border-b border-gray-700">11%</td>
        </tr>
        <tr >
            <td className="px-4 py-1 border-b border-gray-700">30</td>
            <td className="px-4 py-1 border-b border-gray-700">3%</td>
        </tr>
    </tbody>
</table>
</div>
   
                {!props.stoch && <div className='text-center text-white'>
                    <ul>{stochoptions.map((stochvar,i)=>
                    {return props.levelsLeft[i]>0 ? <li key={i}><button className='hover:underline' 
                                            onClick={()=>{props.setStoch(stochvar);
                                            props.setShowInstructions(false);}}
                                        >New {stochvar} mouse game ({props.levelsLeft[i]} left)</button></li> 
                                : <li key={i} className="opacity-60">No {stochvar} levels left</li>})}</ul></div>}
                {props.stoch && <div className="flex flex-col items-center">
                                    <button onClick={() => props.setShowInstructions(false)} className="text-white hover:underline">
                                        Close
                                    </button>
                                </div> } 
            </div>
            
        </div>
    )
}