import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styling/NavBar.css'; // Import CSS file for styling

function NavBar({ user, onLogOut }) {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    return (
        <nav className="navbar" onMouseMove={handleMouseMove}>
            <div className="navbar-container">
                <Link to={user ? "/dashboard" : "/"} className="nav-header">Here IM</Link>
                <div className="color-shift-effect" style={{ background: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, #3689dcb8, transparent)` }}></div>
                {user && (
                    <div className="nav-links">
                        <Link to="/messenger" className="nav-link">Messenger</Link>
                        <Link to="/friends" className="nav-link">Friends</Link>
                        <Link to="/" className="nav-link">Log-out</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;