import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN,USERNAME } from '../constants';
import { AuthContext, AuthProvider } from './AuthProvider';
import api from '../api.js'
import NavBar from './NavBar.jsx';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthorized,setIsAuthorized] = useContext(AuthContext);
  const [error,setError] = useState('');
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
        .catch((error)=> {throw new Error('Login failed. Try a different username or password.')});

      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      localStorage.setItem(USERNAME, username);
      setIsAuthorized(true)
      navigate('/');
    } catch (err) {
      setError(err.message)
    }
  };

  return (<div>
    <div>
      <div className='text-black'>
      <div className='flex flex-col items-center font-sans'>
      
      <div className='bg-white m-48 p-12 rounded-2xl flex flex-col items-center'>
      <div className='font-mono'>Path Games: Login</div>
        <form className='flex flex-col items-center' onSubmit={handleSubmit}>
          <input
            className='mt-4 pt-1 pb-1 pl-1 border text-black border-gray-700 rounded-md bg-gray-100'
            value={username}
            onChange={e => setUsername((prev)=>{const value = e.target.value;
              console.log(value.length); 
              if(!/^[a-zA-Z0-9]*$/.test(value)){
                setError('Usernames have alphanumeric characters only.');
                return prev;
              }
              if(value.length>16){
                setError('Usernames are 16 characters or less.')
                return prev;
              };
              return value;
              })}
            placeholder="Username"
          />
          <div></div>
          <input
            className='border border-gray-700 mt-4 pt-1 pb-1 pl-1 rounded-md bg-gray-100'
            type="password"
            value={password}
            onChange={e => setPassword((prev)=>{const value = e.target.value; 
              if(/^[a-zA-Z0-9\s.,!?]*$/.test(value)){
              return value;
              };
              setError('Passwords are alphanumeric and . , ! ? only.')
              return prev;})}
            placeholder="Password"
          />
          <div className='pt-4'>New user? <button type='button' className='text-blue-400 hover:underline' onClick={()=>navigate('/register/')}> Register</button></div>
          <div className='text-red-400'>{error}</div>
          <div className='flex flex-col items-center'>
          <button className='mt-4 bg-blue-300 hover:bg-blue-200 rounded-3xl pl-4 pr-4 pt-2 pb-2 font-bold' type="submit">Log In</button>
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