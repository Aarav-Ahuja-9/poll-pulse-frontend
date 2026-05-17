import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiUrl, authRequestConfig, getAuthErrorMessage } from "../config/api"; 

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🌗 CORE THEME SYNC: Fetches layout constraints directly from common localStorage runtime
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    // Structural layout transitions engine
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    if (isDarkMode) {
      document.body.style.backgroundColor = '#02040a';
      document.body.style.color = '#f8fafc';
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
      localStorage.setItem('theme', 'light');
    }

    // Active cross-tab/module update trigger hook
    const handleGlobalThemeShift = () => {
      const savedTheme = localStorage.getItem('theme');
      setIsDarkMode(savedTheme === 'dark');
    };

    window.addEventListener('themeChange', handleGlobalThemeShift);
    return () => window.removeEventListener('themeChange', handleGlobalThemeShift);
  }, [isDarkMode]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        apiUrl("/api/users/signup"),
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        },
        authRequestConfig,
      );

      if (!res.data?.token) {
        alert("Account created but sign-in failed. Please log in manually.");
        navigate("/login");
        return;
      }

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          token: res.data.token,
          username: res.data.name,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      alert(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden", color: isDarkMode ? "#f8fafc" : "#0f172a", transition: "color 0.3s ease" }}>
      
      {/* 🔮 Corner Gradients (Altered values to protect contrast benchmarks) */}
      <div style={{ 
          position: "absolute", top: "-10%", left: "-10%", width: "400px", height: "400px", 
          background: isDarkMode ? "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)", 
          pointerEvents: "none", zIndex: -1 
      }} />
      <div style={{ 
          position: "absolute", bottom: "10%", right: "-10%", width: "500px", height: "500px", 
          background: isDarkMode ? "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)" : "radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)", 
          pointerEvents: "none", zIndex: -1 
      }} />

      {/* 🛠️ Raw Geometric Background Accents (Pointer blocks verified) */}
      <div style={{ position: "absolute", top: "25%", left: "10%", fontSize: "14px", fontFamily: "monospace", opacity: isDarkMode ? 0.15 : 0.35, pointerEvents: "none", userSelect: "none" }}>
        {`// initialize_user_session_v2`} <br />
        {`const payload = { name, email, password };`}
      </div>
      <div style={{ position: "absolute", bottom: "25%", right: "10%", fontSize: "14px", fontFamily: "monospace", opacity: isDarkMode ? 0.15 : 0.35, pointerEvents: "none", userSelect: "none", textAlign: "right" }}>
        {`import { useAuthContext } from './context';`} <br />
        {`api_status: "listening_for_payload"`}
      </div>

      <Navbar />

      <main style={{ 
          display: "flex", alignItems: "center", justifyContent: "center", 
          padding: "160px 5% 80px 5%", minHeight: "calc(100vh - 240px)", position: "relative", zIndex: 1
      }}>
        
        {/* 📦 Matte Glass Layout Card Container */}
        <div className="auth-card" style={{ 
            background: isDarkMode ? "rgba(10, 15, 30, 0.5)" : "rgba(255, 255, 255, 0.75)", 
            border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.08)", 
            borderRadius: "24px", 
            padding: "40px",
            maxWidth: "400px",
            width: "100%",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            textAlign: "center",
            position: "relative",
            transition: "all 0.3s ease",
            boxShadow: isDarkMode ? "0 20px 50px rgba(0, 0, 0, 0.3)" : "0 20px 50px rgba(0, 0, 0, 0.05)"
        }}>
          
          {/* Top Raw Tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)', padding: '4px 10px', borderRadius: '6px', marginBottom: '20px' }}>
             <span style={{ width: '6px', height: '6px', background: '#a855f7', borderRadius: '50%' }}></span>
             Registration Terminal
          </div>

          <h2 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 8px 0", letterSpacing: "-0.5px", color: isDarkMode ? "#fff" : "#0f172a" }}>
            Create Account
          </h2>
          <p style={{ fontSize: "14px", opacity: 0.6, margin: "0 0 32px 0", fontWeight: "500", color: isDarkMode ? "inherit" : "#475569" }}>
            Join SnapPolls to create live interactive campaigns.
          </p>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
            
            {/* Full Name Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", opacity: isDarkMode ? 0.8 : 0.65, color: isDarkMode ? "inherit" : "#0f172a" }}>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="custom-auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                    width: "100%", padding: "14px 16px", borderRadius: "10px",
                    background: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.03)", 
                    color: isDarkMode ? "#fff" : "#0f172a",
                    border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.1)", 
                    fontSize: "15px", outline: "none", transition: "all 0.2s", boxSizing: "border-box"
                }}
              />
            </div>

            {/* Email Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", opacity: isDarkMode ? 0.8 : 0.65, color: isDarkMode ? "inherit" : "#0f172a" }}>Email Address</label>
              <input
                type="email"
                placeholder="name@domain.com"
                className="custom-auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                    width: "100%", padding: "14px 16px", borderRadius: "10px",
                    background: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.03)", 
                    color: isDarkMode ? "#fff" : "#0f172a",
                    border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.1)", 
                    fontSize: "15px", outline: "none", transition: "all 0.2s", boxSizing: "border-box"
                }}
              />
            </div>
            
            {/* Password Field with Show/Hide */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", opacity: isDarkMode ? 0.8 : 0.65, color: isDarkMode ? "inherit" : "#0f172a" }}>Password</label>
                <span 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ fontSize: "12px", color: "#6366f1", cursor: "pointer", fontWeight: "600", userSelect: "none" }}
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
                    width: "100%", padding: "14px 16px", borderRadius: "10px",
                    background: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.03)", 
                    color: isDarkMode ? "#fff" : "#0f172a",
                    border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.1)", 
                    fontSize: "15px", outline: "none", transition: "all 0.2s", boxSizing: "border-box"
                }}
              />
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                className="btn-auth-submit"
                disabled={loading}
                style={{ 
                    width: "100%", background: "linear-gradient(135deg, #6366f1, #a855f7)", 
                    color: "#fff", border: "none", padding: "14px", borderRadius: "10px", 
                    fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", 
                    transition: "all 0.3s ease", marginTop: "10px", opacity: loading ? 0.7 : 1
                }}
            >
              {loading ? "Registering..." : "Create Account →"}
            </button>
          </form>

          {/* Footer Navigation */}
          <div style={{ marginTop: "32px", fontSize: "14px", opacity: 0.7, fontWeight: "500", color: isDarkMode ? "inherit" : "#475569" }}>
            Already have an account?{" "}
            <span 
              onClick={() => navigate("/login")} 
              className="auth-redirect-link"
              style={{ color: "#6366f1", cursor: "pointer", fontWeight: "700", marginLeft: "2px" }}
            >
              Sign In
            </span>
          </div>

        </div>
      </main>

      <style>{`
          .custom-auth-input:focus { 
              border-color: #6366f1 !important; 
              background: ${isDarkMode ? "rgba(99, 102, 241, 0.02)" : "rgba(99, 102, 241, 0.01)"} !important;
          }
          
          .btn-auth-submit:hover { 
              transform: translateY(-1px);
              opacity: 0.95;
          }
          
          .auth-redirect-link:hover { 
              text-decoration: underline;
          }
      `}</style>
    </div>
  );
};

export default Signup;