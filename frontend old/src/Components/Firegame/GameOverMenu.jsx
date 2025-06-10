import { USERNAME } from "../../constants";
import { Link } from 'react-router-dom';

export default function GameOverMenu(props){
    if(!props.gameStatus||props.gameStatus==='in_progress'){
        return <></>
    }
    const options = ['easy','medium','hard']
    const username = localStorage.getItem(USERNAME)
    return(
        <><div style={{zIndex: 3, position:'relative',backgroundColor: 'lightgreen'}}>
            <div>Game over. You {props.gameStatus}! </div>
            <div>Select an option: </div>
        <button onClick={()=>{props.setDifficulty('easy'); 
                                props.setDifficultyCount(prev=>prev+1)}}>Easy</button>
        <button onClick={()=>{props.setDifficulty('medium');
                                props.setDifficultyCount(prev=>prev+1)}}>Medium</button>
        <button onClick={()=>{props.setDifficulty('hard');
                                props.setDifficultyCount(prev=>prev+1)}}>Hard</button>                     
        <Link to={"/seeoldfiregames/"+username+'/'+props.gameID.current+'/'}><button>See Game Replay, See Bots</button></Link>
        </div>
        </>
    )
}