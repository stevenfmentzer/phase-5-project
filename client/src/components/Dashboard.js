import React, { useState } from "react";

function Dashboard({ user }) {

  return (
    <div className="dashboard">
      <h1>Welcome, {user.first_name} {user.last_name}!</h1>
    </div>
  );
}

export default Dashboard;