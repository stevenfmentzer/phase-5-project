// LoginForm.js
import React, { useState } from "react";
import "../styling/Login.css"; // Import CSS file

function LoginForm({ user, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    fetch("http://localhost:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => {
        setIsLoading(false);
        if (r.ok) {
          r.json().then((user) => {
            localStorage.setItem("authToken", user.token);
            onLogin(user);
          });
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

  return (
    <div>
      <div className="login-header-container">
        <h1 className="login-header-left">Connect more.</h1>
        <h1 className="login-header-right">chat often.</h1>
      </div>
    <form onSubmit={handleSubmit}>
      <div className="login-input-container"> {/* Apply input-container class */}
        <input
          type="text"
          id="email"
          placeholder="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="login-input-container"> {/* Apply input-container class */}
        <input
          type="password"
          id="password"
          placeholder="password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="login-submit-button" type="submit">
        {isLoading ? "Loading..." : "Login"}
      </button>
    </form>
    </div>
  );
}

export default LoginForm;