
export default function MousegameInstructions(props){
    const stochoptions = ['stationary','stochastic']

    return(
        <div className="border border-gray-300 bg-gray-800/90 z-10">
            <div className="pr-8 pl-8 pb-12">
                <p className="text-cyan-200 pt-12 pb-12">
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
                <p className="text-red-200 pb-12">
                    Both you and Jeff have specially made space mouse sensors to aid you.
                    At every time step, you can either move or sense.
                    You move with the arrow keys and sense with the space bar.
                    In stationary mode, the mouse stays still for the entire game,
                    and in stochastic mode, the mouse moves to an adjacent space or stays still randomly.
                    The mouse is hidden, but when you or Jeff enter its square, the game is over.
                    If you enter the square at the same time, you lose.
                </p>
                <p className="text-red-200 pb-4">
                    
                    Space mice are known to be electromagnetically resistant, and so the sensors
                    do not work consistently. The closer you are to the mouse,
                    the higher chance of your sensor beeping. To give an idea: 
                </p>
                <div className="flex justify-center">
                <table class="table-auto text-left font-small text-red-200 border-collapse transform scale-75">
    <thead>
        <tr>
            <th class="px-4 border-b-2 border-gray-700 bg-gray-700/50">Distance from Mouse</th>
            <th class="px-4 py-2 border-b-2 border-gray-700 bg-gray-700/50">Probability of Beep</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="px-4 py-1 border-b border-gray-700">1</td>
            <td class="px-4 py-1 border-b border-gray-700">100%</td>
        </tr>
        <tr >
            <td class="px-4 py-1 border-b border-gray-700">2</td>
            <td class="px-4 py-1 border-b border-gray-700">89%</td>
        </tr>
        <tr >
            <td class="px-4 py-1 border-b border-gray-700">5</td>
            <td class="px-4 py-1 border-b border-gray-700">63%</td>
        </tr>
        <tr>
            <td class="px-4 py-1 border-b border-gray-700">10</td>
            <td class="px-4 py-1 border-b border-gray-700">35%</td>
        </tr>
        <tr >
            <td class="px-4 py-1 border-b border-gray-700">20</td>
            <td class="px-4 py-1 border-b border-gray-700">11%</td>
        </tr>
        <tr >
            <td class="px-4 py-1 border-b border-gray-700">30</td>
            <td class="px-4 py-1 border-b border-gray-700">3%</td>
        </tr>
    </tbody>
</table>
</div>
{props.stoch && <div className="flex flex-col items-center">
                    <button onClick={() => props.setShowInstructions(false)} className="text-white hover:underline">
                        Close
                    </button>
                </div> }    

                {props.noMoreLevels && <div className="text-white pb-12"> {`You played all the ${props.noMoreLevels} mouse levels. Choose another.`} </div>}
                {!props.stoch && <div className='text-center text-white'><ul>{stochoptions.map((stoch,i)=><li key={i}><button className='hover:underline' 
                    onClick={()=>{props.setStoch(stoch);
                        props.setShowInstructions(false);
                        }}>New game, {stoch} mouse</button></li>)}</ul></div>}
            </div>
            
        </div>
    )
}