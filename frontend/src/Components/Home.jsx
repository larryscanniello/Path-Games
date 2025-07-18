import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { useEffect } from 'react';
import NavBar from './NavBar';

export default function Home() {
    const [isAuthorized,setIsAuthorized] = useContext(AuthContext);
    const username = localStorage.getItem("username");
    
    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      }, []);

    const handleLogout = () => {
        localStorage.clear()
        setIsAuthorized(false);
    }

  return (
    <div>
          <div className='m-24'></div>
          <ul className='pl-48'>
            <li className='mb-3 hover:underline'><Link to="/firegame">Play Fire Game</Link></li>
            <li className='mb-3 hover:underline' ><Link to="/seeoldfiregames">Fire Game Visualizer</Link></li>
            <li className='mb-3 hover:underline'><Link to="/mousegame">Play Mouse Game</Link></li>
            <li className='mb-3 hover:underline'><Link to="/seeoldmousegames">Mouse Game Visualizer</Link></li>
            <li className='mb-3 hover:underline'><Link to="/credits">Credits</Link></li>
            <li className='mb-3 hover:underline'><Link to="/feedback">Submit Anonymous Feedback</Link></li>
          </ul>
      </div>
  );
}