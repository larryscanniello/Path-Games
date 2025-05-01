import NavBar from '../NavBar.jsx'
import RenderGridSeeBots from './RenderGridSeeFireBots.jsx'
import { useState, useEffect, useRef } from 'react';

function SeeFireBots() {
  const [currentTurn,setCurrentTurn] = useState(0);
  const [data,setData] = useState(null)
  const [currentGrid,setCurrentGrid] = useState(null);
  const [error, setError] = useState(null);
  const [firelist, setFirelist] = useState(null);
  const [play, setPlay] = useState(false);
  const intervalRef = useRef(null);


  useEffect(() => {
    async function fetchGame(){
      try{
        const res = await fetch('http://localhost:8000/api/games/79');
        if(!res.ok){
          throw new Error('Game not found')
        }
        const responsedata = await res.json();
        setData(responsedata)
        setCurrentGrid(JSON.parse(responsedata.initial_board));
        setFirelist(JSON.parse(responsedata.fire_progression));
      } catch(err){
      setError(err.message)
      }
    }
    fetchGame();
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if(data){
      if(e.code === 'ArrowRight'){
        setCurrentTurn((prev)=>{
          const newTurn = Math.min(firelist.length-1, prev + 1);
          return newTurn
        });
      } else if (e.code === 'ArrowLeft'){
        setCurrentTurn((prev) => {
          const newTurn = Math.max(0,prev-1)
          return newTurn
        })
      } else if (e.code === 'Space'){
        if(!play){
        setCurrentTurn((prev)=>{
          const newTurn = Math.min(firelist.length-1, prev + 1);
          return newTurn
        });
        }
        setPlay((prev)=> !prev)
      }
        };
    };
    if(data){
      window.addEventListener('keydown',handleKeyDown);
    };
    return () => {
      window.removeEventListener('keydown',handleKeyDown);
    }
  }, [data]);

  useEffect(()=>{
    if(play){
      intervalRef.current = setInterval(()=>{
      setCurrentTurn(prev => {
        const newTurn = Math.min(firelist.length-1, prev + 1);
        return newTurn
      })
      },500)
      return () => clearInterval(intervalRef.current)
    }
  },[play])
  
  return (
    <>
    <NavBar/>
    <RenderGridSeeBots data={data} currentGrid={currentGrid} currentTurn={currentTurn}/>
    <div>Current turn: {currentTurn}</div>
    </>
  )
}

export default SeeFireBots;
