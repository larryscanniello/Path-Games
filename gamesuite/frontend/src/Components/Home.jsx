import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { useEffect } from 'react';

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
    <>
      <div>This is home</div>
      <nav>
        <ul>
          {!isAuthorized ? <><li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li></>
        : <div><li>Welcome {username}!</li>
        <li><button onClick= {handleLogout}>Logout</button></li></div>}
          <li><Link to="/firegame">Play Fire Game</Link></li>
          <li><Link to="/seefirebots">See Fire Bots</Link></li>
          <li><Link to="/seeoldmousegames">See Old Mouse Games</Link></li>
          <li><Link to="/mousegame">Play Mouse Game</Link></li>
        </ul>
      </nav>
    </>
  );
}