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
                        <Link to="/user/messenger">Messenger</Link>
                        <Link to="/user/friends">Friends</Link>
                        <button className="nav-button" onClick={onLogOut}>Log Out</button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;