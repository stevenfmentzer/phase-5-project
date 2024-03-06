import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/NavBar.css'; // Import CSS file for styling

function NavBar({ user, onLogOut }) {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <h1>Here IM</h1>
                </Link>
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