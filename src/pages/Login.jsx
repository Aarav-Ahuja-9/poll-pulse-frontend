import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      const res = await axios.post("http://localhost:5001/api/users/login", {
        email,
        password,
      });

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          token: res.data.token,
          username: res.data.name,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-h2">Welcome Back</h2>
        <p className="auth-p">Log in to check the pulse of your polls.</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <div className="auth-footer">
          New to Poll Pulse?{" "}
          <a href="/signup" className="auth-link">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
