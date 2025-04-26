import logo from './logo.svg';
import './App.css';
import NavBar from './Components/NavBar.jsx'
import RenderGrid from './Components/RenderGrid.jsx'
import { useState, useEffect } from 'react';

function App() {
  const [currentTurn,setCurrentTurn] = useState(0)
  const [data,setData] = useState(null)
  const [currentGrid,setCurrentGrid] = useState(null);
  const [error, setError] = useState(null);
  const [firelist, setFirelist] = useState(null);


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
      if(e.code === 'Space' || e.code === 'ArrowRight'){
        setCurrentTurn((prev)=>{
          const newTurn = Math.min(firelist.length-1, prev + 1);
          return newTurn
        });
      } else if (e.code === 'ArrowLeft'){
        setCurrentTurn((prev) => {
          const newTurn = Math.max(0,prev-1)
          return newTurn
        })
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

  /*
  const moveForwards = (turn) => {
    const thisTurnList = firelist[turn-1]
    setCurrentGrid(prev => {
      const newGrid = prev.map(row=>[...row])
      thisTurnList.forEach(element => {
        newGrid[element[0]][element[1]] +=2;
      });
      return newGrid;
    });
  };

  const moveBackwards = (turn) => {
    const thisTurnList = firelist[turn+1]
    setCurrentGrid(prev => {
      const newGrid = prev.map(row=>[...row])
      thisTurnList.forEach(element => {
        newGrid[element[0]][element[1]] -=2;
      });
      return newGrid;
    });
  };
  */
  return (
    <>
    <NavBar/>
    <RenderGrid data={data} currentGrid={currentGrid} currentTurn={currentTurn}/>
    <div>Current turn: {currentTurn}</div>
    </>
  )
}

export default App;
