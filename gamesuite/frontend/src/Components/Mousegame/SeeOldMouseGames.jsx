import { useState, useEffect, useRef } from "react";
import NavBar from "../NavBar";
import RenderGridSeeMouseBots from './RenderGridSeeMouseBots.jsx'
import FiregameStyles from '../../Styles/FiregameStyles.css'
import SelectGameMenu from "./SelectGameMenu.jsx";
import api from "../../api.js";
import { USERNAME } from "../../constants.js";


export default function SeeMiceBots(){
    const [simData,setSimData] = useState(null);
    const [turn, setTurn] = useState(0);
    const [error, setError] = useState(null);
    const [play, setPlay] = useState(false);
    const [showProbabilities,setShowProbabilities] = useState(0);
    const [showGameSelection,setShowGameSelection] = useState(null);
    const intervalRef = useRef(null);
    const currentGame = useRef(null);
    const gameList = useRef(null);
    const [showAgent,setShowAgent] = useState([true,true,true,true,true]);


    useEffect(()=>{
        async function fetchGameList(){
            const res = await api.post('getgamelist/',{
                username: localStorage.getItem(USERNAME),
            })
            .catch((e)=>{throw new Error("Error fetching game.")});
            gameList.current = res.data.map(([id,result,datetime])=>{
                const date = new Date(datetime);
                return [id,result,date];
            });
            setShowGameSelection(true);
            console.log(gameList.current,showGameSelection);
        }
        fetchGameList();
    },[])

    useEffect(() => {
        async function fetchGame(){
          try{
            const res = await api.post('get_mousegame_by_id/',
            {
                username: localStorage.getItem(USERNAME),
                id: currentGame.current,
            })
            .catch((e)=>{throw new Error("Error fetching game.")});
            const responsedata = res.data;
            const parseddata = {
                game: {
                    grid: JSON.parse(responsedata.game.grid),
                    stoch: responsedata.game.stochastic,
                    mouse_path: responsedata.game.mouse_path,
                    bot_starting_index: JSON.parse(responsedata.game.bot_starting_index),
                    mouse_starting_index: JSON.parse(responsedata.game.mouse_starting_index),
                    player_path: responsedata.playerdata.player_path
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
                    states: JSON.parse(responsedata.bots[3].states),
                    plans: responsedata.bots[3].plans,
                    modechange: responsedata.bots[3].modechange
                }
            }
            setSimData(parseddata);
            setTurn(0);
          } catch(err){
          setError(err.message)
          }
        }
        if(currentGame.current){
            fetchGame();
        }
      }, [currentGame.current])

    useEffect(() => {
        const handleKeyDown = (e) => {
          if(simData){
            const simlength = Math.max(simData.bot1.evidence.length,simData.bot2.evidence.length,simData.bot3.evidence.length,simData.bot4.evidence.length)
            if(e.code === 'ArrowRight'){
                setTurn((prev)=>{
                const newTurn = Math.min(simlength-1, prev + 1);
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
                const newTurn = Math.min(simlength-1, prev + 1);
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
            const newTurn = Math.min(simlength-1, prev + 1);
            return newTurn
        })
        },250)
        return () => clearInterval(intervalRef.current)
        }
    },[play])

    const optionarray = ["Bot 1", "Bot 2", "Bot 3", "Bot 4", "Player"]
    const optionarray2 = ["Bot 1", "Bot 2", "Bot 3", "Bot 4"]


  return (
    <>
    <NavBar/>
    <button onClick = {()=> setShowGameSelection(true)}>
        Select New Game
    </button>
    <div>
      Turn: {turn}
    </div>
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
                    gameList={gameList}/>
              
    <RenderGridSeeMouseBots 
    data={simData} 
    turn={turn} 
    showProbabilities={showProbabilities}
    showAgent = {showAgent}
    />
    </>
  )
}