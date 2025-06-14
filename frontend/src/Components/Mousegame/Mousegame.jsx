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
import '../../Styles/mouse.css'
import { useWindowSize } from '../useWindowSize';

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
    const [seePath,setSeePath] = useState(false);
    const winRateRef = useRef(null);
    const leaderboard = useRef(null);
    const [frameIndex,setFrameIndex] = useState(0);
    const [levelsLeft,setLevelsLeft] = useState(null);
    const [sensorCounts,setSensorCounts] = useState(null);
    const [gridColors,setGridColors] = useState(null);
    const [flashState,setFlashState] = useState({show:false,color:''});    
    const [flashList,setFlashList] = useState([]);
    const [width,height] = useWindowSize();

    useEffect(() => {
        async function fetchGame(){
            try{
            const res = await api.post('mousegame/',{
                stoch,                
            })
            .catch((e)=>{throw new Error("Error fetching game.")});
            const responsedata = res.data;
            console.log(responsedata.success)
            if(!responsedata.success){
                console.log('check-1')
                setLevelsLeft(responsedata.levels_left);          
            }else if(stoch){
                setLevelsLeft(responsedata.levels_left);
                gameID.current = responsedata.game.id
                winRateRef.current = responsedata.win_rate
                leaderboard.current = responsedata.leaderboard
                const bot4evidence = JSON.parse(responsedata.bots[3].evidence).slice(1);
                const bot4path = bot4evidence.map(([t,type,[i,j]])=> [i,j])
                const grid = JSON.parse(responsedata.game.grid)
                const parseddata = {
                    game: {
                        grid,
                        stoch: responsedata.game.stochastic,
                        mousePath: responsedata.game.mouse_path,
                        botStartingIndex: JSON.parse(responsedata.game.bot_starting_index),
                        mouseStartingIndex: JSON.parse(responsedata.game.mouse_starting_index)
                    },
                    bot1: {
                        evidence: JSON.parse(responsedata.bots[0].evidence).slice(1),
                    },
                    bot2: {
                        evidence: JSON.parse(responsedata.bots[1].evidence).slice(1),
                    },
                    bot3: {
                        evidence: JSON.parse(responsedata.bots[2].evidence).slice(1),
                    },
                    bot4: {
                        evidence: bot4evidence,
                        path: bot4path,
                    }
                }
                if(!responsedata.game.stochastic){
                    setSeePath(true);
                }
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
                setSensorCounts(Array.from({ length: 25 }, () => Array.from({ length: 25 }, () => [0, 0])))
                setGridColors(Array.from({length: 25},()=> Array.from({length: 25},()=>-1)))
            }

            } catch(err){
                setError(err.message);
            }
        }
        fetchGame();
        }, [stoch,stochVersion])

        useEffect(()=>{
            if(boxRef&&stoch){
                boxRef.current.scrollTop = boxRef.current.scrollHeight;
            }
        },[gameState])

        useEffect(() => {
            const handleBeforeUnload = () => {
                if(gameState.gameStatus==='in_progress'&&gameState.turn>0){
                    const username = localStorage.getItem(USERNAME);
                    const obj = {
                        result: 'lose',
                        path: gameState.playerPath,
                        username,
                        sensorLog: gameState.sensorLog,
                        id: gameID.current
                    };
                    navigator.sendBeacon('http://localhost:8000/api/handle_game_over_mousegame/', JSON.stringify(obj));
                }   
            };
            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }, [gameState.playerPath, gameState.sensorLog, gameState.gameStatus,gameID]);
        

      useEffect(() => {
        const handleKeyDown = (e) => {
            setGameState(prev => {
            if(!prev||prev.gameStatus!=='in_progress') return prev;
            const newTurn = Math.min(gameData.bot4.evidence.length-1, prev.turn + 1);
            const newPlayerIndex = prev.playerIndex ? [...prev.playerIndex] : [...gameData.game.botStartingIndex]
            const sensorLog = prev.sensorLog;
            let sensorLogObj;
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
                    let bot4index;
                    if(gameData){
                        if(newTurn-1!==0){
                            bot4index = gameData.bot4.path[Math.min(newTurn-1,gameData.bot4.path.length-1)];
                        }
                        else{
                            bot4index = gameData.game.botStartingIndex;
                        }
                    }
                    const manhattanDistance = Math.abs(mouseIndex[0]-playerIndex[0])+Math.abs(mouseIndex[1]-playerIndex[1]);
                    const beep = Math.random()< Math.exp(-.1155*(manhattanDistance-1));
                    if(beep){
                        sensorLogObj = {position: playerIndex, turn:prev.turn+1, beep: true}
                    }
                    else{
                        sensorLogObj = {position: playerIndex, turn:prev.turn+1, beep: false}
                    }
                    const color = beep ? 'bg-green-400' : 'bg-red-400';
                    let flashPosition;
                    if(bot4index[0]===playerIndex[0]&&bot4index[1]===playerIndex[1]){
                        if(width<1000||height<785){
                            flashPosition = {top:"1px",left:"5px"}
                        }
                        else if(width<1100||height<900){
                            flashPosition = {top:"2px",left:"8px"}
                        }
                        else{
                            flashPosition = {top:"4px",left:"11px"};
                        }
                        
                    }else{
                        if(width<1000||height<785){
                            flashPosition = {top:".2px",left:".2px"}
                        }
                        else if(width<1100||height<900){
                            flashPosition = {top:"1.25px",left:"1.3px"}
                        }
                        else{
                            flashPosition = {top:"4px",left:"4px"};
                        }
                    }
                    const flash = { id: Date.now(),  color, flashPosition };
                    setFlashList(prev => [...prev, flash]);
                    setTimeout(() => {
                        setFlashList(prev => prev.filter(f => f.id !== flash.id));
                        }, 300);
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
            if(gameStatus!=='in_progress'){
                handleGameOver(gameStatus,[...prev.playerPath,newPlayerIndex],sensorLog)
            }
            if(prev.turn+1===1){
                handleFirstTurn()
            }
            async function handleFirstTurn(){
                const username = localStorage.getItem(USERNAME);
                const obj = {username,id:gameID.current}
                const res = api.post('/handle_first_turn_mousegame/',obj)
                .catch(e=>{console.log('Check handleFirstTurn',e)})
            }
            return({
                turn: prev.turn+1,
                mouseIndex: mouseIndex,
                playerIndex: newPlayerIndex,
                gameStatus: gameStatus,
                playerPath: [...prev.playerPath,newPlayerIndex],
                sensorLog: [...sensorLog,sensorLogObj]
            })
            });
        }   
        window.addEventListener('keydown',handleKeyDown);
        return () => {
          window.removeEventListener('keydown',handleKeyDown);
        }
      }, [gameData,width,height]); 


      useEffect(()=>{
        function getColorFromValue(a,b) {
            if(a===0){
                return `bg-red-400`
            }
            let ratio = a/Math.max(b,5);
            if(ratio<=.2){
                return 'bg-green-100'
            }else if(ratio<=.4){
                return 'bg-green-200'
            }else if(ratio<=.6){
                return 'bg-green-300'
            }else if(ratio<=.8){
                return 'bg-green-400'
            }else{
                return 'bg-green-500'
            }
          }

        if(gameState.sensorLog){
            if(gameState.sensorLog.length>0){
                const index = gameState.sensorLog.length-1
                if(gameState.sensorLog[index]){
                    const i = gameState.sensorLog[index].position[0]
                    const j = gameState.sensorLog[index].position[1]
                    setSensorCounts(prev => {
                        const newCounts = [...prev];
                        newCounts[i] = [...newCounts[i]];
                        newCounts[i][j] = [...newCounts[i][j]];
                        newCounts[i][j][1] += 1;
                        if (gameState.sensorLog[index].beep) {
                            newCounts[i][j][0] += 1;
                        }
                        const newColors = [...gridColors];
                        newColors[i] = [...newColors[i]];
                        newColors[i][j] = getColorFromValue(newCounts[i][j][0], newCounts[i][j][1]);
                        setGridColors(newColors);
                        return newCounts;
                    });
                }
            }
        }
      },[gameState.sensorLog,gameState.turn])



    async function handleGameOver(result,path,sensorLog){
        setLevelsLeft(prev=>{
            const newll = [...prev];
            if(stoch==='stationary'){
                newll[0]-=1
            }
            else{
                newll[1]-=1
            }
            return newll
        })
        const username = localStorage.getItem(USERNAME);
        const obj = {result,path,username,sensorLog,id:gameID.current}
        const response = await api.post('handle_game_over_mousegame/',obj)
            .then(response => {console.log(response)})
            .catch((e)=>{console.log('Check handleGameOver in Mousegame.jsx');
            })
    }

   
    const stochoptions = ['stationary','stochastic']
    let bot4index;
    if(gameData){
        if(gameState.turn!==0){
            bot4index = gameData.bot4.path[Math.min(gameState.turn-1,gameData.bot4.path.length-1)];
        }
        else{
            bot4index = gameData.game.botStartingIndex;
        }
    }
    if (width < 900 || height < 695) {
        return (
          <div className="flex flex-col justify-center items-center h-screen px-4 text-center text-cyan-100">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Window Too Small</h2>
            <p className="mb-2">The content can’t fit in a window this small.</p>
            <p>If you had something in progress, increase screen height or width to resume.</p>
          </div>
        );
      }
    return <div>
    {(showInstructions && levelsLeft) &&
        <div className="fixed transform flex justify-center items-center z-90">
            <MousegameInstructions  stoch={stoch} 
                                    setStoch={setStoch} 
                                    setShowInstructions={setShowInstructions}
                                    levelsLeft = {levelsLeft}/>
        </div>}
    {gameState.gameStatus!=='in_progress'&& <div className='fixed z-60 mt-8 ml-4'><GameOverMenu
                        gameState={gameState}
                        setGameState={setGameState}
                        setStoch={setStoch} 
                        setStochVersion={setStochVersion}
                        levelsLeft = {levelsLeft}
                        gameID={gameID}
                        />
        </div>}
    {(gameData && stoch)  && <div className='mousegame-div grid grid-cols-[1fr_auto_1fr]'>
    <div className=''></div>
    {(gameData && stoch) && <div className='relative z-50'>
        {showNewGameMenu && <div className="fixed ml-52 mt-70 z-90">
            <div className="relative bg-gray-800/90 z-10 rounded-md flex flex-col items-center p-7">
            {stochoptions.map((stochvar,i)=>
                    {return levelsLeft[i]>0 ? <button className='hover:underline pb-4 text-white' 
                                            onClick={()=>{setStoch(stochvar);
                                            setShowNewGameMenu(false);}}
                                        >New {stochvar==='stochastic' ? 'moving' : 'stationary'} mouse game ({levelsLeft[i]} left)</button> 
                                : <div className="opacity-60 pb-4 text-white">No {stochvar} levels left</div>})}
                <button className='hover:underline text-white' onClick={()=>setShowNewGameMenu(false)}>Close</button>
            </div></div>}
        {showAbout && <div className='fixed z-90'><MousegameAbout setShowAbout={setShowAbout}/></div>}
        <RenderGridMousegame 
            grid = {gameData.game.grid}
            turn={gameState.turn} 
            sensorLog = {gameState.sensorLog}
            showSenses = {showSenses}
            bot4index = {bot4index}
            playerIndex={gameState.playerIndex ? gameState.playerIndex : gameData.game.botStartingIndex}
            mouseIndex = {gameState.mouseIndex ? gameState.mouseIndex : gameData.game.mouseStartingIndex}
            playerPath ={gameState.playerPath ? gameState.playerPath : [gameData.game.botStartingIndex]}
            hoverIndex = {hoverIndex}
            seePath = {seePath}
            frameIndex = {frameIndex}
            gameStatus = {gameState.gameStatus}
            sensorCounts={sensorCounts}
            setSensorCounts={setSensorCounts}
            colors={gridColors}
            flashState={flashState}
            flashList={flashList}
            width={width}
            height={height}/>
            
        <div className='flex justify-between'>
            <button className='hover:underline' onClick={()=>setShowNewGameMenu(prev=>!prev)}>New game</button>

            <button className='hover:underline' onClick={()=>setShowInstructions(prev=>!prev)}>Instructions</button>
            <button className='hover:underline' onClick={()=>setShowAbout(prev=>!prev)}>About/Hints</button>
        </div>
        <div className='absolute right-0 ml-4' style={{ top: 'calc(var(--navbar-height) + 1rem)' }}>
        
    </div></div>}
    
    
    <div className="pt-8 pl-10 pr-10 backdrop-blur-md">
        {stoch && (
            <div className="border-2 border-cyan-400/30 rounded-md shadow-[0_0_6px_rgba(0,255,255,0.15)] backdrop-blur-xl bg-black/60 text-cyan-100">
            
            <div className="flex flex-col text-cyan-100 p-4">
                <div className="text-[18px] font-bold">Mousegame, Map {gameID.current}</div>
                <div className="text-[13px]">Mode: {stoch==='stochastic' ? 'moving' : 'stationary'} mouse</div>
            </div>

            <div className="flex flex-col p-4 text-cyan-100">
                <div>Turn: {gameState.turn}</div>
            </div>

            <div className="flex flex-col items-center p-2">
                <div className=" border-white rounded-md w-full">
                <SensorInfoBox 
                    sensorLog={gameState.sensorLog} 
                    boxRef={boxRef} 
                    showSenses={showSenses} 
                    setShowSenses={setShowSenses}
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                    seePath={seePath}
                    setSeePath={setSeePath}
                />
                </div>
            </div>

            <div className="text-cyan-100 flex flex-col p-4">
                <div className="text-[15px] font-semibold">Map {gameID.current} Leaderboard</div>
                <div className="border border-gray-500 p-4 rounded-2xl text-[14px]">
                {leaderboard.current && leaderboard.current.length > 0 ? (
                    leaderboard.current.map(([leader, turns], i) => {
                    const plus = turns - leaderboard.current[0][1];
                    return (
                        <div key={i} className="flex flex-row justify-between">
                        <div>{leader}</div>
                        <div>{i > 0 ? `+${plus}` : null}</div>
                        </div>
                    );
                    })
                ) : (
                    <div>No winners yet</div>
                )}
                </div>
            </div>

            </div>
        )}
</div>

    </div>}</div>
}