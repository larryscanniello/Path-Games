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
  const [winRate,setWinRate] = useState(null);
  const [leaderboard,setLeaderboard] = useState(null);
  const [result,setResult] = useState(null);

  useEffect(()=>{
      async function fetchGameList(){
          const res = await api.post('getfiregamelist/',{
              username: localStorage.getItem(USERNAME),
          })
          .catch((e)=>{throw new Error("Error fetching game.")});
          setGameList(res.data.map(([id,result,difficulty,datetime,win_rate])=>{
              const date = new Date(datetime);
              return [id,result,difficulty,date,win_rate];
          }));
          const leaderboardres = await api.post('getfiregameleaderboard/',{
            username: localStorage.getItem(USERNAME),
          })
          .catch((e)=>{throw new Error("Error fetching leaderboard.")});
          console.log('l',leaderboardres.data)
          setLeaderboard(leaderboardres.data)
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
        console.log('gameList',gameList)
        if(gameList[i][0]==currentGame){
          setDifficulty(gameList[i][2]);
          setWinRate(gameList[i][4]);
          setResult(gameList[i][1]);
        }
      }
      const bot1path = JSON.parse(responsedata.bot1path)
      const bot2path = JSON.parse(responsedata.bot2path)
      const bot3path = JSON.parse(responsedata.bot3path)
      const bot4path = JSON.parse(responsedata.bot4path)
      const successpossiblepath = JSON.parse(responsedata.successpossiblepath)
      const bot1length = bot1path.length;
      const bot2length = bot2path.length;
      const bot3length = bot3path.length;
      const bot4length = bot4path.length;
      const successpossiblelength = successpossiblepath.length;
      const simlength = Math.max(bot1length,bot2length,bot3length,bot4length,successpossiblelength,player_path.length);
      setData({...responsedata,player_path,simlength,bot1path,bot2path,bot3path,bot4path,successpossiblepath})
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

  useEffect(()=>{
    if(play){
      if(currentTurn===data.simlength){
        setPlay(false);
        clearInterval(intervalRef.current);
      }
    }
    
  },[currentTurn])
  
  return (
    <div><div className='min-h-screen bg-black text-cyan-200 font-mono'>
    <div>{console.log('d ',difficulty)}
    <NavBar/>
    <div className='grid grid-cols-[1fr_auto_1fr]'>
    <div>
    {showAbout && <div className='fixed z-20 mt-40 text-sm'><SeeFiregameAbout setShowAbout={setShowAbout}/></div>}
    </div>
    
    <div>
    {showInstructions && 
        <div className="fixed z-50">
            <SeeFiregameInstructions setShowInstructions={setShowInstructions}/></div>}
        
        {showToFiregame && <div className='fixed z-20 ml-45 mt-80'><ToFiregame setShowToFiregame={setShowToFiregame}/></div>}
        {showGameSelection && <div className='fixed border border-gray-300 bg-gray-800/90 mt-30 ml-44 mr-24 mb-12 z-20 rounded-md'>
        <GameSelection setCurrentGame={setCurrentGame} 
                      gameList={gameList} 
                      setShowGameSelection={setShowGameSelection}
                      setWinRate={setWinRate}/></div>}
    <RenderGridSeeBots data={data} currentGrid={currentGrid} currentTurn={currentTurn} difficulty={difficulty} result={result}/>
    <div className='flex justify-between'>
        <button className='hover:underline' onClick={()=>setShowGameSelection(prev=>!prev)}>Select new simulation</button>
        <button className='hover:underline' onClick={()=>setShowToFiregame(prev=>!prev)}>Firegame</button>
        <button className='hover:underline' onClick={()=>setShowInstructions(prev=>!prev)}>Instructions</button>
        <button className='hover:underline' onClick={()=>setShowAbout(prev=>!prev)}>About</button>
    </div>
        </div>  
    <div>
    <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4 rounded-md">
                <div>Firegame Visualizer, Map: {currentGame}</div>
                <div>Difficulty: {difficulty}</div>
                <div>Result: {result}</div>                                    
                <div className="">Map win rate: {Math.round(winRate*100)}% {console.log('wr:',winRate)}</div>
            </div>
      <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4 rounded-md">
                <div>Turn: {currentTurn}</div>
      </div>
      {leaderboard && <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4 rounded-md">
                <div>Score: {leaderboard.userscore}</div>
                
      </div>}
      {leaderboard && <div className="flex flex-col items-center border border-gray-300 bg-gray-800/90 m-8 p-4 rounded-md">
                <div>Leaderboard</div>
                <div className='border border-gray-500 p-4 rounded-2xl'>{leaderboard.leaderboard.map(([user,score])=><div className='flex justify-between'><div>{user}</div><div className='ml-40'></div> <div>{score}</div></div>)}</div>

      </div>}
    </div>   
    </div></div></div></div>
  )
}
function GameSelection(props){
  return(<div className="">
      <div className="m-6">Select game to visualize:</div>
      <div ref={props.showGameRef} className="flex flex-col items-center overflow-y-auto h-96 pr-8 pl-8 pb-6 text-white">
        <ul>
        {props.gameList.map(([id, result, dif, date, winrate], i) => (
                <li key={id}>
                  <button className="hover:underline" onClick={() => {
                    props.setCurrentGame(id);
                    props.setShowGameSelection(false);
                    props.setWinRate(winrate)
                  }}>
                    {`${i+1}. ${result}, ${dif}, ${date.toLocaleString('en-US', {
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
        
      </div>
      <div className="flex flex-col items-center"><div className="pt-4 pb-4"><button onClick={()=>props.setShowGameSelection(false)} className="text-white hover:underline content-center">Close</button></div></div>
    </div>
  )
}


function ToFiregame(props){
  return(
    <div className="border border-gray-300 bg-gray-800/90 mt-12 ml-24 mr-24 mb-12 z-10 rounded-md">
      <div className="flex flex-col items-center pr-8 pl-8 pb-6">
        <Link className="hover:underline pt-6 text-white" to="/firegame">Proceed To Firegame</Link>
        <div className="pt-3"><button onClick={()=>props.setShowToFiregame(false)} className="text-white hover:underline content-center">Close</button></div>
      </div>
    </div>
  )
}

export default SeeFireBots;
