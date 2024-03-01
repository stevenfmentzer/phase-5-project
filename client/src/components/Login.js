import React, { useState } from "react";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import "../styling/Login.css"; // Import CSS file

function Login({ user, onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="login-container"> {/* Apply login-container class */}
      {showLogin ? (
        <>
          <LoginForm user={user} onLogin={onLogin}/>
          <br /> {/* Line break for spacing */}
          <p className="login-text">
            Don't have an account?{" "}
            <span className="login-toggle-button">
              <button className="btn-secondary" onClick={() => setShowLogin(false)}>
                Sign Up
              </button>
            </span>
          </p>
        </>
      ) : (
        <>
          <SignUpForm user={user} onLogin={onLogin}/>
          <br /> {/* Line break for spacing */}
          {!user && (
            <p className="login-text">
              Already have an account?{" "}
              <span className="login-toggle-button">
                <button className="btn-secondary" onClick={() => setShowLogin(true)}>
                  Log In
                </button>
              </span>
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Login;