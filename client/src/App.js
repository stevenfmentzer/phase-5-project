import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Friends from './components/Friends';
import Messenger from './components/Messenger';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Get the navigate function from React Router

  // LOGIN
  const onLogin = (user) => {
    setUser(user);
  };

  // LOGOUT
  const onLogOut = () => {
    setUser(null);
  };

  // CHECK SESSION
  useEffect(() => {
    fetch('/check_session')
      .then((r) => {
        if (!r.ok) {
          throw new Error('Session check failed');
        }
        return r.json();
      })
      .then((user) => setUser(user))
      .catch(() => setUser(null));
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