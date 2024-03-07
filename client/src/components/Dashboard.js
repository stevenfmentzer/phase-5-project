import React, { useState } from 'react';
import "../styling/Dashboard.css";

function Dashboard({ user }) {

  return (
    <div className="dashboard">
      <div className="welcome-container">
        <h1 className="welcome-heading">Welcome, {user.first_name} {user.last_name}!</h1>
        <p className="welcome-message">We're glad to see you again.</p>
        <p className="welcome-message">It's been a while since you have reached out to NAME NAME.</p>
        <p className="welcome-message">NAME NAME and NAME NAME's birthdays are coming up.</p>
        <p className="welcome-message">Who is someone you haven't heard from in a while?</p>
        <p className="welcome-message">Share a memory with them.</p>
      </div>
    </div>
  );
}

export default Dashboard;