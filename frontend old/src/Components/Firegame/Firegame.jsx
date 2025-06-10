import {useState, useEffect, useRef} from 'react'
import RenderGridFiregame from './RenderGridFiregame';
import api from '../../api';
import { USERNAME } from '../../constants';
import GameOverMenu from './GameOverMenu';
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

    useEffect(() => {
        async function fetchGame(){
            try{
            const res = await api.post('firegame/',{
                username: localStorage.getItem(USERNAME),
                difficulty: difficulty})
            .catch((e)=>{throw new Error("Error fetching game.")});
            const responsedata = res.data.game;
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
            } catch(err){
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

    return <> <a href='/'>Home</a> This is the fire game. Turn: {gameState.turn} Game Status: {gameState.gameStatus} <button onClick={()=>window.location.reload()}>Restart</button>
    <ul>{levels.map((dif,i)=><li><button onClick={()=>{setDifficulty(dif);
                                                        setDifficultyCount(prev=>prev+1)
                                                        }}>New {dif} game</button></li>)}</ul>
    {gameData.firelist ? <RenderGridFiregame 
    data={gameData} 
    currentTurn={gameState.turn} 
    playerIndex={gameState.playerIndex ? gameState.playerIndex : gameData.playerIndex}/> : <div>Loading...</div>}
    <GameOverMenu gameStatus={gameState.gameStatus} setDifficulty={setDifficulty} setDifficultyCount={setDifficultyCount} gameID={gameID}/>
    </>
}