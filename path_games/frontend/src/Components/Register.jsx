import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN, USERNAME } from '../constants';
import NavBar from './NavBar';
import api from '../api';
import { AuthContext } from './AuthProvider';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2,setPassword2] = useState('');
  const [error,setError] = useState('');
  const [isAuthorized,setIsAuthorized] = useContext(AuthContext)
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('')
    if(password!==password2){
      setTimeout(()=>setError("The passwords don't match. Try again."),200)
      return
    }
    try {
      // 1. Register the user
      const registerResponse = await api.post('user/register/',{username, password})
                                .catch((error)=>{setError('Registration failed. Try a different username.'); return null;});
      if(!registerResponse){
        return
      }
      // 2. Log the user in to get tokens
      const loginResponse = await api.post('token/',{username,password})
      .catch((error)=> {throw new Error('Login failed after registration')});
      console.log(loginResponse)
      localStorage.setItem(ACCESS_TOKEN, loginResponse.data.access);
      localStorage.setItem(REFRESH_TOKEN, loginResponse.data.refresh);
      localStorage.setItem(USERNAME,username);
      setIsAuthorized(true);
      navigate('/'); // Redirect to home
    } catch (err) {
      alert(err.message || 'Registration or login failed');
    }
  };

  return (
    <div>
        <div className='min-h-screen bg-black font-sans text-black'>
          <div>
          <div className='flex flex-col items-center'>
          <div className='bg-white m-48 p-12 rounded-2xl'>
          <div className='flex flex-col items-center'>
          <div className='font-mono'>Path Games: Register</div>
            <form  className='flex flex-col items-center' onSubmit={handleSubmit}>
              <input
                className='mt-4 pt-1 pb-1 pl-1 border border-gray-700 rounded-md bg-gray-100'
                value={username}
                onChange={e => setUsername((prev)=>{const value = e.target.value;
                                            console.log(value.length); 
                                            if(!/^[a-zA-Z0-9]*$/.test(value)){
                                              setError('Usernames must be alphanumeric.');
                                              return prev;
                                            }
                                            if(value.length>16){
                                              setError('Usernames must be 16 characters or less.')
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
              <div></div>
              <input
                className='border border-gray-700 mt-4 pt-1 pb-1 pl-1 rounded-md bg-gray-100'
                type="password"
                value={password2}
                onChange={e => setPassword2((prev)=>{const value = e.target.value; 
                                            if(/^[a-zA-Z0-9\s.,!?]*$/.test(value)){
                                            return value;
                                            };
                                            setError('Passwords are alphanumeric and . , ! ? only.')
                                            return prev;})}
                placeholder="Re-enter password"
              />
              <div className='pt-4'>Have an account? <button className='text-blue-400 hover:underline' onClick={()=>navigate('/login/')}> Log in</button></div>
              <div className='text-red-400'>{error}</div>
              <div className='flex flex-col items-center'>
              <button className='mt-4 hover:bg-blue-200 bg-blue-300 rounded-3xl pl-4 pr-4 pt-2 pb-2 font-bold' type="submit">Register</button>
              </div>
              
            </form>
            </div>
          </div>
          </div>
          </div>
        </div>
        </div>
  );
}

export default Register;