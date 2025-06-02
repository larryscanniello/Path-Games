import { USERNAME } from "../../constants";
import { Link } from 'react-router-dom';
import FiregameDifficultyMenu from "./FiregameDifficultyMenu";

export default function GameOverMenu(props){
    const levels = ['easy','medium','hard']
    const username = localStorage.getItem(USERNAME)
    return(
        <><div className= "border border-white bg-black p-12 rounded-md">
            <div className="text-center font-bold text-3xl pb-12">You {props.gameState.gameStatus}! </div>
            <div className="pb-6">Select an option: </div>
            <div className='text-center text-white'><ul>{levels.map((dif,i)=>{return props.levelsLeft[i]>0 ?
                    <li key={i}><button className='hover:underline' 
                    onClick={()=>{props.setDifficulty(dif);
                                props.setDifficultyCount(prev=>prev+1);
                    }}>New {dif} game ({props.levelsLeft[i]} left)</button></li> : <li className="opacity-70">No more {dif} levels</li>})}</ul></div>                   
        <Link className="block text-center text-white hover:underline" to={"/seeoldfiregames/"+username+'/'+props.gameID.current+'/'}>
        See solution, see bots
            </Link>
        </div>
        </>
    )
}