import { useState, useEffect, useRef } from "react";
import NavBar from "../NavBar.jsx";
import RenderGridSeeMouseBots from './RenderGridSeeMouseBots.jsx'
import SelectGameMenu from "./SelectGameMenu.jsx";
import api from "../../api.js";
import { USERNAME } from "../../constants.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SeeMousegameInstructions from "./SeeMouseGameInstructions.jsx";
import SeeMousegameAbout from "./SeeMousegameAbout.jsx"
import { useWindowSize } from "../useWindowSize.jsx";
import "../../Styles/mouse.css"

export default function SeeMiceBots(){
    const [simData,setSimData] = useState(null);
    const [turn, setTurn] = useState(0);
    const [error, setError] = useState(null);
    const [play, setPlay] = useState(false);
    const [showProbabilities,setShowProbabilities] = useState(false);
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
    const [directionFrames,setDirectionFrames] = useState(['anim-r'])
    const [frameIndex,setFrameIndex] = useState(0);
    const restartButtonRef = useRef(null);
    const [flashList,setFlashList] = useState([[],[],[],[],[]])
    const [width,height] = useWindowSize()

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
            winRateRef.current = gameList.find(([id,result,stoch,date,rate])=>id==currentGame)[4]
            const bot3evidence = JSON.parse(responsedata.bots[2].evidence);
            bot3evidence[0] = bot3evidence[1];
            const bot1path = JSON.parse(responsedata.bots[0].evidence).slice(1).map(([t,type,[i,j]])=> [i,j]);
            const bot2path = JSON.parse(responsedata.bots[1].evidence).slice(1).map(([t,type,[i,j]])=> [i,j]);
            const bot3path = bot3evidence.slice(1).map(([t,type,[i,j]])=> [i,j]);
            const bot4path = JSON.parse(responsedata.bots[3].evidence).slice(1).map(([t,type,[i,j]])=> [i,j]);
            const simlength = Math.max(bot1path.length,bot2path.length,bot3path.length,bot4path.length);
            const bot1plans = responsedata.bots[0].plans;
            const bot2plans = responsedata.bots[1].plans;
            bot2plans.unshift([null]);
            const bot3plans = responsedata.bots[2].plans;
            const bot4plans = responsedata.bots[3].plans;
            const bot1plansprocessed = [];
            const bot3plansprocessed = [];
            const bot4plansprocessed = [];
            for(let i=0;i<bot1path.length;i++){
              bot1plansprocessed.push(processFromFlatIndexBot3(bot1plans,i-1))
            }
            for(let i=0;i<bot3path.length;i++){
              bot3plansprocessed.push(processFromFlatIndexBot3(bot3plans,i-1))
            }
            for(let i=0;i<bot4path.length;i++){
              bot4plansprocessed.push(processFromFlatIndexBot4(bot4plans,i-6))
            }
            const parseddata = {
                game: {
                    grid: JSON.parse(responsedata.game.grid),
                    stoch: responsedata.game.stochastic,
                    mouse_path: responsedata.game.mouse_path.slice(1),
                    bot_starting_index: JSON.parse(responsedata.game.bot_starting_index),
                    mouse_starting_index: JSON.parse(responsedata.game.mouse_starting_index),
                    player_path: responsedata.playerdata.player_path,
                    player_length: responsedata.playerdata.player_path.length,
                    result: responsedata.playerdata.result,
                    player_sensor_log: responsedata.playerdata.sensor_log,
                    simlength,
                },
                bot1: {
                    evidence: JSON.parse(responsedata.bots[0].evidence).slice(1),
                    path: bot1path,
                    plans: bot1plansprocessed,
                    length: bot1path.length,
                },
                bot2: {
                    evidence: JSON.parse(responsedata.bots[1].evidence).slice(1),
                    path: bot2path,
                    plans: bot2plans,
                    length: bot2path.length,
                },
                bot3: {
                    evidence: JSON.parse(responsedata.bots[2].evidence).slice(1),
                    path: bot3path,
                    plans: bot3plansprocessed,
                    length: bot3path.length,
                },
                bot4: {
                    evidence: JSON.parse(responsedata.bots[3].evidence).slice(1),
                    states: responsedata.bots[3].states,
                    plans: bot4plansprocessed,
                    modechange: responsedata.bots[3].modechange,
                    path: bot4path,
                    length: bot4path.length,
                }
            }
            setFlashList([[],[],[],[],[]])
            setSimData(parseddata);
            setTurn(0);

        function processFromFlatIndexBot4(botplans, t) {
        let count = 0;
        for (let i = 0; i < botplans.length; i++) {
            const row = botplans[i];
            if(row.length==0&&count>0){
                count +=1;
                continue; 
            }
            if (t < count + row.length) {
                let startIndexInRow;
                startIndexInRow = t-count;
                if(startIndexInRow<0){
                    return [null];
                }
                return row.slice(startIndexInRow);
            }
            if(i==0){
                continue;
            }
            else{
                count += row.length+1
            }
        }
        return []
      }
        function processFromFlatIndexBot3(botplans, t) {
          let count = 0;
          for (let i = 0; i < botplans.length; i++) {
              const row = botplans[i];
              if (t < count + row.length) {
                  let startIndexInRow;
                  startIndexInRow = t-count;
                  if(startIndexInRow<0){
                      return [null];
                  }
                  return row.slice(startIndexInRow);
              }
              count += row.length+1
          }
          return []
      }
    
          } catch(err){
          setError(err.message)
          }
        }
        if(currentGame&&gameList){
            fetchGame();
        }
      }, [currentGame,gameList])

      function handleFlashes(newTurn,simData){
        const evidence = []
        if(simData.game.player_sensor_log[newTurn-1]){
          evidence.push([4,simData.game.player_sensor_log[newTurn-1].beep ? 1 : 0])
        }
        if(simData.bot1.evidence[newTurn-1]){
          evidence.push([0,simData.bot1.evidence[newTurn-1][1]])
        }
        if(simData.bot2.evidence[newTurn-1]){
          evidence.push([1,simData.bot2.evidence[newTurn-1][1]])
        }
        if(simData.bot3.evidence[newTurn-1]){
          evidence.push([2,simData.bot3.evidence[newTurn-1][1]])
        }
        if(simData.bot4.evidence[newTurn-1]){
          evidence.push([3,simData.bot4.evidence[newTurn-1][1]])
        }
        const botobjs = []
        const flashpositions = (width<1000||height<785) ? [{top:"-6px",left:"-6px"},
                                                          {top:"-7px",left:"6px"},
                                                          {top:"6px",left:"-6px"},
                                                          {top:"7px",left:"7px"},
                                                          {top:"0px",left:"0px"}]
                                                        : (width<1100||height<900) ?
                                                        [{top:"-7px",left:"-7px"},
                                                          {top:"-7px",left:"9px"},
                                                          {top:"9px",left:"-7px"},
                                                          {top:"9.5px",left:"9.5px"},
                                                          {top:"1.25px",left:"1.25px"}]
                                                        : [{top:"-6px",left:"-6px"},
                                                          {top:"-6px",left:"14px"},
                                                          {top:"14px",left:"-6px"},
                                                          {top:"14px",left:"14px"},
                                                          {top:"4px",left:"4.5px"}]
        for(let i=0;i<evidence.length; i++){
          if(evidence[i][1]!==2){
            const botobj = { id: `flash-${newTurn}-${evidence[i][0]}`, 
                            flashPosition: flashpositions[evidence[i][0]], 
                            bot: evidence[i][0], 
                            color: evidence[i][1]===1 ? 'bg-green-400' : 'bg-red-400' }
            botobjs.push(botobj)
          }
        };
        setFlashList((prev) => {
          const newprev = [...prev];
          for(let i=0;i<newprev.length;i++){
            for(let j=0;j<botobjs.length;j++){
              if(botobjs[j].bot===i){
                newprev[i] = [...prev[i],botobjs[j]]
                break;
              }
            }
          }
          return newprev
        });
        setTimeout(()=>{
            //setFlashList([[],[],[],[],[]])
          setFlashList(prev=>{
            const newprev = [...prev]
            for(let j=0;j<newprev.length;j++){
              for(let i=0;i<botobjs.length;i++){
                const len = newprev[j].length;
                newprev[j] = prev[j].filter(f=> f.id !== botobjs[i].id)
                if(newprev[j].length<len){
                  break;
                }
              }
            }
            return newprev
          })
        },300)
      }

    useEffect(() => {
        const handleKeyDown = (e) => {
          if(simData){
            const simlength = Math.max(simData.bot1.evidence.length,simData.bot2.evidence.length,simData.bot3.evidence.length,simData.bot4.evidence.length)
            if(e.code === 'ArrowRight'){
                setTurn((prev)=>{
                const newTurn = Math.min(simlength+1, prev + 1);
                handleFlashes(newTurn,simData)
                return newTurn
                });
                  
            } else if (e.code === 'ArrowLeft'){
                setTurn((prev) => {
                const newTurn = Math.max(0,prev-1)
                return newTurn
                });
                setFlashList([[],[],[],[],[]])
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
              handleFlashes(newTurn,simData);
              return newTurn
          })},250)
        return () => clearInterval(intervalRef.current)
        }
    },[play,showAgent])

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
        if (simData && 1<turn&&turn<simlength && simData.game.stoch) {
          const path = simData.game.mouse_path;
          const deltai = path[turn-1][0] - path[turn-2][0];
          const deltaj = path[turn-1][1] - path[turn-2][1];
          if (deltai === -1) {
            setDirectionFrames('anim-t');
          } else if (deltai === 1) {
            setDirectionFrames('anim-b');
          } else if (deltaj === 1) {
            setDirectionFrames('anim-r');
          } else if (deltaj === -1) {
            setDirectionFrames('anim-l');
          }
        }}
      }, [turn]);


    useEffect(()=>{
        if(showGameRef.current&&simData){
            showGameRef.current.scrollTop = showGameRef.current.scrollHeight;
        }
    },[showGameSelection])

    
    let bot1index,bot2index,bot3index,bot4index,player_index,mouse_index;
    if(simData){ 
      
      if(turn!==0){
          if(!simData.game.stoch){
            mouse_index = simData.game.mouse_starting_index
          }else{
            const mouse_path = simData.game.mouse_path
            mouse_index = simData.game.mouse_path[Math.min(turn-1,mouse_path.length-1)]
          }
          const bot1path = simData.bot1.path
          const bot2path = simData.bot2.path
          const bot3path = simData.bot3.path
          const bot4path = simData.bot4.path
          bot1index = bot1path[Math.min(turn-1,bot1path.length-1)]
          bot2index = bot2path[Math.min(turn-1,bot2path.length-1)]
          bot3index = bot3path[Math.min(turn-1,bot3path.length-1)]
          bot4index = bot4path[Math.min(turn-1,bot4path.length-1)]
          player_index = simData.game.player_path[Math.min(turn,simData.game.player_path.length-1)]
      }
      else{
          bot4index = simData.game.bot_starting_index;
          player_index = bot1index = bot2index = bot3index = bot4index;
          mouse_index = simData.game.mouse_starting_index;
      }
    }
    let b1length,b2length,b3length,b4length;
    if(simData){
      b1length = simData.bot1.length;
      b2length = simData.bot2.length;
      b3length = simData.bot3.length;
      b4length = simData.bot4.length;
    }else{
      b1length = b2length = b3length = b4length = 0;
    }

    const optionarray = ["1", "2", "3", "4",username]
    const optionarray2 = ["1", "2", "3", "4"]
    if (width < 900 || height < 695) {
      return (
        <div className="flex flex-col justify-center items-center h-screen px-4 text-center text-cyan-100">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Window Too Small</h2>
          <p className="mb-2">The content can’t fit in a window this small.</p>
          <p>If you had something in progress, increase screen height or width to resume.</p>
        </div>
      );
    }
  return (
    <div>
        <div>
        {simData && <div className=' mousegame-div grid grid-cols-[1fr_auto_1fr]'>
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
        
        {simData&&<RenderGridSeeMouseBots
            grid = {simData.game.grid}
            plans = {[simData.bot1.plans[turn],simData.bot2.plans[turn],simData.bot3.plans[turn],simData.bot4.plans[turn]]}
            state = {simData.bot4.states[Math.min(turn,b4length-1)]}
            simlengths = {[simData.bot1.length,simData.bot2.length,simData.bot3.length,simData.bot4.length,simData.game.player_length]}
            paths = {[simData.bot1.path,simData.bot2.path,simData.bot3.path,simData.bot4.path]}
            indices = {[bot1index,bot2index,bot3index,bot4index,player_index,mouse_index]}
            turn={turn}
            mouse_starting_index = {simData.game.mouse_starting_index}
            mouse_path = {simData.game.mouse_path}
            bot_starting_index = {simData.game.bot_starting_index} 
            showProbabilities={showProbabilities}
            showAgent = {showAgent}
            frameIndex = {frameIndex}
            directionFrames = {directionFrames}
            player_path = {simData.game.player_path}
            stoch = {simData.game.stoch}
            result = {simData.game.result}
            flashList = {flashList}
            />}
        <div className='flex justify-between'>
            <button className='hover:underline' onClick={()=>setShowGameSelection(prev=>!prev)}>Visualize new game</button>
            <button className="hover:underline" onClick={()=>setShowToMousegame(prev=>!prev)}>Mousegame</button>
            <button className="hover:underline" ref={restartButtonRef} onClick={(e)=>{
                if(restartButtonRef.current){
                    restartButtonRef.current.blur()
                }; setTurn(0); setFlashList([[],[],[],[],[]])}}>Restart</button>
            <button className='hover:underline' onClick={()=>setShowInstructions(prev=>!prev)}>Instructions</button>
            <button className='hover:underline' onClick={()=>setShowAbout(prev=>!prev)}>About</button>
        </div></div>
        {<div className="pt-8 pl-10 pr-10 backdrop-blur-md">
          <div className='border-2 border-cyan-400/30 rounded-md shadow-[0_0_6px_rgba(0,255,255,0.15)] backdrop-blur-xl bg-black/60 text-cyan-100'>
        <div className="flex flex-col text-cyan-100 p-4">
                <div className="text-[18px] font-bold">Mousegame Visualizer, Map {currentGame}</div>
                {simData && <div className="text-[13px]">Mode: {simData.game.stoch ? 'Moving' : 'Stationary'} mouse</div>}
                {simData && <div className="text-[13px]">Result: {simData.game.result}</div>}                                    
                <div className="text-[13px]">Map win rate: {Math.round(winRateRef.current*100)}%</div>
            </div> 
            <div className="flex flex-col p-4 rounded-md text-cyan-100">
                <div>Turn: {turn}</div>
            </div>    
            <div className='p-4'><div>Show bot:</div><div className="">
            {optionarray.map((option,i)=><label key={i} className={i===4?'text-xs':''}><div className="inline-flex items-center">
            <input type="checkbox" checked={showAgent[i]}
                                                onChange={(e)=>setShowAgent(prev=>{
                                                    e.target.blur()
                                                    const updated = [...prev]
                                                    updated[i]=!prev[i];
                                                    return updated
                                                })}/>{option}&nbsp;&nbsp;</div></label>)}</div>
                                          
            {<button className="mt-4 px-4 py-2 bg-gray-700/90 hover:bg-gray-600/90 rounded-2xl text-[12px] shadow-md" 
                    onClick={()=>setShowProbabilities(prev=>!prev)}>
                      {showProbabilities ? 'Hide Bot 4 Probabilities' : 'Show Bot 4 Probabilities'}
                      </button>}
            {<button  
          onClick={()=>setShowProbabilities(prev=>!prev)}>
            </button>}         
            {/*optionarray2.map((option,i)=><label key={i}><input type="checkbox" checked={showProbabilities===i+1}
                                                onChange={(e)=>{
                                                    if(showProbabilities===i+1){
                                                        setShowProbabilities(0);
                                                    }else setShowProbabilities(i+1);
                                                    e.target.blur()}}/>{option}&nbsp;&nbsp;</label>)*/}
            </div>
            <div className="text-cyan-100 flex flex-col p-4 rounded-md">
            <div>Map {currentGame} Leaderboard</div>
            <div className='border border-gray-500 p-4 rounded-2xl text-[14px]'>{leaderboard && leaderboard.length>0 ? leaderboard.map(([leader,turns],i)=>{
            return <div className='flex flex-row justify-between'><div>{leader}</div>{<div className='ml-3'></div>}{<div>{`${turns-1}`}</div>}</div>}) : <div>No winners yet</div>}</div>
        </div>
            </div>
            </div>}
        </div>}
        </div>
    </div>
  )
}


function ToMousegame(props){
    return(
      <div className="bg-gray-800/90 mt-80 ml-68 mr-24 mb-12 rounded-md">
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