import React, { useState } from "react";
import "../styling/Login.css"; // Import CSS file
import "../styling/EditUser.css"; // Import CSS file

function SignUpForm({ user }) {
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
    <div>
    <div className="login-container">
    <div className="form-container">
      <div className="login-header-container">
        <h1 className="edit-user-header">Edit Account</h1>

      </div>
      <form onSubmit={handleSubmit}>
        <div className="login-row">
          <div className="login-split-row-input-container"> {/* Apply input-container class */}
            <input
              type="text"
              name="first_name"
              placeholder={`${user.first_name}`}
              onChange={handleChange}
            />
          </div>
          <div className="login-split-row-input-container"> {/* Apply input-container class */}
            <input
              type="text"
              name="last_name"
              placeholder={`${user.last_name}`}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="login-input-container"> {/* Apply input-container class */}
          <input
            type="text"
            name="phone"
            placeholder={'2347917253'}
            onChange={handleChange}
          />
        </div>
        <div className="login-input-container"> {/* Apply input-container class */}
          <input
            type="text"
            name="email"
            placeholder={`jessica08@example.net`}
            onChange={handleChange}
          />
        </div>
        <div className="login-input-container"> {/* Apply input-container class */}
          <input
            type="password"
            name="password"
            placeholder=" Current Password"
            onChange={handleChange}
          />
        </div>
        <div className="login-input-container"> {/* Apply input-container class */}
          <input
            type="password"
            name="password"
            placeholder=" New Password"
            onChange={handleChange}
          />
        </div>
        <button className="login-submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
    </div>
        <div className="login-container">
        <div className="form-container">
          <div className="login-header-container">
            <h1 className="edit-user-header">Delete Account?</h1>
    
          </div>
          <form onSubmit={handleSubmit}>
            <div className="login-input-container"> {/* Apply input-container class */}
              <input
                type="password"
                name="password"
                placeholder=" Password"
                onChange={handleChange}
              />
            </div>
            <button className="login-submit-button" type="submit">
              Delete
            </button>
          </form>
        </div>
        </div>
        </div>
  );
}

export default SignUpForm;