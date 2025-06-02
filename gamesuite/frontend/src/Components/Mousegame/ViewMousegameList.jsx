import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { USERNAME } from "../../constants";
import NavBar from "../NavBar";

export default function ViewGameList(){
    const [gameList,setGameList] = useState(null);
    const navigate = useNavigate();
    const username = localStorage.getItem(USERNAME);

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
        console.log(gameList)
    }
    fetchGameList();
    },[])
    
    return (
            gameList && <div className='min-h-screen bg-black text-cyan-200 font-mono'>
              <NavBar/>
              <div className="m-24"></ div>
             <div className="pl-48 font-bold">Select a game: </div>{gameList.length>0 ? (
                <ul className="pl-48 overflow-y-auto h-64">
                  {gameList.map(([id, result, stoch, date], i) => (
                    <li key={id}>
                      <button className="hover:underline" onClick={() => navigate(username+'/'+id.toString()+'/')}>
                        {`${i+1}. ${result}, ${stoch ? 'stochastic mouse' : 'stationary mouse'}, ${date.toLocaleString('en-US', {
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
              ) : <div className="pl-48">No games yet. Play a mousegame and come back.</div>}
            
            </div>
          );
    }
