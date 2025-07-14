import {useState, useEffect, useRef} from 'react'
import RenderGridFiregame from './RenderGridFiregame';
import api from '../../api';
import { ACCESS_TOKEN, USERNAME } from '../../constants';
import GameOverMenu from './GameOverMenu';
import NavBar from '../NavBar';
import FiregameInstructions from './FiregameInstructions';
import FiregameDifficultyMenu from './FiregameDifficultyMenu';
import FiregameAbout from './FiregameAbout';
import { FiregameInstructionsatStart } from './FiregameInstructions';
import '../../Styles/flame.css'
import { useWindowSize } from '../useWindowSize';

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
    const [width,height] = useWindowSize();

    //When user selects a difficulty, fetches game board / data needed for new game
    useEffect(() => {
        async function fetchGame(){
            try{
            const res = await api.post('firegame/',{
                difficulty: difficulty,
                })
            .catch((e)=>{throw new Error("Error fetching game.")});
            const responsedata = res.data.game;
            const leaderboardres = await api.post('getfiregameleaderboard/',{})
            .catch((e)=>{throw new Error("Error fetching leaderboard.")});
            setLeaderboard(leaderboardres.data)
            //When the next line of code runs when the component is initialized, there will be no response data
            //but the previous API call will still fetch data about number of levels of left for each difficulty, which is used elsewhere
            if(!responsedata){
                setLevelsLeft(res.data.levels_left);
            }
            else{
            setInitialGameLoaded(true);
            gameID.current = responsedata.id
            const grid = JSON.parse(responsedata.initial_board);
            const firelist = JSON.parse(responsedata.fire_progression);
            const fireGrids = [grid];
            //firelist[t] is an array of tuples of the form [[a,b],[c,d],...,[e,f]] where each tuple is a space that catches on fire at time t
            //fireGrids is an array of 25x25 arrays, where fireGrids[t][a][b]===2 if the space (a,b) is on fire at time t, 0 otherwise
            //In the following code I make fireGrids from firelist, ensuring all of this is processed up front / at the beginning
            for (let t = 1; t <= firelist.length; t++) {
                const newGrid = fireGrids[t-1].map(row=>[...row]);
                for (let [x, y] of firelist[t-1] || []) {
                    newGrid[x][y] += 2;
                }
                fireGrids.push(newGrid);
            }
            const initialPlayerIndex = JSON.parse(responsedata.bot_index);
            const extIndex = JSON.parse(responsedata.ext_index);
            setWinRate(res.data.win_rate)
            setGameData({grid, 
                        firelist, 
                        extIndex,
                        fireGrids, 
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

    //This useEffect contains the handleKeyDown that handles player movement, and it adds the corresponding event listener to the window
    //For each arrow key down, checks if space is in bounds and if space is open (if grid[i][j] isnt 1)
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
            //Checks firelist if player is in a fire square, and game is over
            for(let i=0;i<prev.turn+1;i++){
                for(let j=0;j<gameData.firelist[i].length; j++){
                    if(k===gameData.firelist[i][j][0]&&h===gameData.firelist[i][j][1]){
                        gameStatus = 'lose';
                    }
                }
            }
            //Checks if player is at extinguisher index
            if(gameData.extIndex[0]===newPlayerIndex[0]&&gameData.extIndex[1]===newPlayerIndex[1]){
                gameStatus = 'win'
            }
            const playerPath = prev.playerPath.map(row => [...row])
            playerPath.push(newPlayerIndex)
            if(gameStatus!=='in_progress'){
                handleGameOver(gameStatus,playerPath);
            }
            if(prev.turn+1===1){
                //handleFirstTime pings the backend so the player can't restart a game they've already started
                handleFirstTurn()
            }
            async function handleFirstTurn(){
                const access = localStorage.getItem(ACCESS_TOKEN);
                const obj = {id:gameID.current,access}
                const res = api.post('/handle_first_turn_firegame/',obj)
                .catch(e=>{console.log('Check handleFirstTurn',e)})
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

      //Adds an event listener for if a player closes the window or leaves in the middle of the game
      //It saves their progress so they can see the path they took
      useEffect(() => {
        const handleBeforeUnload = () => {
            if(gameState.gameStatus==='in_progress'){
                const username = localStorage.getItem(USERNAME);
                const obj = {
                    result: 'lose',
                    path: gameState.playerPath,
                    username,
                    sensorLog: gameState.sensorLog,
                    id: gameID.current
                };
                navigator.sendBeacon(import.meta.env.BEACON_URL, JSON.stringify(obj));
            }   
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [gameState.playerPath, gameState.sensorLog, gameState.gameStatus,gameID]);

      
    
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
                const obj = {path,username,id:gameID.current,result}
                const res = api.post('/handle_game_over_firegame/',obj)
                .catch(e=>{console.log('Check handleGameOver',e)})
    }


    const levels = ['easy','medium','hard']
    if (width < 900 || height < 695) {
        return (
          <div className="flex flex-col justify-center items-center h-screen px-4 text-center text-cyan-100">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Window Too Small</h2>
            <p className="mb-2">The content can’t fit in a window this small.</p>
            <p>If you had something in progress, increase screen height or width to resume.</p>
          </div>
        );
      }

    return <div className=''>
        <div className="">
        <div className="">
        {(showInstructionsatStart&&levelsLeft) && <div className= "z-20 firegame-div">
                <FiregameInstructionsatStart difficulty={difficulty}
                showInstructionsatStart = {showInstructionsatStart} 
                setDifficulty={setDifficulty} 
                setShowInstructionsatStart={setShowInstructionsatStart}
                levelsLeft={levelsLeft}/>                
                </div>}
        <div className='flex flex-col items-center'>{showAbout && <div className='fixed z-20'><FiregameAbout setShowAbout={setShowAbout}/></div>}</div>
        {difficulty&&gameData.grid && <div className='firegame-div grid grid-cols-[1fr_auto_1fr]'> 
        <div className='w-4'>
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
              
                </div>   
        </div>    
        <div>
        {gameData.firelist && <div>
        {(showDifficultyMenu&&levelsLeft) && <div className='fixed z-20'>
            <div className='flex p-6 ml-61 mt-68 flex-col bg-gray-800/90 text-white rounded-md'>
            {levels.map((dif,i)=>{
            return levelsLeft[i]>0 ? <button className='p-3 hover:underline' onClick={()=>{setDifficulty(dif);
                                    setDifficultyCount(prev=> prev+1);
                                        setShowDifficultyMenu(false);}}
                                    >New {dif} game ({levelsLeft[i]} left)</button>
                                    : <button className='opacity-70 p-3'>No more {dif} levels</button>                   
            })}<button onClick={()=>setShowDifficultyMenu(false)} className='pt-3 text-white hover:underline'>Close</button></div></div>}
        
        

        {gameData && 
        <RenderGridFiregame 
                        fireGrid = {gameData.fireGrids[gameState.turn]} 
                        turn={gameState.turn} 
                        playerIndex={gameState.playerIndex ? gameState.playerIndex : gameData.playerIndex}/>}
    <div className='flex justify-between'>
        <button className='hover:underline' onClick={()=>setShowDifficultyMenu(prev=>!prev)}>New game</button>
        <button className='hover:underline' onClick={()=>setShowInstructions(prev=>!prev)}>Instructions</button>
        <button className='hover:underline' onClick={()=>setShowAbout(prev=>!prev)}>About</button></div>
    </div>}
    
        </div>
        {!showInstructionsatStart && 
  <div className="pt-8 pl-10 pr-10 backdrop-blur-md">
    <div className='border-2 border-cyan-400/30 rounded-md shadow-[0_0_6px_rgba(0,255,255,0.15)] backdrop-blur-xl bg-black/60 text-cyan-100'>

      <div className="flex flex-col text-cyan-100 p-4">
        <div className="text-[18px] font-bold">Fire Game, Map {gameID.current}</div>
        <div className="text-[13px]">Difficulty: {difficulty}</div>
        <div className="text-[13px]">Map win rate: {Math.round(winRate * 100)}%</div>
      </div>

      <div className="flex flex-col p-4 rounded-md text-cyan-100">
        <div>Turn: {gameState.turn}</div>
      </div>

      <div className="flex flex-col p-4 rounded-md text-cyan-100">
        <div>Score: {leaderboard.userscore}</div>
      </div>

      <div className="text-cyan-100 flex flex-col p-4 rounded-md">
        <div className="text-[15px] font-semibold">Fire Game Leaderboard</div>
        <div className='border border-gray-500 p-4 rounded-2xl text-[14px]'>
          {leaderboard.leaderboard && leaderboard.leaderboard.length > 0 ? (
            leaderboard.leaderboard.map(([user, score]) => (
              <div key={user} className='flex flex-row justify-between'>
                <div>{user}</div>
                <div className='ml-3'></div>
                <div>{score}</div>
              </div>
            ))
          ) : (
            <div>No winners yet</div>
          )}
        </div>
      </div>

    </div>
  </div>
}

    
    
    
    </div>}
    </div></div></div>
   
}