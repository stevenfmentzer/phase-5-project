import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Friends from './components/Friends';
import Messenger from './components/Messenger';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // LOGIN
  const onLogin = (user) => {
    setUser(user);
    navigate('/dashboard');
  };

  // LOGOUT
  const onLogOut = () => {
    setUser(null);
    navigate('/');
  }

  return (
    <div>
    <NavBar user={user} onLogOut={onLogOut}/>
      <Routes>
        <Route path="/" element={<Login user={user} onLogin={onLogin} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/friends" element={<Friends user={user} />} />
        <Route path="/messenger" element={<Messenger user={user} />} />
      </Routes>
    </div>
  );
}


export default App;