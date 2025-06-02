import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN,USERNAME } from '../constants';
import { AuthContext, AuthProvider } from './AuthProvider';
import api from '../api.js'
import NavBar from './NavBar.jsx';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthorized,setIsAuthorized] = useContext(AuthContext)
  const navigate = useNavigate();


  const handleSubmit = async e => {
    e.preventDefault();
    try {
      /*const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });*/
      const response = await api.post('token/',{username,password})
        .catch((error)=> {throw new Error('Invalid Credentials')});

      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      localStorage.setItem(USERNAME, username);
      setIsAuthorized(true)
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (<div>
    <div className='min-h-screen bg-black'>
      <div>
      <NavBar logoOnly={true}/>
      <div className='flex flex-col items-center'>
      
      <div className='bg-white m-48 p-12 rounded-2xl'>
      <div className='font-mono'>Path Games: Login</div>
        <form  onSubmit={handleSubmit}>
          <input
            className='mt-4 pt-1 pb-1 pl-1 border border-gray-700 rounded-md bg-gray-100'
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
          />
          <div></div>
          <input
            className='border border-gray-700 mt-4 pt-1 pb-1 pl-1 rounded-md bg-gray-100'
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <div className='pt-4'>New user? <button className='text-blue-400 hover:underline' onClick={()=>navigate('/register/')}> Register</button></div>
          <div className='flex flex-col items-center'>
          <button className='mt-4 bg-blue-300 rounded-3xl pl-4 pr-4 pt-2 pb-2 font-bold' type="submit">Log In</button>
          </div>
          
        </form>
      </div>
      </div>
      </div>
    </div>
    </div>
  );
}

export default Login;