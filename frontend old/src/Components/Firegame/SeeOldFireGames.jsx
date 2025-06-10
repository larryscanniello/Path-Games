import NavBar from '../NavBar.jsx'
import RenderGridSeeBots from './RenderGridSeeFireBots.jsx'
import { useState, useEffect, useRef } from 'react';
import { USERNAME } from '../../constants.js';
import api from '../../api.js';
import SelectFiregameMenu from "./SelectFiregameMenu.jsx"
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
function SeeFireBots() {
  const [currentTurn,setCurrentTurn] = useState(0);
  const [data,setData] = useState(null)
  const [currentGrid,setCurrentGrid] = useState(null);
  const [error, setError] = useState(null);
  const [firelist, setFirelist] = useState(null);
  const [play, setPlay] = useState(false);
  const intervalRef = useRef(null);
  const [showGameSelection,setShowGameSelection] = useState(false);
  const gameList = useRef(null);
  const {username,gameID} = useParams();
  const currentGame = useRef(gameID);

  useEffect(()=>{
      async function fetchGameList(){
          const res = await api.post('getfiregamelist/',{
              username: localStorage.getItem(USERNAME),
          })
          .catch((e)=>{throw new Error("Error fetching game.")});
          gameList.current = res.data.map(([id,result,difficulty,datetime])=>{
              const date = new Date(datetime);
              return [id,result,difficulty,date];
          });
          setShowGameSelection(true);
      }
      fetchGameList();
  },[])
  

  useEffect(() => {
    async function fetchGame(){
      try{
        const res = await api.post('get_firegame_by_id/',{
          username: username,
          id: currentGame.current})
          .catch((e)=>{throw new Error("Error fetching game.")});
      console.log('res',res)
      const responsedata = res.data.game;
      const player_path = res.data.playerdata.player_path;
      player_path.shift();
      setData({...responsedata,player_path})
      setCurrentGrid(JSON.parse(responsedata.initial_board));
      setFirelist(JSON.parse(responsedata.fire_progression));
      setCurrentTurn(0);
      } catch(err){
      setError(err.message)
      }
    }
    console.log('gameid ',gameID);
    if(currentGame.current){
      fetchGame();
    }
  }, [currentGame.current])

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
    <Link to='/firegame'><button>Play Firegame</button></Link>
    <button onClick = {()=> setShowGameSelection(true)}>New Game Menu</button>
    <SelectFiregameMenu showGameSelection={showGameSelection} 
                        setShowGameSelection={setShowGameSelection} 
                        currentGame={currentGame}
                        gameList={gameList}/>
    <RenderGridSeeBots data={data} currentGrid={currentGrid} currentTurn={currentTurn}/>
    <div>Current turn: {currentTurn}</div>
    
    </>
  )
}

export default SeeFireBots;
