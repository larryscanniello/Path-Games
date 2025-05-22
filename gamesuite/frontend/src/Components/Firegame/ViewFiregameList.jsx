import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { USERNAME } from "../../constants";

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
        <>
          {gameList && (
            <ul>
              {gameList.map(([id, result, difficulty, date]) => (
                <li key={id}>
                  <button onClick={() => navigate(username+'/'+id.toString()+'/')}>
                    {`${id}, ${result}, ${difficulty}, ${date}`}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      );
}