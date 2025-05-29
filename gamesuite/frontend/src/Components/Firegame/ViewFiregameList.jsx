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
    
    return (
        <div className='min-h-screen bg-black text-cyan-200 font-mono'>
          <NavBar/>
          <div className="m-24"></ div>
         <div className="pl-48 font-bold">Select a game: </div>{gameList ? (
            <ul className="pl-48">
              {gameList.map(([id, result, difficulty, date], i) => (
                <li key={id}>
                  <button className="hover:underline" onClick={() => navigate(username+'/'+id.toString()+'/')}>
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
          ) : <div>No games yet. Play a firegame and come back.</div>}
        
        </div>
      );
}