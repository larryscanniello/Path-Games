import { USERNAME } from "../constants";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Link } from "react-router-dom";

export default function NavBar(){
    const [isAuthorized,setIsAuthorized] = useContext(AuthContext);
    const username = localStorage.getItem(USERNAME);    

    const handleLogout = () => {
        localStorage.clear()
        setIsAuthorized(false);
    }

    return(
    <nav className='flex justify-between items-center pl-24 pt-3 pb-3 pr-24 border-gray-200 border-1'>
        <div><a className="font-bold" href='/'>Path Games</a></div>
        <div className="">
            {isAuthorized ? <div className="flex justify-between items-center space-x-8"><div>Welcome, {username}!</div>
            <a href='/' onClick={handleLogout} className="hover:underline">Logout</a></div> : 
            <div className="flex justify-between items-center space-x-8"><a href="/login" className="hover:underline">
            Login
            </a>
            <a href="/register" className="hover:underline">
            Register
            </a></div>}
        </div>
        </nav>
        )}