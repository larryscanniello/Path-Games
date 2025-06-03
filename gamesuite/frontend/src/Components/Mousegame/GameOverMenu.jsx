import { USERNAME } from "../../constants";
import { Link } from 'react-router-dom';

export default function GameOverMenu(props){
    const stochoptions = ['stationary','stochastic']
    const username = localStorage.getItem(USERNAME)
    return(
        <><div className= "border border-white bg-gray-800/90 p-12 rounded-md">
            <div className="text-center font-bold text-3xl pb-12">You {props.gameState.gameStatus}! </div>
            <div className="pb-6">Select an option: </div>
            {(!props.stoch&&props.levelsLeft )&& <div className='text-center text-white'>
                    <ul>{stochoptions.map((stochvar,i)=>
                    {return props.levelsLeft[i]>0 ? <li key={i}><button className='hover:underline' 
                                            onClick={()=>{props.setStoch(stochvar);
                                            props.setStochVersion(prev=>prev+1);
                                            props.setShowInstructions(false);}}
                                        >New {stochvar} mouse game ({props.levelsLeft[i]} left)</button></li> 
                                : <li className="opacity-60">No {stochvar} levels left</li>})}</ul></div>}           
        <Link className="block text-center text-white hover:underline" to={"/seeoldmousegames/"+username+'/'+props.gameID.current+'/'}>
        See solution, see bots
            </Link>
        </div>
        </>
    )
}