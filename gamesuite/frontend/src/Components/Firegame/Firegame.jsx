import {useState, useEffect, useRef} from 'react'
import RenderGridFiregame from './RenderGridFiregame';
import api from '../../api';
import { USERNAME } from '../../constants';
import GameOverMenu from './GameOverMenu';
import NavBar from '../NavBar';
import FiregameInstructions from './FiregameInstructions';
import FiregameDifficultyMenu from './FiregameDifficultyMenu';
import FiregameAbout from './FiregameAbout';
import { FiregameInstructionsatStart } from './FiregameInstructions';

const GRID_SIZE = 25;

export default function Firegame(){
    const [gameData,setGameData] = useState({
        grid: null, firelist: null, playerIndex: null, extIndex: null,
    });
    const [error,setError] = useState(null);
    const [gameState, setGameState] = useState({
        turn: 0,
        playerIndex: null,
        playerPath: null,
        gameStatus: 'in_progress'
    })
    const gameID = useRef(null);
    const [difficulty,setDifficulty] = useState(null);
    const [difficultyCount,setDifficultyCount] = useState(0);
    const [showInstructions,setShowInstructions] = useState(false);
    const [showDifficultyMenu,setShowDifficultyMenu] = useState(false)
    const [showAbout,setShowAbout] = useState(false);
    const [gameOverMenu,setGameOverMenu] = useState(false);
    const [showInstructionsatStart,setShowInstructionsatStart] = useState(true);
    const [initialGameLoaded,setInitialGameLoaded] = useState(false);
    const [levelsLeft,setLevelsLeft] = useState(null);
    const [winRate,setWinRate] = useState(null);
    const [leaderboard,setLeaderboard] = useState(null);

    useEffect(() => {
        async function fetchGame(){
            try{
            const res = await api.post('firegame/',{
                username: localStorage.getItem(USERNAME),
                difficulty: difficulty})
            .catch((e)=>{throw new Error("Error fetching game.")});
            const responsedata = res.data.game;
            const leaderboardres = await api.post('getfiregameleaderboard/',{
                username: localStorage.getItem(USERNAME),
            })
            .catch((e)=>{throw new Error("Error fetching leaderboard.")});
            setLeaderboard(leaderboardres.data)
            
            if(!responsedata){
                setLevelsLeft(res.data.levels_left);
            }
            else{
            setInitialGameLoaded(true);
            gameID.current = responsedata.id
            const grid = JSON.parse(responsedata.initial_board);
            const firelist = JSON.parse(responsedata.fire_progression);
            const initialPlayerIndex = JSON.parse(responsedata.bot_index);
            const extIndex = JSON.parse(responsedata.ext_index);
            setWinRate(res.data.win_rate)
            setGameData({grid, 
                        firelist, 
                        extIndex, 
                        playerIndex: initialPlayerIndex})
            setGameState({
                turn: 0,
                playerIndex: null,
                gameStatus: 'in_progress',
                playerPath: [initialPlayerIndex],
            })
            }} catch(err){
                setError(err.message);
            }
        
        }
        fetchGame();
        }, [difficulty,difficultyCount])

      useEffect(() => {
        const handleKeyDown = (e) => {
            setGameState(prev => {
            if(!prev||prev.gameStatus!=='in_progress') return prev;
            const newTurn = Math.min(gameData.firelist.length-1, prev.turn + 1);
            const newPlayerIndex = prev.playerIndex ? [...prev.playerIndex] : [...gameData.playerIndex]
            switch(e.code){
                case('ArrowRight'):
                    if(newPlayerIndex[1]!==GRID_SIZE-1){
                        const i = newPlayerIndex[0]
                        const j = newPlayerIndex[1]+1
                        if(gameData.grid[i][j]%10!==1){
                            newPlayerIndex[1]+=1
                        }
                    }
                    break;
                case('ArrowDown'):
                    if(newPlayerIndex[0]!==GRID_SIZE-1){
                        const i = newPlayerIndex[0]+1
                        const j = newPlayerIndex[1]
                        if(gameData.grid[i][j]%10!==1){
                            newPlayerIndex[0]+=1
                        }
                    }
                    break;
                case('ArrowLeft'):
                    if(newPlayerIndex[1]!==0){
                        const i = newPlayerIndex[0]
                        const j = newPlayerIndex[1]-1
                        if(gameData.grid[i][j]%10!==1){
                            newPlayerIndex[1]-=1
                        }
                    }
                    break;
                case('ArrowUp'):
                    if(newPlayerIndex[0]!==0){
                        const i = newPlayerIndex[0]-1
                        const j = newPlayerIndex[1]
                        if(gameData.grid[i][j]%10!==1){
                            newPlayerIndex[0]-=1
                        }
                    }
                    break;
            }
            const [k,h] = newPlayerIndex
            let gameStatus = 'in_progress';
            for(let i=0;i<prev.turn+1;i++){
                for(let j=0;j<gameData.firelist[i].length; j++){
                    if(k===gameData.firelist[i][j][0]&&h===gameData.firelist[i][j][1]){
                        gameStatus = 'lose';
                    }
                }
            }
            if(gameData.extIndex[0]===newPlayerIndex[0]&&gameData.extIndex[1]===newPlayerIndex[1]){
                gameStatus = 'win'
            }
            const playerPath = prev.playerPath.map(row => [...row])
            playerPath.push(newPlayerIndex)
            if(gameStatus!=='in_progress'){
                handleGameOver(gameStatus,playerPath);
            }
            
            return({
                turn: prev.turn+1,
                playerIndex: newPlayerIndex,
                playerPath: playerPath,
                gameStatus: gameStatus,
            })
            });
        }   
        window.addEventListener('keydown',handleKeyDown);
        return () => {
          window.removeEventListener('keydown',handleKeyDown);
        }
      }, [gameData]);

      async function handleGameOver(result,path){
        setLevelsLeft(prev=>{
            const newll = [...prev];
            if(difficulty==='easy'){
                newll[0]-=1
            }
            else if(difficulty==='medium'){
                newll[1]-=1
            }
            else{
                newll[2]-=1
            }
            return newll
        })
        
        const username = localStorage.getItem(USERNAME);
        const obj = {result,path,username,id:gameID.current}
        const response = await api.post('handle_game_over_firegame/',obj)
            .then(response => {console.log(response)})
            .catch((e)=>{console.log('Check handleGameOver in Mousegame.jsx');
                console.log(e)
            })
        
        
    }

    const levels = ['easy','medium','hard']

    return <div><div className='min-h-screen bg-black text-cyan-200 font-mono'> 
        <div>
        <NavBar/>
        <div className='grid grid-cols-[1fr_auto_1fr]'> 
        {gameState.gameStatus!=='in_progress'&& <div className='fixed z-20 m-8'><GameOverMenu
                    gameState={gameState}
                    setGameState={setGameState}
                    setDifficulty={setDifficulty} 
                    setDifficultyCount={setDifficultyCount}
                    gameID={gameID}
                    levelsLeft={levelsLeft}
                    />
        </div>}
        <div>{showInstructions && 
                <div className= "fixed z-20">
                <FiregameInstructions difficulty={difficulty} 
                setDifficulty={setDifficulty} 
                setShowInstructions={setShowInstructions}/></div>}
              {(showInstructionsatStart&&levelsLeft) && <div className= "fixed z-20">
                <FiregameInstructionsatStart difficulty={difficulty}
                showInstructionsatStart = {showInstructionsatStart} 
                setDifficulty={setDifficulty} 
                setShowInstructionsatStart={setShowInstructionsatStart}
                levelsLeft={levelsLeft}/>                
                </div>}  
                </div>       
        <div>
        {gameData.firelist && <div>
        {(showDifficultyMenu&&levelsLeft) && <div className='fixed z-20'>
            <div className='flex p-6 ml-72 mt-68 flex-col border border-gray-300 bg-gray-800/90'>
            {levels.map((dif,i)=>{
            return levelsLeft[i]>0 ? <button className='p-3 hover:underline' onClick={()=>{setDifficulty(dif);
                                    setDifficultyCount(prev=> prev+1);
                                        setShowDifficultyMenu(false);}}
                                    >New {dif} game ({levelsLeft[i]} left)</button>
                                    : <button className='opacity-70 p-3'>No more {dif} levels</button>                   
            })}<button onClick={()=>setShowDifficultyMenu(false)} className='pt-3 text-white hover:underline'>Close</button></div></div>}
        
        {showAbout && <div className='fixed z-20'><FiregameAbout setShowAbout={setShowAbout}/></div>}

        <RenderGridFiregame 
                        data={gameData} 
                        currentTurn={gameState.turn} 
                        playerIndex={gameState.playerIndex ? 
                        gameState.playerIndex : gameData.playerIndex}/>
    <div className='flex justify-between'>
        <button className='hover:underline' onClick={()=>setShowDifficultyMenu(prev=>!prev)}>New game</button>
        <button className='hover:underline' onClick={()=>setShowInstructions(prev=>!prev)}>Instructions</button>
        <button className='hover:underline' onClick={()=>setShowAbout(prev=>!prev)}>About</button></div>
    </div>}
    
        </div>
    {!showInstructionsatStart && <div>
    <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4 rounded-md">
                <div>Firegame, Map: {gameID.current}</div>
                <div>Difficulty: {difficulty}</div>    
                <div className="">Map win rate: {Math.round(winRate*100)}%</div>                                
            </div>
            <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4 rounded-md">
                {/*bg-gray-800/90*/}
                <div>Turn: {gameState.turn}</div>   
    </div>
    <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4 rounded-md">
                <div>Score: {leaderboard.userscore}</div>
                
      </div>
      <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4 rounded-md">
                <div>Leaderboard</div>
                <div className='border border-gray-500 p-4 rounded-2xl'>{leaderboard.leaderboard.map(([user,score])=><div className='flex justify-between'><div>{user}</div><div className='ml-40'></div> <div>{score}</div></div>)}</div>

      </div>
    </div> }
    
    
    
    </div>
    
    </div></div></div>
}