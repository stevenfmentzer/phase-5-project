import React, { useState } from "react";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

function Login({ user, onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      <hr /> {/* Horizontal rule to separate sections */}
      {showLogin ? (
        <>
          <LoginForm user={user} onLogin={onLogin}/>
          <br /> {/* Line break for spacing */}
          <p>
            Don't have an account?{" "}
            <button className="btn-secondary" onClick={() => setShowLogin(false)}>
              Sign Up
            </button>
          </p>
        </>
      ) : (
        <>
          <SignUpForm user={user} onLogin={onLogin}/>
          <br /> {/* Line break for spacing */}
          {!user && (
            <p>
              Already have an account?{" "}
              <button className="btn-secondary" onClick={() => setShowLogin(true)}>
                Log In
              </button>
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Login;