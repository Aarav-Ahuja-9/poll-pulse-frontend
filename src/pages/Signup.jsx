import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🚀 Backend endpoint changed to registration flow
      const res = await axios.post("http://localhost:5001/api/users/signup", {
        name,
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
      alert(err.response?.data?.message || "Registration Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* 🔮 Subtle Corner Gradients (Consistent with Login) */}
      <div style={{ 
          position: "absolute", top: "-10%", left: "-10%", width: "400px", height: "400px", 
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", 
          pointerEvents: "none", zIndex: -1 
      }} />
      <div style={{ 
          position: "absolute", bottom: "10%", right: "-10%", width: "500px", height: "500px", 
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)", 
          pointerEvents: "none", zIndex: -1 
      }} />

      {/* 🛠️ Raw Geometric Background Accents */}
      <div style={{ position: "absolute", top: "25%", left: "10%", fontSize: "14px", fontFamily: "monospace", opacity: 0.15, pointerEvents: "none", userSelect: "none" }}>
        {`// initialize_user_session_v2`} <br />
        {`const payload = { name, email, password };`}
      </div>
      <div style={{ position: "absolute", bottom: "25%", right: "10%", fontSize: "14px", fontFamily: "monospace", opacity: 0.15, pointerEvents: "none", userSelect: "none", textAlign: "right" }}>
        {`import { useAuthContext } from './context';`} <br />
        {`api_status: "listening_for_payload"`}
      </div>

      <Navbar />

      <main style={{ 
          display: "flex", alignItems: "center", justifyContent: "center", 
          padding: "160px 5% 80px 5%", minHeight: "calc(100vh - 240px)" 
      }}>
        
        {/* 📦 Minimal Locked Card Layout */}
        <div className="auth-card" style={{ 
            background: "rgba(10, 15, 30, 0.5)", 
            border: "1px solid rgba(255, 255, 255, 0.1)", 
            borderRadius: "24px", 
            padding: "40px",
            maxWidth: "400px",
            width: "100%",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            textAlign: "center",
            position: "relative"
        }}>
          
          {/* Top Raw Tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)', padding: '4px 10px', borderRadius: '6px', marginBottom: '20px' }}>
             <span style={{ width: '6px', height: '6px', background: '#a855f7', borderRadius: '50%' }}></span>
             Registration Terminal
          </div>

          <h2 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
            Create Account
          </h2>
          <p style={{ fontSize: "14px", opacity: 0.6, margin: "0 0 32px 0", fontWeight: "500" }}>
            Join SnapPolls to create live interactive campaigns.
          </p>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
            
            {/* Full Name Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.8 }}>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="custom-auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                    width: "100%", padding: "14px 16px", borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.03)", color: "inherit",
                    border: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "15px",
                    outline: "none", transition: "all 0.2s", boxSizing: "border-box"
                }}
              />
            </div>

            {/* Email Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.8 }}>Email Address</label>
              <input
                type="email"
                placeholder="name@domain.com"
                className="custom-auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                    width: "100%", padding: "14px 16px", borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.03)", color: "inherit",
                    border: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "15px",
                    outline: "none", transition: "all 0.2s", boxSizing: "border-box"
                }}
              />
            </div>
            
            {/* Password Field with Show/Hide */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.8 }}>Password</label>
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
                    background: "rgba(255, 255, 255, 0.03)", color: "inherit",
                    border: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "15px",
                    outline: "none", transition: "all 0.2s", boxSizing: "border-box"
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
          <div style={{ marginTop: "32px", fontSize: "14px", opacity: 0.7, fontWeight: "500" }}>
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
              background: rgba(99, 102, 241, 0.02) !important;
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