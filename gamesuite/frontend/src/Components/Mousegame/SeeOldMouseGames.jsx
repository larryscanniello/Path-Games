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

    useEffect(()=>{
        async function fetchGameList(){
            const res = await api.post('getmousegamelist/',{
                username: localStorage.getItem(USERNAME),
            })
            .catch((e)=>{throw new Error("Error fetching list.")});
            setGameList(res.data.map(([id,result,stoch,datetime])=>{
                const date = new Date(datetime);
                return [id,result,stoch,date];
            }));
            setShowGameSelection(true);
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
            const bot3evidence = JSON.parse(responsedata.bots[2].evidence);
            bot3evidence[0] = bot3evidence[1];
            const bot1path = JSON.parse(responsedata.bots[0].evidence).slice(1).map(([t,type,[i,j]])=> [i,j])
            const bot2path = JSON.parse(responsedata.bots[1].evidence).slice(1).map(([t,type,[i,j]])=> [i,j])
            const bot3path = bot3evidence.slice(1).map(([t,type,[i,j]])=> [i,j])
            const bot4path = JSON.parse(responsedata.bots[3].evidence).slice(1).map(([t,type,[i,j]])=> [i,j])
            const parseddata = {
                game: {
                    grid: JSON.parse(responsedata.game.grid),
                    stoch: responsedata.game.stochastic,
                    mouse_path: responsedata.game.mouse_path.slice(1),
                    bot_starting_index: JSON.parse(responsedata.game.bot_starting_index),
                    mouse_starting_index: JSON.parse(responsedata.game.mouse_starting_index),
                    player_path: responsedata.playerdata.player_path
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
            const simlength = Math.max(simData.bot1.evidence.length,simData.bot2.evidence.length,simData.bot3.evidence.length,simData.bot4.evidence.length)
            const newTurn = Math.min(simlength+1, prev + 1);
            return newTurn
        })
        },250)
        return () => clearInterval(intervalRef.current)
        }
    },[play])

    const optionarray = ["1", "2", "3", "4", username]
    const optionarray2 = ["1", "2", "3", "4"]


  return (
    <div>
        <div className="min-h-screen bg-black text-cyan-200 font-mono">
        <NavBar/>
        <div className='grid grid-cols-[1fr_auto_1fr]'>
        <div></div><div>
        {showGameSelection && <div><SelectGameMenu showGameSelection={showGameSelection} 
                    setShowGameSelection={setShowGameSelection} 
                    currentGame={currentGame}
                    setCurrentGame={setCurrentGame}
                    gameList={gameList}/></div>}
        {showInstructions && 
                    <SeeMousegameInstructions setShowInstructions={setShowInstructions}/>}
        {showAbout && 
                    <SeeMousegameAbout setShowAbout={setShowAbout}/>}
        {<RenderGridSeeMouseBots 
            data={simData} 
            turn={turn} 
            showProbabilities={showProbabilities}
            showAgent = {showAgent}
            />}
        <div className='flex justify-between'>
            <button className='hover:underline' onClick={()=>setShowGameSelection(prev=>!prev)}>New game</button>
            <button className='hover:underline' onClick={()=>setShowInstructions(prev=>!prev)}>Instructions</button>
            <button className='hover:underline' onClick={()=>setShowAbout(prev=>!prev)}>About</button>
            <div>turn: {turn}</div>
        </div></div>
        <div><div className='bg-gray-800 border border-white m-8 p-2'><div>Show bot:</div><div className="ml-6 mr-6">
            {optionarray.map((option,i)=><label ><input type="checkbox" checked={showAgent[i]}
                                                onChange={()=>setShowAgent(prev=>{
                                                    const updated = [...prev]
                                                    updated[i]=!prev[i];
                                                    return updated
                                                })}/>{option}&nbsp;&nbsp;</label>)}</div>
            <div>Show Probabilities:<div className="flex ml-6 mr-6">                                    
            {optionarray2.map((option,i)=><label><input type="checkbox" checked={showProbabilities===i+1}
                                                onChange={()=>{
                                                    if(showProbabilities===i+1){
                                                        setShowProbabilities(0);
                                                    }else setShowProbabilities(i+1)}}/>{option}&nbsp;&nbsp;</label>)}</div>      
            </div>
            </div></div>
        </div>
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