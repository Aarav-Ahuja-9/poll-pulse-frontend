import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Signup response status:", response.status, data);

      if (response.status === 201) {
        alert("Account created successfully!");
        setFormData({ name: "", email: "", password: "" });
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup request failed:", error);
      alert("Unable to create account. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-glow-1"></div>
      <div className="auth-glow-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Join the Pulse</h2>
          <p className="auth-subtitle">Create your account to start polling.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="auth-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button type="submit" className="auth-submit-btn">
            Create Account
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="google-btn">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg"
            alt="G"
          />
          Continue with Google
        </button>

        <p className="auth-footer">
          Already a member? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
