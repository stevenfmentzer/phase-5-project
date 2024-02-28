import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Friends from './components/Friends';
import Messenger from './components/Messenger';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate()

   
  // LOGIN
  const onLogin = (user) => {
    setUser(user);
    console.log(user)
    navigate('/user/friends')
  };

  // LOGOUT
  const onLogOut = () => {
    setUser(null);
  };

  // CHECK SESSION
  useEffect(() => {
    // Check localStorage for JWT token
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // Send token to server to verify validity
      fetch("http://localhost:5555/session", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: authToken }) // Include token in the request body
      })
      .then((response) => {
        if (response.ok) {
          return response.json(); // parse response body as JSON
        }
        throw new Error('Failed to verify user session');
      })
      .then((userData) => {
        setUser(userData); // update user state with fetched user data
      })
      .catch((error) => {
        console.error('Error verifying user session:', error);
        // Clear invalid token from localStorage
        localStorage.removeItem('authToken');
      });
    }
  }, []);


  return (
    <>
      <Routes>
        <Route path="/" element={<Login user={user} onLogin={onLogin} onLogOut={onLogOut} />} />
        <Route path="/user/friends" element={<Friends user={user} />} />
        <Route path="/user/messenger" element={<Messenger user={user} />} />
      </Routes>
    </>
  );
}

export default App;