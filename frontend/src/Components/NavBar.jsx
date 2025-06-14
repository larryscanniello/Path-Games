import { USERNAME } from "../constants";
import { useContext,useState } from "react";
import { AuthContext } from "./AuthProvider";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "./useWindowSize";

export default function NavBar(props){
    const [isAuthorized,setIsAuthorized] = useContext(AuthContext);
    const [loggingOut, setLoggingOut] = useState(false);
    const username = localStorage.getItem(USERNAME);  
    const [width,height] = useWindowSize()
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        navigate('/');
        setTimeout(()=>{localStorage.clear(); setIsAuthorized(false);},50)
    }

    return(
    <nav className='flex justify-between items-center pl-24 pt-3 pb-3 pr-24 border-gray-500 border-b-1 font-mono'>
        <div><a className="font-bold pr-8" href='/'>Path Games</a></div>
        {(!props.logoOnly) && <div className="">
            {isAuthorized && !loggingOut ? <div className="flex justify-between items-center space-x-8"><Link className="hover:underline" to={"user/"+username}>{username}</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button></div> 
            : !loggingOut &&<div className="flex justify-between items-center space-x-8"><a href="/login" className="hover:underline">
            Login
            </a>
            <a href="/register" className="hover:underline">
            Register
            </a></div>}
        </div>}
        </nav>
        )}