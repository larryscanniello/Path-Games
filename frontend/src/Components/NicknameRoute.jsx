import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN, USERNAME } from '../constants';
import NavBar from './NavBar';
import api from '../api';
import { AuthContext } from './AuthProvider';
import { Link } from 'react-router-dom';

function NicknameRoute() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2,setPassword2] = useState('');
  const [error,setError] = useState('');
  const [isAuthorized,setIsAuthorized] = useContext(AuthContext);
  const navigate = useNavigate();

  //This is the route that users take if they try and play a game before registering
  //The user will choose a nickname, and an account will be created with username: nickname and password: nickname

  const handleSubmit = async e => {
    e.preventDefault();
    setError('')
    if(password!==password2){
      setTimeout(()=>setError("The passwords don't match. Try again."),200)
      return
    }
    try {
      // 1. Register the user
      const registerResponse = await api.post('user/register/',{username, password:username})
                                .catch((error)=>{setError('Username taken. Try a different username.'); return null;});
      if(!registerResponse){
        return
      }
      // 2. Log the user in to get tokens
      const loginResponse = await api.post('token/',{username:registerResponse.data.username,password:username})
      .catch((error)=> {throw new Error('Login failed after registration')});
      localStorage.setItem(ACCESS_TOKEN, loginResponse.data.access);
      localStorage.setItem(REFRESH_TOKEN, loginResponse.data.refresh);
      localStorage.setItem(USERNAME,username);
      setIsAuthorized(true);
    } catch (err) {
      alert(err.message || 'Registration or login failed');
    }
  };

  const handleSubmitAnon = async e => {
    e.preventDefault();
    setError('')
    try {
      // 1. Register the user
      const registerResponse = await api.post('user/register/',{username:'5019292',password:'5019292'})
                                .catch((error)=>{setError('Username taken or something went wrong. Try a different username.'); return null;});
      if(!registerResponse){
        return
      }
      // 2. Log the user in to get tokens
      const userpass = registerResponse.data.username
      setUsername(userpass)
      const loginResponse = await api.post('token/',{username:userpass,password:userpass})
      .catch((error)=> {throw new Error('Login failed after registration')});
      
      localStorage.setItem(ACCESS_TOKEN, loginResponse.data.access);
      localStorage.setItem(REFRESH_TOKEN, loginResponse.data.refresh);
      localStorage.setItem(USERNAME,userpass);
      setIsAuthorized(true);
    } catch (err) {
      alert(err.message || 'Registration or login failed');
    }
  };
  
  



  return (
    <div>
        <div className=''>
          <div>
          <div className='flex flex-col items-center text-cyan-200 bg-black'>
          <div className= ' m-36 p-12 rounded-2xl w-188 h-64'>
          <div className='flex flex-col items-center'>
          {!isAuthorized && <div className=''>Enter a nickname: </div>}
            {!isAuthorized && <form  className='flex flex-col items-center' onSubmit={handleSubmit}>
              <input
                className='mt-4 pt-1 pb-1 pl-1 border border-gray-700 rounded-md bg-black'
                value={username}
                onChange={e => setUsername((prev)=>{const value = e.target.value; 
                                            if(!/^[a-zA-Z0-9]*$/.test(value)){
                                            setError('Nicknames must be alphanumeric.')
                                            return prev;
                                            };
                                            if(value.length>16){
                                              setError('Nicknames must be 16 characters or less.')
                                              return prev;
                                            }
                                            return value;})}
              />
              <button className='mt-4 bg-gray-800 rounded-sm pl-4 pr-4 pt-2 pb-2 font-bold hover:bg-gray-600' type="submit">Submit</button>
              <div className='mt-4'>(your nickname may be displayed on leaderboards)</div>
              <div className='mt-4'>Click <button className="text-white hover:underline" onClick={handleSubmitAnon}>here</button> to proceed without a nickname</div>
              <div className='pt-4'>Played before? <button className='text-white hover:underline' onClick={()=>navigate('/login/')}> Log in</button></div>
              <div className='text-red-400 mt-4'>{error}</div>
              <div className='flex flex-col items-center'>
              </div>
            </form>}
            {isAuthorized && <div className='flex flex-col items-center'>
            <div className='font-bold pt-4'>Welcome {username}.</div>
            <div className='pt-4'>In the future, you can log in with your</div>
            <div className=''>nickname as your username and password.</div>
            <div className='mt-4 font-bold'>Select an option: </div>
            <Link to='/firegame/' className='text-white hover:underline pt-4'>Play Firegame</Link>
            <Link to='/mousegame/' className='text-white hover:underline pt-4'>Play Mousegame</Link>
            </div>}
            </div>
          </div>
          </div>
          </div>
        </div>
        </div>
  );
}

export default NicknameRoute;