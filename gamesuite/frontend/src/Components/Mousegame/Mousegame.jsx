import {useState, useEffect, useRef, useContext} from 'react'
import RenderGridMousegame from './RenderGridMousegame';
import SensorInfoBox from './SensorInfoBox';
import api from "../../api"
import { AuthContext } from '../AuthProvider';
import { USERNAME } from '../../constants';
import NavBar from '../NavBar';
import MousegameInstructions from './MousegameInstructions';
import MousegameAbout from './MousegameAbout'
import GameOverMenu from './GameOverMenu';


const GRID_SIZE = 25;

export default function Mousegame(){
    const [turn, setTurn] = useState(0);
    const [error, setError] = useState(null);
    const [gameData,setGameData] = useState(null);
    const [gameState, setGameState] = useState({
        turn: 0,
        playerIndex: null,
        mouseIndex: null,
        gameStatus: 'in_progress',
        playerPath: null,
        sensorLog: [],
    })
    const gameID = useRef(null);
    const boxRef = useRef(null);
    const [showSenses,setShowSenses] = useState(false);
    const [hoverIndex,setHoverIndex] = useState(null);
    const [stoch,setStoch] = useState(null);
    const [stochVersion,setStochVersion] = useState(0);
    const [showNewGameMenu,setShowNewGameMenu] = useState(false);
    const [showInstructions,setShowInstructions] = useState(true);
    const [showAbout,setShowAbout] = useState(false);
    const [noMoreLevels,setNoMoreLevels] = useState(false);
    const [seePath,setSeePath] = useState(false);

    useEffect(() => {
        async function fetchGame(){
            try{
            const res = await api.post('mousegame/',{
                username: localStorage.getItem(USERNAME),
                stoch,                
            })
            .catch((e)=>{throw new Error("Error fetching game.")});
            const responsedata = res.data;
            if(!responsedata.success){
                console.log('check666')
                setNoMoreLevels(stoch);
                if(gameState.gameStatus!=='win'&&gameState.gameStatus!=='lose'){
                    setShowInstructions(true);
                    setStoch(null);
                }           
            }else{
                setNoMoreLevels(false);
                gameID.current = responsedata.game.id
                const parseddata = {
                    game: {
                        grid: JSON.parse(responsedata.game.grid),
                        stoch: responsedata.game.stochastic,
                        mousePath: responsedata.game.mouse_path,
                        botStartingIndex: JSON.parse(responsedata.game.bot_starting_index),
                        mouseStartingIndex: JSON.parse(responsedata.game.mouse_starting_index)
                    },
                    bot1: {
                        evidence: JSON.parse(responsedata.bots[0].evidence).slice(1),
                        states: JSON.parse(responsedata.bots[0].states)
                    },
                    bot2: {
                        evidence: JSON.parse(responsedata.bots[1].evidence).slice(1),
                        states: JSON.parse(responsedata.bots[1].states)
                    },
                    bot3: {
                        evidence: JSON.parse(responsedata.bots[2].evidence).slice(1),
                        states: JSON.parse(responsedata.bots[2].states)
                    },
                    bot4: {
                        evidence: JSON.parse(responsedata.bots[3].evidence).slice(1),
                        states: JSON.parse(responsedata.bots[3].states)
                    }
                }
                console.log(parseddata);
                setGameData(parseddata);
                const playerIndex = parseddata.game.botStartingIndex;
                const mouseIndex = parseddata.game.mouseStartingIndex;
                setGameState({
                    turn: 0,
                    playerIndex,
                    mouseIndex,
                    gameStatus: 'in_progress',
                    playerPath: [parseddata.game.botStartingIndex],
                    sensorLog: []
                })
            }

            } catch(err){
                setError(err.message);
            }
        }
        if(stoch){
            fetchGame();
        }
        }, [stoch,stochVersion])

        useEffect(()=>{
            if(boxRef&&stoch){
                boxRef.current.scrollTop = boxRef.current.scrollHeight;
            }
        },[gameState])

      useEffect(() => {
        const handleKeyDown = (e) => {
            setGameState(prev => {
            if(!prev||prev.gameStatus!=='in_progress') return prev;
            const newTurn = Math.min(gameData.bot3.evidence.length-1, prev.turn + 1);
            const newPlayerIndex = prev.playerIndex ? [...prev.playerIndex] : [...gameData.game.botStartingIndex]
            const sensorLog = prev.sensorLog.map(obj=>({...obj}));
            switch(e.code){
                case('ArrowRight'):
                    if(newPlayerIndex[1]!==GRID_SIZE-1){
                        const i = newPlayerIndex[0]
                        const j = newPlayerIndex[1]+1
                        if(gameData.game.grid[i][j]%10!==1){
                            newPlayerIndex[1]+=1
                        }
                    }
                    break;
                case('ArrowDown'):
                    e.preventDefault();
                    if(newPlayerIndex[0]!==GRID_SIZE-1){
                        const i = newPlayerIndex[0]+1
                        const j = newPlayerIndex[1]
                        if(gameData.game.grid[i][j]%10!==1){
                            newPlayerIndex[0]+=1
                        }
                    }
                    break;
                case('ArrowLeft'):
                    if(newPlayerIndex[1]!==0){
                        const i = newPlayerIndex[0]
                        const j = newPlayerIndex[1]-1
                        if(gameData.game.grid[i][j]%10!==1){
                            newPlayerIndex[1]-=1
                        }
                    }
                    break;
                case('ArrowUp'):
                    e.preventDefault();
                    if(newPlayerIndex[0]!==0){
                        const i = newPlayerIndex[0]-1
                        const j = newPlayerIndex[1]
                        if(gameData.game.grid[i][j]%10!==1){
                            newPlayerIndex[0]-=1
                        }
                    }
                    break;
                case('Space'):
                    const mouseIndex = prev.mouseIndex;
                    const playerIndex = prev.playerIndex;
                    const manhattanDistance = Math.abs(mouseIndex[0]-playerIndex[0])+Math.abs(mouseIndex[1]-playerIndex[1]);
                    if(Math.random()< Math.exp(-.1155*(manhattanDistance-1))){
                        sensorLog.push({position: playerIndex, turn:prev.turn+1, beep: true})
                    }
                    else{
                        sensorLog.push({position: playerIndex, turn:prev.turn+1, beep: false})
                    }
                    break;
            }
            let mouseIndex;
            let gameStatus = 'in_progress';
            if(gameData.game.stoch){ 
                mouseIndex = gameData.game.mousePath[prev.turn]
            }else{
                mouseIndex = gameData.game.mouseStartingIndex
            }
            const [k,h] = newPlayerIndex
            if(k===mouseIndex[0]&&h===mouseIndex[1]){
                gameStatus = 'win'
            }
            
            if(prev.turn === gameData.bot4.evidence.length){
                gameStatus = 'lose'
            }
            const playerPath = prev.playerPath.map(row => [...row])
            playerPath.push(newPlayerIndex)
            if(gameStatus!=='in_progress'){
                handleGameOver(gameStatus,playerPath,sensorLog)
            }
            return({
                turn: prev.turn+1,
                mouseIndex: mouseIndex,
                playerIndex: newPlayerIndex,
                gameStatus: gameStatus,
                playerPath,
                sensorLog
            })
            });
        }   
        window.addEventListener('keydown',handleKeyDown);
        return () => {
          window.removeEventListener('keydown',handleKeyDown);
        }
      }, [gameData]);

    async function handleGameOver(result,path,sensorLog){
        const username = localStorage.getItem(USERNAME);
        const obj = {result,path,username,sensorLog,id:gameID.current}
        const response = await api.post('handle_game_over_mousegame/',obj)
            .then(response => {console.log(response)})
            .catch((e)=>{console.log('Check handleGameOver in Mousegame.jsx');
                console.log(e)
            })
    }

    const stochoptions = ['stationary','stochastic']

    return <div><div className='min-h-screen bg-black text-cyan-200 font-mono'>
    <div>
    <NavBar/>
    {showInstructions && 
        <div className="fixed scale-85 transform flex justify-center items-center z-20 bg-black bg-opacity-80">
            <MousegameInstructions noMoreLevels={noMoreLevels} stoch={stoch} 
        setStoch={setStoch} 
        setShowInstructions={setShowInstructions}/></div>}
    
    <div className='grid grid-cols-[1fr_auto_1fr]'>
    <div className=''></div>
    {(gameData && stoch) && <div className='relative'>
        {showNewGameMenu && <div className="fixed ml-62 mt-70 z-30 bg-black bg-opacity-80">
            <div className="relative border border-gray-300 bg-gray-800/90 z-10">
            <div className="flex flex-col items-center p-7">
                {stochoptions.map(stoch=>{return <button className='hover:underline pb-4' onClick={()=>{setStoch(dif); setShowNewGameMenu(false);}}>
                New game, {stoch} mouse</button>})}
                <button className='hover:underline' onClick={()=>setShowNewGameMenu(false)}>Close</button>
            </div></div></div>}
        <RenderGridMousegame 
            data={gameData} 
            turn={gameState.turn} 
            sensorLog = {gameState.sensorLog}
            showSenses = {showSenses}
            playerIndex={gameState.playerIndex ? gameState.playerIndex : gameData.game.botStartingIndex}
            mouseIndex = {gameState.mouseIndex ? gameState.mouseIndex : gameData.game.mouseStartingIndex}
            playerPath ={gameState.playerPath ? gameState.playerPath : [gameData.game.botStartingIndex]}
            hoverIndex = {hoverIndex}
            seePath = {seePath}/>
        <div className='flex justify-between'>
            <button className='hover:underline' onClick={()=>setShowNewGameMenu(prev=>!prev)}>New game</button>
            <button className='hover:underline' onClick={()=>setShowInstructions(prev=>!prev)}>Instructions</button>
            <button className='hover:underline' onClick={()=>setShowAbout(prev=>!prev)}>About</button>
        </div>
        <div className='absolute right-0 ml-4' style={{ top: 'calc(var(--navbar-height) + 1rem)' }}>
        
    </div></div>}
    {showAbout && <div className='fixed'><MousegameAbout/></div>}
    
    
    {gameState.gameStatus!=='in_progress'&& <div className='fixed'><GameOverMenu
                        gameState={gameState}
                        setGameState={setGameState}
                        setStoch={setStoch} 
                        setStochVersion={setStochVersion}
                        gameID={gameID}
                        noMoreLevels={noMoreLevels}/>
        </div>}
    <div className=''><div className='bg-gray-800 border border-white m-8'>{stoch && <SensorInfoBox 
    sensorLog={gameState.sensorLog} 
    boxRef={boxRef} 
    showSenses={showSenses} 
    setShowSenses={setShowSenses}
    hoverIndex={hoverIndex}
    setHoverIndex={setHoverIndex}
    seePath = {seePath}
    setSeePath = {setSeePath}/>}</div></div>
    </div></div></div></div>
}