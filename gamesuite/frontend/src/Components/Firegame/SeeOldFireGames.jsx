import NavBar from '../NavBar.jsx'
import RenderGridSeeBots from './RenderGridSeeFireBots.jsx'
import { useState, useEffect, useRef } from 'react';
import { USERNAME } from '../../constants.js';
import api from '../../api.js';
import SelectFiregameMenu from "./SelectFiregameMenu.jsx"
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SeeFiregameInstructions from "./SeeFiregameInstructions.jsx"
import SeeFiregameAbout from "./SeeFiregameAbout.jsx"


function SeeFireBots() {
  const [currentTurn,setCurrentTurn] = useState(0);
  const [data,setData] = useState(null)
  const [currentGrid,setCurrentGrid] = useState(null);
  const [error, setError] = useState(null);
  const [firelist, setFirelist] = useState(null);
  const [play, setPlay] = useState(false);
  const intervalRef = useRef(null);
  const [showGameSelection,setShowGameSelection] = useState(false);
  const [gameList,setGameList] = useState(null);
  const {username,gameID} = useParams();
  const [currentGame,setCurrentGame] = useState(gameID);
  const [showInstructions,setShowInstructions] = useState(true);
  const [showAbout,setShowAbout] = useState(false);
  const [showToFiregame,setShowToFiregame] = useState(false);
  const [difficulty,setDifficulty] = useState(null);

  useEffect(()=>{
      async function fetchGameList(){
          const res = await api.post('getfiregamelist/',{
              username: localStorage.getItem(USERNAME),
          })
          .catch((e)=>{throw new Error("Error fetching game.")});
          setGameList(res.data.map(([id,result,difficulty,datetime])=>{
              const date = new Date(datetime);
              return [id,result,difficulty,date];
          }));
      }
      fetchGameList();
  },[])
  

  useEffect(() => {
    async function fetchGame(){
      try{
        const res = await api.post('get_firegame_by_id/',{
          username: username,
          id: currentGame})
          .catch((e)=>{throw new Error("Error fetching game.")});
      const responsedata = res.data.game;
      const player_path = res.data.playerdata.player_path;
      player_path.shift();
      for(let i=0; i<gameList.length;i++){
        console.log(gameList[i][0],currentGame)
        if(gameList[i][0]==currentGame){
          setDifficulty(gameList[i][2]);
          console.log('check')
        }
      }
      const bot1length = JSON.parse(responsedata.bot1path).length;
      const bot2length = JSON.parse(responsedata.bot2path).length;
      const bot3length = JSON.parse(responsedata.bot3path).length;
      const bot4length = JSON.parse(responsedata.bot4path).length;
      const successpossiblelength = JSON.parse(responsedata.successpossiblepath).length;
      const simlength = Math.max(bot1length,bot2length,bot3length,bot4length,successpossiblelength,player_path.length);
      setData({...responsedata,player_path,simlength})
      setCurrentGrid(JSON.parse(responsedata.initial_board));
      setFirelist(JSON.parse(responsedata.fire_progression));
      setCurrentTurn(0);
      } catch(err){
      setError(err.message)
      }
    }
    if(currentGame&&gameList){
      fetchGame();
    }
  }, [currentGame,gameList])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if(data){
      if(e.code === 'ArrowRight'){
        setCurrentTurn((prev)=>{
          const newTurn = Math.min(data.simlength, prev + 1);
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
          const newTurn = Math.min(data.simlength, prev + 1);
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
        const newTurn = Math.min(data.simlength, prev + 1);
        return newTurn
      })
      },250)
      return () => clearInterval(intervalRef.current)
    }
  },[play])
  
  return (
    <div><div className='min-h-screen bg-black text-cyan-200 font-mono'>
    <div>
    <NavBar/>
    <div className='flex justify-center items-center'>
    <div>
    <RenderGridSeeBots data={data} currentGrid={currentGrid} currentTurn={currentTurn} difficulty={difficulty}/>
    <div className='flex justify-between'>
        <button className='hover:underline' onClick={()=>setShowGameSelection(prev=>!prev)}>Select new simulation</button>
        <button className='hover:underline' onClick={()=>setShowToFiregame(prev=>!prev)}>Firegame</button>
        <button className='hover:underline' onClick={()=>setShowInstructions(prev=>!prev)}>Instructions</button>
        <button className='hover:underline' onClick={()=>setShowAbout(prev=>!prev)}>About</button>
    </div>
        </div>  
        {showInstructions && 
        <div className="fixed">
            <SeeFiregameInstructions setShowInstructions={setShowInstructions}/></div>}
        {showAbout && <div className='fixed'><SeeFiregameAbout setShowAbout={setShowAbout}/></div>}
        {showToFiregame && <div className='fixed'><ToFiregame setShowToFiregame={setShowToFiregame}/></div>}
        {showGameSelection && <div className='fixed'><GameSelection setCurrentGame={setCurrentGame} gameList={gameList} setShowGameSelection={setShowGameSelection}/></div>}
    </div></div></div></div>
  )
}

function GameSelection(props){
  return(
    <div className="border border-gray-300 bg-gray-800/90 mt-12 ml-24 mr-24 mb-12 z-10">
      <div className="flex flex-col items-center pr-8 pl-8 pb-6">
        <ul>
        {props.gameList.map(([id, result, difficulty, date], i) => (
                <li key={id}>
                  <button className="hover:underline" onClick={() => {
                    props.setCurrentGame(id);
                    props.setShowGameSelection(false);
                  }}>
                    {`${i+1}. ${result}, ${difficulty}, ${date.toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`}
                  </button>
                </li>
              ))}
        </ul>
        <div className="pt-3"><button onClick={()=>props.setShowGameSelection(false)} className="text-white hover:underline content-center">Close</button></div>
      </div>
    </div>
  )
}


function ToFiregame(props){
  return(
    <div className="border border-gray-300 bg-gray-800/90 mt-12 ml-24 mr-24 mb-12 z-10">
      <div className="flex flex-col items-center pr-8 pl-8 pb-6">
        <Link className="hover:underline pt-6 text-white" to="/firegame">Proceed To Firegame</Link>
        <div className="pt-3"><button onClick={()=>props.setShowToFiregame(false)} className="text-white hover:underline content-center">Close</button></div>
      </div>
    </div>
  )
}

export default SeeFireBots;
