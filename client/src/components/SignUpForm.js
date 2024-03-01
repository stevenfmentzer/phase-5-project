// SignUpForm.js
import React, { useState } from "react";
import "../styling/Login.css"; // Import CSS file

function SignUpForm({ onLogin }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5555/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("SUCCESSFUL POST:");
        console.log(responseData);

        const loginCredentials = {
          email: formData.username,
          password: formData.password,
        };

        console.log("LOGIN CREDENTIALS:");
        console.log(loginCredentials);

        const loginData = await fetch("http://localhost:5555/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginCredentials),
        });

        if (loginData.ok) {
          const loginResponse = await loginData.json();
          onLogin(loginResponse);
          console.log("LOGGED IN:");
          console.log(loginResponse);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="login-input-container"> {/* Apply input-container class */}
        <input
          type="text"
          name="first_name"
          placeholder="first name"
          onChange={handleChange}
        />
      </div>
      <div className="login-input-container"> {/* Apply input-container class */}
        <input
          type="text"
          name="last_name"
          placeholder="last name"
          onChange={handleChange}
        />
      </div>
      <div className="login-input-container"> {/* Apply input-container class */}
        <input
          type="text"
          name="email"
          placeholder="email"
          onChange={handleChange}
        />
      </div>
      <div className="login-input-container"> {/* Apply input-container class */}
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
        />
      </div>
      <button className="login-submit-button" type="submit">
        Submit
      </button>
    </form>
  );
}

export default SignUpForm;