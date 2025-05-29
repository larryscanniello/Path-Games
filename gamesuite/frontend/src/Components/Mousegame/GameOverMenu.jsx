import { USERNAME } from "../../constants";
import { Link } from 'react-router-dom';

export default function GameOverMenu(props){
    const stochoptions = ['stationary','stochastic']
    const username = localStorage.getItem(USERNAME)
    return(
        <><div className= "border border-white bg-gray-800/90 p-12">
            <div className="text-center font-bold text-3xl pb-12">You {props.gameState.gameStatus}! </div>
            <div className="pb-6">Select an option: </div>
            {props.noMoreLevels && <div>No more {props.noMoreLevels} levels. Choose another.</div>}
            <div className='text-center text-white'><ul>{stochoptions.map((dif,i)=><li key={i}><button className='hover:underline' 
        onClick={()=>{props.setStoch(dif);
                    props.setStochVersion(prev=>prev+1);
        }}>New {dif} game</button></li>)}</ul></div>                   
        <Link className="block text-center text-white hover:underline" to={"/seeoldmousegames/"+username+'/'+props.gameID.current+'/'}>
        See solution, see bots
            </Link>
        </div>
        </>
    )
}