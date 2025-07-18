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
import {useWindowSize} from '../useWindowSize'


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
  const [width,height] = useWindowSize();

  //This effect gets the list of previously played firegames to be selected from for players to view
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
          setLeaderboard(leaderboardres.data)
      }
      fetchGameList();
  },[])
  
  //This effect only runs once a game has been selected
  //Fetches the actual game to be viewed
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
      const firelist = JSON.parse(responsedata.fire_progression)
      const simlength = Math.max(bot1length,bot2length,bot3length,bot4length,successpossiblelength,player_path.length);
      //For the next line of code, I wanted to encoded the fire supressor as a 4 instead of a 5, to fit with new encodings
      //and if a bot is encoded as a 10, I wanted to get rid of that completely
      const initial_board = JSON.parse(responsedata.initial_board).map(row=>row.map(cell=> cell===5 ? 4 : cell===10 ? 0 : cell))
      const fireGrids = [initial_board];
      //Similarly to the game,
      //firelist[t] is an array of tuples of the form [[a,b],[c,d],...,[e,f]] where each tuple is a space that catches on fire at time t
      //fireGrids is an array of 25x25 arrays, where fireGrids[t][a][b]===2 if the space (a,b) is on fire at time t, 0 otherwise
      //In the following code I make fireGrids from firelist, ensuring all of this is processed up front / at the beginning
      for (let t = 1; t <= firelist.length; t++) {
        const newGrid = fireGrids[t-1].map(row=>[...row]);
        for (let [x, y] of firelist[t-1] || []) {
            newGrid[x][y] += 2;
        }
        fireGrids.push(newGrid);
      }
      setData({...responsedata,
                grid:initial_board,
                firelist,
                fireGrids,
                player_path,
                simlength,
                bot1path,
                bot2path,
                bot3path,
                bot4path,
                successpossiblepath})
      setCurrentGrid(initial_board);
      setFirelist(firelist);
      setCurrentTurn(0);
      } catch(err){
      setError(err.message)
      }
    }
    if(currentGame&&gameList){
      fetchGame();
    }
  }, [currentGame,gameList])

  //This effect sets an event listener, handles all keydowns
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

  //This effect moves the turns along using a setInterval if the user hits the spacebar to play
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

  //This effect just checks if the simulation is at its last turn, and if the simulation is being played, it stops it
  useEffect(()=>{
    if(play){
      if(currentTurn===data.simlength){
        setPlay(false);
        clearInterval(intervalRef.current);
      }
    }
    
  },[currentTurn])

  //get all of the bot indices to be sent to the grid renderer
  let successpossibleindex,bot1index,bot2index,bot3index,bot4index,playerindex;
  if(data){
    if(currentTurn!==0){
        const successpossiblepath = data.successpossiblepath
        const bot1path = data.bot1path;
        const bot2path = data.bot2path;
        const bot3path = data.bot3path;
        const bot4path = data.bot4path;
        const playerpath = data.player_path;

        successpossibleindex = successpossiblepath[Math.min(currentTurn-1,successpossiblepath.length-1)]
        bot1index = bot1path[Math.min(currentTurn-1,bot1path.length-1)]
        bot2index = bot2path[Math.min(currentTurn-1,bot2path.length-1)]
        bot3index = bot3path[Math.min(currentTurn-1,bot3path.length-1)]
        bot4index = bot4path[Math.min(currentTurn-1,bot4path.length-1)]
        playerindex = playerpath[Math.min(currentTurn-1,playerpath.length-1)]
    } else{
        successpossibleindex = JSON.parse(data.bot_index)
        bot1index = bot2index = bot3index = bot4index = playerindex = successpossibleindex
    }
  }
  //Check to make sure user isn't doing anything funny and seeing a different user's games
  const realusername = localStorage.getItem(USERNAME)
    if(realusername!==username){
        return <div className="flex flex-col items-center"><div className="mt-12">Not authorized</div></div>
    }
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
    {showAbout && <div className='fixed z-30 text-sm'><SeeFiregameAbout setShowAbout={setShowAbout}/></div>}
    {data && <div className='firegame-div grid grid-cols-[1fr_auto_1fr]'>
    <div className='ml-4'>
    </div>
    
    <div>
    {showInstructions && 
        <div className="fixed z-50">
            <SeeFiregameInstructions setShowInstructions={setShowInstructions}/></div>}
        
        {showToFiregame && <div className='fixed z-20 ml-45 mt-80'><ToFiregame setShowToFiregame={setShowToFiregame}/></div>}
        {showGameSelection && <div className='fixed bg-gray-800/90 ml-44 mr-24 mb-12 z-30 rounded-md'>
        <GameSelection setCurrentGame={setCurrentGame} 
                      gameList={gameList} 
                      setShowGameSelection={setShowGameSelection}
                      setWinRate={setWinRate}/></div>}
    {data && <RenderGridSeeBots 
                      fireGrid = {data.fireGrids[currentTurn]}
                      currentGrid={currentGrid} 
                      currentTurn={currentTurn} 
                      difficulty={difficulty} 
                      result={result}
                      indices = {[bot1index,bot2index,bot3index,bot4index,successpossibleindex,playerindex]}/>}
    <div className='flex justify-between'>
        <button className='hover:underline' onClick={()=>setShowGameSelection(prev=>!prev)}>Select new simulation</button>
        <button className='hover:underline' onClick={()=>setShowToFiregame(prev=>!prev)}>Fire Game</button>
        <button className='hover:underline' onClick={()=>setCurrentTurn(0)}>Restart</button>
        <button className='hover:underline' onClick={()=>setShowInstructions(prev=>!prev)}>Instructions</button>
        <button className='hover:underline' onClick={()=>setShowAbout(prev=>!prev)}>About</button>
    </div>
        </div>  
    <div className='pt-8 pl-10 pr-10 backdrop-blur-md' >
    <div className='border-2 border-cyan-400/30 rounded-md shadow-[0_0_6px_rgba(0,255,255,0.15)] backdrop-blur-xl bg-black/60'>
    <div className="flex flex-col text-cyan-100 p-4">
                <div className='font-bold text-[18px]'>Fire Game Visualizer, Map: {currentGame}</div>
                <div className='text-[13px]'>Difficulty: {difficulty}</div>
                <div className='text-[13px]'>Result: {result}</div>                                    
                <div className="text-[13px]">Map win rate: {Math.round(winRate*100)}%</div>
            </div>
      <div className="flex flex-col p-4 rounded-md">
                <div className='text-cyan-100'>Turn: {currentTurn}</div>
      </div>
      {leaderboard && <div className="text-cyan-100 flex flex-col p-4 rounded-md">
                <div>Score: {leaderboard.userscore}</div>
                
      </div>}
      {leaderboard && <div className="text-cyan-100 flex flex-col p-4 rounded-md">
                <div>Fire Game Leaderboard</div>
                <div className='border border-gray-500 rounded-2xl p-4'>{leaderboard.leaderboard.map(([user,score])=><div className='flex justify-between text-[13px]'><div>{user}</div><div className='ml-3'></div> <div>{score}</div></div>)}</div>

      </div>}
    </div></div>   
    </div>}</div>
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
    <div className="bg-gray-800/90 mt-12 ml-24 mr-24 mb-12 z-10 rounded-md">
      <div className="flex flex-col items-center pr-8 pl-8 pb-6">
        <Link className="hover:underline pt-6 text-white" to="/firegame">Proceed To Fire Game</Link>
        <div className="pt-3"><button onClick={()=>props.setShowToFiregame(false)} className="text-white hover:underline content-center">Close</button></div>
      </div>
    </div>
  )
}

export default SeeFireBots;
