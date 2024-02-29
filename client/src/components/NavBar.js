import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/NavBar.css'; // Import CSS file for styling

function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1>Here I.M.</h1>
                <div className="nav-links">
                    <Link to="/user/messenger">Messenger</Link>
                    <Link to="/user/friends">Friends</Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;