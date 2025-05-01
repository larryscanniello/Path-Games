import { useState, useEffect, useRef } from "react";
import NavBar from "../NavBar";
import RenderGridSeeMouseBots from './RenderGridSeeMouseBots.jsx'
import FiregameStyles from '../../Styles/FiregameStyles.css'

export default function SeeMiceBots(){
    const [simData,setSimData] = useState(null);
    const [turn, setTurn] = useState(0);
    const [error, setError] = useState(null);
    const [play, setPlay] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        async function fetchGame(){
          try{
            const res = await fetch('http://localhost:8000/api/mousegame/4/');
            if(!res.ok){
              throw new Error('Game not found')
            }
            const responsedata = await res.json();
            const parseddata = {
                game: {
                    grid: JSON.parse(responsedata.game.grid),
                    stoch: responsedata.game.stochastic,
                    mouse_path: responsedata.game.mouse_path,
                    bot_starting_index: JSON.parse(responsedata.game.bot_starting_index),
                    mouse_starting_index: JSON.parse(responsedata.game.mouse_starting_index)
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
            setSimData(parseddata);
          } catch(err){
          setError(err.message)
          }
        }
        fetchGame();
      }, [])

    useEffect(() => {
        const handleKeyDown = (e) => {
          if(simData){
            const simlength = Math.max(simData.bot1.evidence.length,simData.bot2.evidence.length,simData.bot3.evidence.length)
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
            const simlength = Math.max(simData.bot1.evidence.length,simData.bot2.evidence.length,simData.bot3.evidence.length)
            const newTurn = Math.min(simlength-1, prev + 1);
            return newTurn
        })
        },250)
        return () => clearInterval(intervalRef.current)
        }
    },[play])



  return (
    <>
    <NavBar/>
    <RenderGridSeeMouseBots data={simData} turn={turn}/>
    <div>Current turn: {turn}</div>
    </>
  )
}