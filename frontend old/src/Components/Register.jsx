import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // 1. Register the user
      const registerResponse = await fetch('http://localhost:8000/api/user/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!registerResponse.ok) {
        throw new Error('Registration failed');
      }

      // 2. Log the user in to get tokens
      const loginResponse = await fetch('/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        throw new Error('Login failed after registration');
      }

      const loginData = await loginResponse.json();
      localStorage.setItem(ACCESS_TOKEN, loginData.access);
      localStorage.setItem(REFRESH_TOKEN, loginData.refresh);

      navigate('/'); // Redirect to home
    } catch (err) {
      alert(err.message || 'Registration or login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;