import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiUrl, authRequestConfig, getAuthErrorMessage } from "../config/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    if (isDarkMode) {
      document.body.style.backgroundColor = "#02040a";
      document.body.style.color = "#f8fafc";
      localStorage.setItem("theme", "dark");
    } else {
      document.body.style.backgroundColor = "#f8fafc";
      document.body.style.color = "#0f172a";
      localStorage.setItem("theme", "light");
    }

    const handleGlobalThemeShift = () => {
      const savedTheme = localStorage.getItem("theme");
      setIsDarkMode(savedTheme === "dark");
    };

    window.addEventListener("themeChange", handleGlobalThemeShift);
    return () => window.removeEventListener("themeChange", handleGlobalThemeShift);
  }, [isDarkMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        apiUrl("/api/users/login"),
        { email: email.trim().toLowerCase(), password },
        authRequestConfig,
      );

      if (!res.data?.token) {
        alert("Login succeeded but no session token was returned. Try again.");
        return;
      }

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          token: res.data.token,
          username: res.data.name,
        }),
      );

      navigate("/dashboard");
    } catch (err) {
      alert(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflowX: "hidden",
        color: isDarkMode ? "#f8fafc" : "#0f172a",
        transition: "color 0.3s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "400px",
          height: "400px",
          background: isDarkMode
            ? "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-10%",
          width: "500px",
          height: "500px",
          background: isDarkMode
            ? "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <Navbar />

      <main
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "160px 5% 80px 5%",
          minHeight: "calc(100vh - 240px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="auth-card"
          style={{
            background: isDarkMode ? "rgba(10, 15, 30, 0.5)" : "rgba(255, 255, 255, 0.75)",
            border: isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(15, 23, 42, 0.08)",
            borderRadius: "24px",
            padding: "40px",
            maxWidth: "400px",
            width: "100%",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            textAlign: "center",
            transition: "all 0.3s ease",
            boxShadow: isDarkMode
              ? "0 20px 50px rgba(0, 0, 0, 0.3)"
              : "0 20px 50px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontFamily: "monospace",
              textTransform: "uppercase",
              color: "#6366f1",
              background: "rgba(99, 102, 241, 0.1)",
              padding: "4px 10px",
              borderRadius: "6px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                background: "#6366f1",
                borderRadius: "50%",
              }}
            />
            Secure Login
          </div>

          <h2
            style={{
              fontSize: "26px",
              fontWeight: "800",
              margin: "0 0 8px 0",
              letterSpacing: "-0.5px",
              color: isDarkMode ? "#fff" : "#0f172a",
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              fontSize: "14px",
              opacity: 0.6,
              margin: "0 0 32px 0",
              fontWeight: "500",
              color: isDarkMode ? "inherit" : "#475569",
            }}
          >
            Sign in to manage your live polls.
          </p>

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  opacity: isDarkMode ? 0.8 : 0.65,
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@domain.com"
                className="custom-auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: isDarkMode
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(15, 23, 42, 0.03)",
                  color: isDarkMode ? "#fff" : "#0f172a",
                  border: isDarkMode
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(15, 23, 42, 0.1)",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: isDarkMode ? 0.8 : 0.65,
                  }}
                >
                  Password
                </label>
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    fontSize: "12px",
                    color: "#6366f1",
                    cursor: "pointer",
                    fontWeight: "600",
                    userSelect: "none",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="custom-auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: isDarkMode
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(15, 23, 42, 0.03)",
                  color: isDarkMode ? "#fff" : "#0f172a",
                  border: isDarkMode
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(15, 23, 42, 0.1)",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "10px",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Authenticating..." : "Sign In →"}
            </button>
          </form>

          <div
            style={{
              marginTop: "32px",
              fontSize: "14px",
              opacity: 0.7,
              fontWeight: "500",
              color: isDarkMode ? "inherit" : "#475569",
            }}
          >
            Don&apos;t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="auth-redirect-link"
              style={{ color: "#6366f1", cursor: "pointer", fontWeight: "700" }}
            >
              Create Account
            </span>
          </div>
        </div>
      </main>

      <style>{`
        .custom-auth-input:focus {
          border-color: #6366f1 !important;
          background: ${isDarkMode ? "rgba(99, 102, 241, 0.02)" : "rgba(99, 102, 241, 0.01)"} !important;
        }
        .btn-auth-submit:hover { transform: translateY(-1px); opacity: 0.95; }
        .auth-redirect-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
};

export default Login;
