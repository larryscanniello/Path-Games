import { useState, useEffect, useRef } from "react";
import NavBar from "../NavBar";
import RenderGridSeeMouseBots from './RenderGridSeeMouseBots.jsx'
import SelectGameMenu from "./SelectGameMenu.jsx";
import api from "../../api.js";
import { USERNAME } from "../../constants.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SeeMousegameInstructions from "./SeeMouseGameInstructions.jsx";
import SeeMousegameAbout from "./SeeMousegameAbout.jsx"

export default function SeeMiceBots(){
    const [simData,setSimData] = useState(null);
    const [turn, setTurn] = useState(0);
    const [error, setError] = useState(null);
    const [play, setPlay] = useState(false);
    const [showProbabilities,setShowProbabilities] = useState(0);
    const [showGameSelection,setShowGameSelection] = useState(null);
    const intervalRef = useRef(null);
    const [gameList,setGameList] = useState(null);
    const [showAgent,setShowAgent] = useState([false,false,false,true,true]);
    const {username, gameID} = useParams();
    const [currentGame,setCurrentGame] = useState(gameID);
    const [showInstructions,setShowInstructions] = useState(null);
    const [showAbout,setShowAbout] = useState(null);
    const [showToMousegame,setShowToMousegame] = useState(null);
    const showGameRef = useRef(null);
    const winRateRef = useRef(null);
    const [leaderboard,setLeaderboard] = useState(null);
    const [directionFrames,setDirectionFrames] = useState(['03','04','05'])
    const [frameIndex,setFrameIndex] = useState(0);
    const restartButtonRef = useRef(null);
    const showBotRef = useRef(null);
    const showProbabilitiesRef = useRef(null);

    useEffect(()=>{
        async function fetchGameList(){
            const res = await api.post('getmousegamelist/',{
                username: localStorage.getItem(USERNAME),
            })
            .catch((e)=>{throw new Error("Error fetching list.")});
            setGameList(res.data.map(([id,result,stoch,datetime,rate])=>{
                const date = new Date(datetime);
                return [id,result,stoch,date,rate];
            }));
        }
        fetchGameList();
    },[])

    useEffect(() => {
        async function fetchGame(){
          try{
            const res = await api.post('get_mousegame_by_id/',
            {
                username: localStorage.getItem(USERNAME),
                id: currentGame,
            })
            .catch((e)=>{throw new Error("Error fetching game.")});
            const responsedata = res.data;
            setLeaderboard(responsedata.leaderboard)
            const bot3evidence = JSON.parse(responsedata.bots[2].evidence);
            bot3evidence[0] = bot3evidence[1];
            const bot1path = JSON.parse(responsedata.bots[0].evidence).slice(1).map(([t,type,[i,j]])=> [i,j])
            const bot2path = JSON.parse(responsedata.bots[1].evidence).slice(1).map(([t,type,[i,j]])=> [i,j])
            const bot3path = bot3evidence.slice(1).map(([t,type,[i,j]])=> [i,j])
            const bot4path = JSON.parse(responsedata.bots[3].evidence).slice(1).map(([t,type,[i,j]])=> [i,j])
            const simlength = Math.max(bot1path.length,bot2path.length,bot3path.length,bot4path.length)
            const parseddata = {
                game: {
                    grid: JSON.parse(responsedata.game.grid),
                    stoch: responsedata.game.stochastic,
                    mouse_path: responsedata.game.mouse_path.slice(1),
                    bot_starting_index: JSON.parse(responsedata.game.bot_starting_index),
                    mouse_starting_index: JSON.parse(responsedata.game.mouse_starting_index),
                    player_path: responsedata.playerdata.player_path,
                    result: responsedata.playerdata.result,
                    simlength,
                },
                bot1: {
                    evidence: JSON.parse(responsedata.bots[0].evidence).slice(1),
                    states: JSON.parse(responsedata.bots[0].states),
                    path: bot1path,
                    plans: responsedata.bots[0].plans
                },
                bot2: {
                    evidence: JSON.parse(responsedata.bots[1].evidence).slice(1),
                    states: JSON.parse(responsedata.bots[1].states),
                    path: bot2path,
                    plans: responsedata.bots[1].plans
                },
                bot3: {
                    evidence: JSON.parse(responsedata.bots[2].evidence).slice(1),
                    states: JSON.parse(responsedata.bots[2].states),
                    path: bot3path,
                    plans: responsedata.bots[2].plans
                },
                bot4: {
                    evidence: JSON.parse(responsedata.bots[3].evidence).slice(1),
                    states: JSON.parse(responsedata.bots[3].states),
                    plans: responsedata.bots[3].plans,
                    modechange: responsedata.bots[3].modechange,
                    path: bot4path,
                }
            }
            setSimData(parseddata);
            setTurn(0);
          } catch(err){
          setError(err.message)
          }
        }
        if(currentGame){
            fetchGame();
        }
      }, [currentGame])

    useEffect(() => {
        const handleKeyDown = (e) => {
          if(simData){
            const simlength = Math.max(simData.bot1.evidence.length,simData.bot2.evidence.length,simData.bot3.evidence.length,simData.bot4.evidence.length)
            if(e.code === 'ArrowRight'){
                setTurn((prev)=>{
                const newTurn = Math.min(simlength+1, prev + 1);
                return newTurn
                });
            } else if (e.code === 'ArrowLeft'){
                setTurn((prev) => {
                const newTurn = Math.max(0,prev-1)
                return newTurn
                })
            } else if (e.code === 'Space'){
                if(!play){
                setTurn((prev)=>{
                const newTurn = Math.min(simlength+1, prev + 1);
                return newTurn
                });
                }
                setPlay((prev)=> !prev)
            }
            };
        };
        if(simData){
          window.addEventListener('keydown',handleKeyDown);
        };
        return () => {
          window.removeEventListener('keydown',handleKeyDown);
        }
      }, [simData]);

    useEffect(()=>{
        if(play){
        intervalRef.current = setInterval(()=>{
        setTurn(prev => {
            const simlength = simData.game.simlength;
            const newTurn = Math.min(simlength+1, prev + 1);
            return newTurn
        })
        },250)
        return () => clearInterval(intervalRef.current)
        }
    },[play])

    useEffect(()=>{
      if(play){
        if(turn>simData.game.simlength){
          setPlay(false);
          clearInterval(intervalRef.current);
        }
      }
      
    },[turn])

    useEffect(() => {
      if(simData){
      const simlength = Math.max(simData.bot1.evidence.length,simData.bot2.evidence.length,simData.bot3.evidence.length,simData.bot4.evidence.length)
        if (simData && 1<turn&&turn<simlength) {
          const path = simData.game.mouse_path;
          const deltai = path[turn-1][0] - path[turn-2][0];
          const deltaj = path[turn-1][1] - path[turn-2][1];
            
          if (deltai === -1) {
            setDirectionFrames(['00', '01', '02']);
          } else if (deltai === 1) {
            setDirectionFrames(['06', '07', '08']);
          } else if (deltaj === 1) {
            setDirectionFrames(['03', '04', '05']);
          } else if (deltaj === -1) {
            setDirectionFrames(['09', '10', '11']);
          }
        }}
      }, [turn]);

      useEffect(() => {
        const interval = setInterval(() => {
          setFrameIndex(prev => (prev + 1) % 3);
        }, 150);
        return () => clearInterval(interval);
      }, [directionFrames]);

    useEffect(()=>{
        if(showGameRef.current&&simData){
            showGameRef.current.scrollTop = showGameRef.current.scrollHeight;
        }
    },[showGameSelection])

    const optionarray = ["1", "2", "3", "4", username]
    const optionarray2 = ["1", "2", "3", "4"]


  return (
    <div>
        <div className="min-h-screen bg-black text-cyan-200 font-mono">
        <NavBar/>
        <div className='grid grid-cols-[1fr_auto_1fr]'>
        <div>
        <div className="flex fixed">
        </div>
        {showAbout && <SeeMousegameAbout setShowAbout={setShowAbout}/>}

            </div><div>
        {showGameSelection && <div><SelectGameMenu 
                    showGameSelection={showGameSelection} 
                    setShowGameSelection={setShowGameSelection} 
                    currentGame={currentGame}
                    setCurrentGame={setCurrentGame}
                    gameList={gameList}
                    showGameRef={showGameRef}
                    winRateRef={winRateRef}/></div>}
        {showInstructions && 
                    <SeeMousegameInstructions setShowInstructions={setShowInstructions}/>}
        {showToMousegame && <div className='fixed z-20'><ToMousegame setShowToMousegame={setShowToMousegame}/></div>}

        {<RenderGridSeeMouseBots 
            data={simData} 
            turn={turn} 
            showProbabilities={showProbabilities}
            showAgent = {showAgent}
            frameIndex = {frameIndex}
            directionFrames = {directionFrames}
            />}
        <div className='flex justify-between'>
            <button className='hover:underline' onClick={()=>setShowGameSelection(prev=>!prev)}>Visualize new game</button>
            <button className="hover:underline" onClick={()=>setShowToMousegame(prev=>!prev)}>Mousegame</button>
            <button className="hover:underline" ref={restartButtonRef} onClick={(e)=>{
                if(restartButtonRef.current){
                    restartButtonRef.current.blur()
                }; setTurn(0);}}>Restart</button>
            <button className='hover:underline' onClick={()=>setShowInstructions(prev=>!prev)}>Instructions</button>
            <button className='hover:underline' onClick={()=>setShowAbout(prev=>!prev)}>About</button>
        </div></div>
        <div>
        <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4">
                <div>Mousegame Visualizer, Map {currentGame}</div>
                {simData && <div>Mode: {simData.game.stoch ? 'Stochastic' : 'Stationary'} mouse</div>}
                {simData && <div>Result: {simData.game.result}</div>}                                    
                <div className="">Map win rate: {Math.round(winRateRef.current*100)}%</div>
            </div> 
            <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4">
                <div>Turn: {turn}</div>
            </div>    
            <div className='bg-gray-800 border border-white m-8 p-2'><div>Show bot:</div><div className="ml-6 mr-6">
            {optionarray.map((option,i)=><label className={i===4&&'text-xs'}><input type="checkbox" checked={showAgent[i]}
                                                onChange={(e)=>setShowAgent(prev=>{
                                                    e.target.blur()
                                                    const updated = [...prev]
                                                    updated[i]=!prev[i];
                                                    return updated
                                                })}/>{option}&nbsp;&nbsp;</label>)}</div>
            <div>Show Probabilities:<div className="flex ml-6 mr-6">                                    
            {optionarray2.map((option,i)=><label><input type="checkbox" checked={showProbabilities===i+1}
                                                onChange={(e)=>{
                                                    if(showProbabilities===i+1){
                                                        setShowProbabilities(0);
                                                    }else setShowProbabilities(i+1);
                                                    e.target.blur()}}/>{option}&nbsp;&nbsp;</label>)}</div>      
            </div>
            </div>
            <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4">
            <div>Map {currentGame} Leaderboard</div>
            <div className='border border-gray-500 p-4'>{leaderboard && leaderboard.length>0 ? leaderboard.map(([leader,turns],i)=>{
            return <div className='flex justify-between'><div>{leader}</div><div className='ml-40'></div><div>{turns}</div></div>}) : <div>No winners yet</div>}</div>
            </div>
            
            </div>
        </div>
        </div>
    </div>
  )
}


function ToMousegame(props){
    return(
      <div className="border border-gray-300 bg-gray-800/90 mt-80 ml-68 mr-24 mb-12">
        <div className="flex flex-col items-center pr-8 pl-8 pb-6">
          <Link className="hover:underline pt-6 text-white" to="/mousegame">Proceed To Mousegame</Link>
          <div className="pt-3"><button onClick={()=>props.setShowToMousegame(false)} className="text-white hover:underline content-center">Close</button></div>
        </div>
      </div>
    )
  }

/*
{optionarray.map((option,i)=><label><input type="checkbox" checked={showAgent[i]}
                                                onChange={()=>setShowAgent(prev=>{
                                                    const updated = [...prev]
                                                    updated[i]=!prev[i];
                                                    return updated
                                                })}/>Show {option}</label>)}
    <div>Show Probabilities:                                          
    {optionarray2.map((option,i)=><label><input type="checkbox" checked={showProbabilities===i+1}
                                        onChange={()=>{
                                            if(showProbabilities===i+1){
                                                setShowProbabilities(0);
                                            }else setShowProbabilities(i+1)}}/>
                                        {option}</label>)}
    </div>
<SelectGameMenu showGameSelection={showGameSelection} 
                    setShowGameSelection={setShowGameSelection} 
                    currentGame={currentGame}
                    setCurrentGame={setCurrentGame}
                    gameList={gameList}/>
    */