import React, { useState } from "react";
import "../styling/Login.css"; // Import CSS file

function SignUpForm({ onLogin }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Your form submission logic here...
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="form-container">
      <div className="login-header-container">
        <h1 className="login-header-left">Welcome!</h1>
        <h1 className="login-header-right">Let's get started.</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="login-row">
          <div className="login-split-row-input-container"> {/* Apply input-container class */}
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
            />
          </div>
          <div className="login-split-row-input-container"> {/* Apply input-container class */}
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="login-input-container"> {/* Apply input-container class */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
          />
        </div>
        <div className="login-input-container"> {/* Apply input-container class */}
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>
        <div className="login-input-container"> {/* Apply input-container class */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        <button className="login-submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;