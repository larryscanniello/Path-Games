import {useState, useEffect, useRef} from 'react'
import RenderGridMousegame from './RenderGridMousegame';
import SensorInfoBox from './SensorInfoBox';

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
    const boxRef = useRef(null);
    const [showSenses,setShowSenses] = useState(false);
    const [hoverIndex,setHoverIndex] = useState(null);

    useEffect(() => {
        async function fetchGame(){
            try{
            const res = await fetch('http://localhost:8000/api/mousegame/10');
            if(!res.ok){
                throw new Error('Game not found')
            }
            const responsedata = await res.json()
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
                }
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
            } catch(err){
                setError(err.message);
            }
        }
        fetchGame();
        }, [])

        useEffect(()=>{
            if(boxRef){
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
            
            if(prev.turn === gameData.bot3.evidence.length){
                gameStatus = 'lose'
            }
            const playerPath = prev.playerPath.map(row => [...row])
            playerPath.push(newPlayerIndex)
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

    
    return <><div> <a href='/'>Home</a> This is the mouse game. 
    Turn: {gameState.turn} 
    Game Status: {gameState.gameStatus} 
    <button onClick={()=>window.location.reload()}>Restart</button>
    {gameData ? <RenderGridMousegame 
    data={gameData} 
    turn={gameState.turn} 
    sensorLog = {gameState.sensorLog}
    showSenses = {showSenses}
    playerIndex={gameState.playerIndex ? gameState.playerIndex : gameData.game.botStartingIndex}
    mouseIndex = {gameState.mouseIndex ? gameState.mouseIndex : gameData.game.mouseStartingIndex}
    playerPath ={gameState.playerPath ? gameState.playerPath : [gameData.game.botStartingIndex]}
    hoverIndex = {hoverIndex}/> : <div>Loading...</div>}
    <SensorInfoBox 
    sensorLog={gameState.sensorLog} 
    boxRef={boxRef} 
    showSenses={showSenses} 
    setShowSenses={setShowSenses}
    hoverIndex={hoverIndex}
    setHoverIndex={setHoverIndex}/>
    </div>
    </>
}