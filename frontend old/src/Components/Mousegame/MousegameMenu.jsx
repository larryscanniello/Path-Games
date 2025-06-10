import {Link} from 'react-router-dom'
import { USERNAME } from '../../constants'
export {MousegameMenu,GameOverMenu}


function MousegameMenu(props){
    if(props.stoch){
        return <></>
    }
    return(
    <div style={{zIndex: 4, position:'relative',backgroundColor: 'lightblue'}}><div>Select game mode: Stationary mouse or moving mouse.</div>
    <form>
        <button onClick={()=>{props.setStoch('stationary')}}>Stationary</button>
        <button onClick={()=>{props.setStoch('stoch')}}>Stoch</button>
    </form>
    </div>)
}

function GameOverMenu(props){
    if(!props.gameStatus||props.gameStatus==='in_progress'){
        return <></>
    }
    const username = localStorage.getItem(USERNAME)
    return(
        <><div style={{zIndex: 3, position:'relative',backgroundColor: 'lightgreen'}}>
            <div>Game over. You {props.gameStatus}! </div>
            <div>Select an option: </div>
        <button onClick={()=>{props.setStoch('stationary'); 
                                props.setStochVersion(prev=>prev+1)}}>Stationary</button>
        <button onClick={()=>{props.setStoch('stoch');
                                props.setStochVersion(prev=>prev+1)}}>Stoch</button>
        <Link to={'/seeoldmousegames/'+username+'/'+props.gameID.current+'/'}><button>Review Game, See Bots</button></Link>
        </div>
        </>
    )
}
