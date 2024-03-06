import React from "react";
import "../styling/Dashboard.css";

function Dashboard({ user }) {
  return (
    <div className="dashboard">
      <div className="welcome-container">
        <h1 className="welcome-heading">Welcome, {user.first_name} {user.last_name}!</h1>
        <p className="welcome-message">We're glad to have you on board.</p>
      </div>
    </div>
  );
}

export default Dashboard;