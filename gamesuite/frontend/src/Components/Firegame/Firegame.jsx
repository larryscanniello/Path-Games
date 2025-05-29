import {useState, useEffect, useRef} from 'react'
import RenderGridFiregame from './RenderGridFiregame';
import api from '../../api';
import { USERNAME } from '../../constants';
import GameOverMenu from './GameOverMenu';
import NavBar from '../NavBar';
import FiregameInstructions from './FiregameInstructions';
import FiregameDifficultyMenu from './FiregameDifficultyMenu';
import FiregameAbout from './FiregameAbout';

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
    const [showInstructions,setShowInstructions] = useState(true);
    const [showDifficultyMenu,setShowDifficultyMenu] = useState(false)
    const [showAbout,setShowAbout] = useState(false);
    const [noMoreLevels,setNoMoreLevels] = useState([false,false,false]);

    useEffect(() => {
        async function fetchGame(){
            try{
            const res = await api.post('firegame/',{
                username: localStorage.getItem(USERNAME),
                difficulty: difficulty})
            .catch((e)=>{throw new Error("Error fetching game.")});
            const responsedata = res.data.game;
            if(!responsedata){
                setNoMoreLevels(difficulty);
                if(gameState.gameStatus!=='win'&&gameState.gameStatus!=='lose'){
                    setShowInstructions(true);
                }           
            }
            else{
            setNoMoreLevels(false);
            gameID.current = responsedata.id
            const grid = JSON.parse(responsedata.initial_board);
            const firelist = JSON.parse(responsedata.fire_progression);
            const initialPlayerIndex = JSON.parse(responsedata.bot_index);
            const extIndex = JSON.parse(responsedata.ext_index);
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
        <div className='flex justify-center items-center'> {gameData.firelist && <div>
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
    {showAbout && <div className='fixed'><FiregameAbout/></div>}
    {showInstructions && 
    <div className={!gameData.firelist ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-20 bg-black bg-opacity-80" : "fixed"}>
        <FiregameInstructions noMoreLevels={noMoreLevels} difficulty={difficulty} 
    setDifficulty={setDifficulty} 
    setShowInstructions={setShowInstructions}/></div>}
    {gameState.gameStatus!=='in_progress' && <div className='fixed'><GameOverMenu
                    gameState={gameState}
                    setGameState={setGameState}
                    setDifficulty={setDifficulty} 
                    setDifficultyCount={setDifficultyCount}
                    gameID={gameID}
                    noMoreLevels={noMoreLevels}/>
    </div>}
    {showDifficultyMenu && <div className='fixed'><div className='flex p-12 flex-col border border-gray-300 bg-gray-800/90'>{levels.map(dif=>{
        return <button className='p-3 hover:underline' onClick={()=>{setDifficulty(dif);
                                 setDifficultyCount(prev=> prev+1);
                                    setShowDifficultyMenu(false);
        }}>New {dif} game</button>
    })}</div></div>}
    </div>
    
    </div></div></div>
}