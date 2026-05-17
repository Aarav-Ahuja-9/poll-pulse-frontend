import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreatePollModal from "../components/CreatePollModal";
import Navbar from "../components/Navbar"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolls, setSelectedPolls] = useState([]);
  
  // Search and filter engines states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); 
  const [previewPollId, setPreviewPollId] = useState(null);

  // 🌗 GLOBAL STATE SYNC: Directly reads localStorage parameters reliably
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const fetchPolls = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;

      if (!userInfo || !userInfo.token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/polls/user/my-polls`,
        config,
      );
      setPolls(res.data.polls || []);
      setSelectedPolls([]);
    } catch (err) {
      console.error("Error fetching user polls:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoll = async (id, title) => {
    const confirmDelete = window.confirm(
      `Bhai, sach me "${title}" ko delete karna hai?`,
    );
    if (!confirmDelete) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.delete(`http://localhost:5001/api/polls/${id}`, config);
      setPolls(polls.filter((poll) => poll._id !== id));
      setSelectedPolls(selectedPolls.filter((pId) => pId !== id));
      if (previewPollId === id) setPreviewPollId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    const confirmBulk = window.confirm(
      `Bhai, sach me ye saare (${selectedPolls.length}) selected polls udaane hain? 🔥`,
    );
    if (!confirmBulk) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.post(
        `http://localhost:5001/api/polls/user/bulk-delete`,
        { pollIds: selectedPolls },
        config,
      );

      setPolls(polls.filter((poll) => !selectedPolls.includes(poll._id)));
      setSelectedPolls([]);
      setPreviewPollId(null);
    } catch (err) {
      console.error("Bulk Delete Error:", err);
    }
  };

  const handleSelectPoll = (id) => {
    if (selectedPolls.includes(id)) {
      setSelectedPolls(selectedPolls.filter((pId) => pId !== id));
    } else {
      setSelectedPolls([...selectedPolls, id]);
    }
  };

  const handleSelectAll = (currentFilteredNodes) => {
    const filteredIds = currentFilteredNodes.map((p) => p._id);
    const allFilteredAreSelected = filteredIds.every((id) => selectedPolls.includes(id));

    if (allFilteredAreSelected) {
      setSelectedPolls(selectedPolls.filter((id) => !filteredIds.includes(id)));
    } else {
      const newSelection = [...selectedPolls, ...filteredIds];
      setSelectedPolls([...new Set(newSelection)]);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    if (!userInfo || !userInfo.token) {
      navigate("/login");
    } else {
      setUsername(userInfo.username || "Creator");
      fetchPolls();
    }

    // 🌗 Live event trigger capturing system theme changes across tabs/modules
    const handleGlobalThemeShift = () => {
      const savedTheme = localStorage.getItem('theme');
      setIsDarkMode(savedTheme === 'dark');
    };

    window.addEventListener('themeChange', handleGlobalThemeShift);
    return () => window.removeEventListener('themeChange', handleGlobalThemeShift);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Global Calculations
  const totalVotes = polls.reduce((acc, current) => {
    const questionsVotes = current.questions?.reduce((qAcc, q) => {
      const optionsVotes = q.options?.reduce((oAcc, o) => oAcc + (o.votes || 0), 0) || 0;
      return qAcc + optionsVotes;
    }, 0) || 0;
    return acc + questionsVotes;
  }, 0);

  // Filter Engine
  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchQuery.toLowerCase());
    const isPollActive = poll.isActive !== undefined ? poll.isActive : true; 
    
    if (statusFilter === "ACTIVE") return matchesSearch && isPollActive;
    if (statusFilter === "ENDED") return matchesSearch && !isPollActive;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ background: isDarkMode ? "#02040a" : "#f8fafc", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: isDarkMode ? "#f8fafc" : "#0f172a", fontFamily: "monospace", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ width: "8px", height: "8px", background: "#6366f1", borderRadius: "50%" }}></span>
          <h2>Loading Session Grid...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-wrapper${isDarkMode ? "" : " light"}`} style={{ position: "relative", minHeight: "100vh", overflowX: "hidden", background: isDarkMode ? "#02040a" : "#f8fafc", color: isDarkMode ? "#f8fafc" : "#0f172a", transition: "color 0.3s ease, background-color 0.3s ease" }}>
      
      {/* 🔮 Background Canvas Effects */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "500px", height: "500px", background: isDarkMode ? "radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: -1 }} />
      <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: "400px", height: "400px", background: isDarkMode ? "radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)" : "radial-gradient(circle, rgba(168, 85, 247, 0.03) 0%, transparent 70%)", pointerEvents: "none", zIndex: -1 }} />

      {/* 🔵 Neon Graphic Aura */}
      <div style={{ position: 'absolute', top: '15%', right: '8%', width: '260px', height: '260px', borderRadius: '50%', border: '4px solid transparent', backgroundImage: isDarkMode ? 'linear-gradient(#02040a, #02040a), linear-gradient(135deg, #00f2fe 0%, #4facfe 40%, #a855f7 100%)' : 'linear-gradient(#f8fafc, #f8fafc), linear-gradient(135deg, #00f2fe 0%, #4facfe 40%, #a855f7 100%)', backgroundClip: 'content-box, border-box', boxShadow: isDarkMode ? '0 0 40px rgba(0, 242, 254, 0.12)' : '0 0 30px rgba(0, 242, 254, 0.06)', animation: 'neonOrbit 25s infinite linear', pointerEvents: 'none', zIndex: -1 }} />

      {/* 🛰️ System Metadata Accents */}
      <div style={{ position: "absolute", top: "22%", left: "6%", fontSize: "12px", fontFamily: "monospace", opacity: isDarkMode ? 0.15 : 0.3, pointerEvents: "none", userSelect: "none", zIndex: -1 }}>
        {`// dashboard_stream_v1.2`}<br />
        {`connection: "established"`}
      </div>
      <div style={{ position: "absolute", bottom: "28%", right: "6%", fontSize: "11px", fontFamily: "monospace", opacity: isDarkMode ? 0.22 : 0.45, pointerEvents: "none", userSelect: "none", border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.08)", padding: "10px 14px", borderRadius: "8px", background: isDarkMode ? "rgba(255, 255, 255, 0.01)" : "rgba(0, 0, 0, 0.01)", zIndex: -1 }}>
        <div style={{ color: "#6366f1", marginBottom: "4px", fontWeight: "700" }}>● MONITOR_METRICS</div>
        {`Data Streams: ${polls.length}`}<br />
        {`Socket State: stable`}<br />
        {`Loss Rate: 0.00%`}
      </div>

      <Navbar />

      <main className="dash-content" style={{ maxWidth: "1050px", margin: "0 auto", padding: "140px 24px 80px 24px", position: "relative", zIndex: 1 }}>
        
        {/* Workspace Greeting Header */}
        <div className="dash-top-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div className="user-info">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '6px', marginBottom: '12px' }}>
              System Framework: Secure
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" }}>
              Hey {username},{" "}
              <span style={{ background: "linear-gradient(to right, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                What's the pulse today?
              </span>
            </h1>
          </div>
          <button onClick={handleLogout} style={{ background: "transparent", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "10px 18px", borderRadius: "100px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            Terminate Session
          </button>
        </div>

        {/* Global Operational Analytics Cards */}
        <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total Deployments", val: polls.length, color: "inherit" },
            { label: "Accumulated Votes", val: totalVotes, color: "#6366f1" },
            { label: "System Latency", val: "0.4ms", color: "#34d399" }
          ].map((item, index) => (
            <div key={index} style={{ background: isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(15, 23, 42, 0.02)", border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(15, 23, 42, 0.06)", borderRadius: "16px", padding: "20px", transition: "all 0.3s" }}>
              <div style={{ fontSize: "12px", fontFamily: "monospace", color: isDarkMode ? "#94a3b8" : "#475569", textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ fontSize: "28px", fontWeight: "800", marginTop: "6px", color: item.color === "inherit" ? (isDarkMode ? "#fff" : "#0f172a") : item.color }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* Deployment Pipeline Trigger */}
        <div className="action-cards" style={{ marginBottom: "32px" }}>
          <div className="create-card" style={{ background: isDarkMode ? "rgba(10, 15, 30, 0.4)" : "rgba(255, 255, 255, 0.65)", padding: "24px 28px", borderRadius: "20px", border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.06)", backdropFilter: "blur(12px)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s" }}>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700" }}>Quick Action Terminal</h3>
              <p style={{ margin: 0, fontSize: "14px", color: isDarkMode ? "#94a3b8" : "#475569" }}>Launch an instantaneous real-time polling session configuration.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} style={{ background: isDarkMode ? "#ffffff" : "#0f172a", color: isDarkMode ? "#02040a" : "#ffffff", border: "none", padding: "12px 24px", borderRadius: "100px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" }} className="create-poll-btn-action">
              + Deploy New Poll
            </button>
          </div>
        </div>

        <CreatePollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} refreshPolls={fetchPolls} />

        {/* Search Engine & Segment Filtering Controllers */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px", position: "relative", zIndex: 10 }}>
          <input 
            type="text" 
            placeholder="🔍 Filter node by title string..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              background: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.03)", 
              border: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)", 
              padding: "10px 16px", 
              borderRadius: "100px", 
              color: isDarkMode ? "#fff" : "#0f172a", 
              fontSize: "14px", 
              width: "100%", 
              maxWidth: "320px", 
              outline: "none",
              position: "relative",
              zIndex: 20,
              pointerEvents: "auto",
              transition: "all 0.3s"
            }}
            className="search-input-field"
          />
          <div style={{ display: "flex", background: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.03)", padding: "4px", borderRadius: "100px", border: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(15, 23, 42, 0.06)", position: "relative", zIndex: 20, transition: "all 0.3s" }}>
            {["ALL", "ACTIVE", "ENDED"].map((status) => (
              <button key={status} onClick={() => { setStatusFilter(status); setSelectedPolls([]); }} style={{ background: statusFilter === status ? (isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)") : "transparent", color: statusFilter === status ? (isDarkMode ? "#fff" : "#0f172a") : (isDarkMode ? "#94a3b8" : "#475569"), border: "none", padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Main Workspace Grid Layout */}
        <section className="polls-section" style={{ display: "grid", gridTemplateColumns: previewPollId ? "1fr 340px" : "1fr", gap: "24px", transition: "all 0.3s", position: "relative", zIndex: 5 }}>
          
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(15, 23, 42, 0.06)", paddingBottom: "16px", transition: "all 0.3s" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>
                Live Grid Node ({filteredPolls.length})
              </h2>

              {filteredPolls.length > 0 && (
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button onClick={() => handleSelectAll(filteredPolls)} style={{ background: "transparent", color: isDarkMode ? "#94a3b8" : "#475569", border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.1)", padding: "8px 14px", borderRadius: "100px", cursor: "pointer", fontSize: "13px", fontWeight: "600", transition: "all 0.3s" }} className="action-panel-btn">
                    {filteredPolls.map(p => p._id).every(id => selectedPolls.includes(id)) ? "Deselect Displayed" : "Select Displayed"}
                  </button>
                  {selectedPolls.length > 0 && (
                    <button onClick={handleBulkDelete} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "100px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                      Purge Selected ({selectedPolls.length}) 🗑
                    </button>
                  )}
                </div>
              )}
            </div>

            {filteredPolls.length === 0 ? (
              <div className="empty-state" style={{ background: isDarkMode ? "rgba(10, 15, 30, 0.2)" : "rgba(255, 255, 255, 0.2)", borderRadius: "20px", padding: "60px 20px", textAlign: "center", border: isDarkMode ? "1px dashed rgba(255, 255, 255, 0.08)" : "1px dashed rgba(15, 23, 42, 0.08)", transition: "all 0.3s" }}>
                <p style={{ color: isDarkMode ? "#94a3b8" : "#475569" }}>No active structural streams matched your filtering query string.</p>
              </div>
            ) : (
              <div className="polls-grid" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredPolls.map((poll) => (
                  <div key={poll._id} style={{ background: isDarkMode ? "rgba(10, 15, 30, 0.4)" : "rgba(255, 255, 255, 0.6)", borderRadius: "16px", padding: "16px 20px", border: selectedPolls.includes(poll._id) ? "1px solid #6366f1" : (previewPollId === poll._id ? (isDarkMode ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(15,23,42,0.25)") : (isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.06)")), display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s ease" }}>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <input type="checkbox" checked={selectedPolls.includes(poll._id)} onChange={() => handleSelectPoll(poll._id)} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#6366f1" }} />
                      <div onClick={() => setPreviewPollId(previewPollId === poll._id ? null : poll._id)} style={{ cursor: "pointer" }}>
                        <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700", color: isDarkMode ? "#fff" : "#0f172a", transition: "color 0.3s" }}>{poll.title}</h3>
                        <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: isDarkMode ? "#94a3b8" : "#475569" }}>
                          <span style={{ fontFamily: "monospace" }}>{poll._id.substring(0, 8)}</span>
                          <span>•</span>
                          <span>Segments: {poll.questions?.length || 0}</span>
                          <span>•</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: (poll.isActive !== false ? "#34d399" : "#ef4444"), fontWeight: "600" }}>
                            <span style={{ width: "6px", height: "6px", background: (poll.isActive !== false ? "#34d399" : "#ef4444"), borderRadius: "50%" }}></span> 
                            {poll.isActive !== false ? "Live" : "Ended"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button onClick={() => { navigator.clipboard.writeText(`http://localhost:5173/poll/${poll.slug}`); alert("Anchor securely copied! 📋"); }} style={{ background: isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(15, 23, 42, 0.02)", color: isDarkMode ? "#94a3b8" : "#475569", border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(15, 23, 42, 0.06)", padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s" }}>Anchor</button>
                      <button onClick={() => navigate(`/dashboard/${poll._id}`)} style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Metrics</button>
                      <button onClick={() => handleDeletePoll(poll._id, poll.title)} style={{ background: "transparent", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.15)", padding: "6px 12px", borderRadius: "100px", cursor: "pointer" }}>Purge</button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Node Live Blueprint Inspector */}
          {previewPollId && (() => {
            const currentPreviewPoll = polls.find(p => p._id === previewPollId);
            if (!currentPreviewPoll) return null;
            return (
              <div style={{ background: isDarkMode ? "rgba(10, 15, 30, 0.6)" : "rgba(255, 255, 255, 0.8)", border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.08)", boxShadow: isDarkMode ? "none" : "0 10px 30px rgba(0,0,0,0.04)", borderRadius: "20px", padding: "24px", backdropFilter: "blur(12px)", height: "fit-content", position: "sticky", top: "140px", transition: "all 0.3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#6366f1", background: "rgba(99,102,241,0.1)", padding: "2px 8px", borderRadius: "4px" }}>Node Inspector</span>
                  <span onClick={() => setPreviewPollId(null)} style={{ cursor: "pointer", opacity: 0.6, fontSize: "14px", fontWeight: "bold" }}>✕</span>
                </div>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700" }}>{currentPreviewPoll.title}</h4>
                <p style={{ fontSize: "12px", color: isDarkMode ? "#94a3b8" : "#475569", margin: "0 0 16px 0", fontFamily: "monospace" }}>slug: {currentPreviewPoll.slug}</p>
                
                <div style={{ borderTop: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(15, 23, 42, 0.06)", paddingTop: "14px", transition: "all 0.3s" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "#a855f7" }}>Structure Blueprint</div>
                  {currentPreviewPoll.questions?.map((q, idx) => (
                    <div key={idx} style={{ background: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)", padding: "10px", borderRadius: "8px", marginBottom: "8px", fontSize: "12px", transition: "all 0.3s" }}>
                      <div style={{ fontWeight: "600", marginBottom: "4px" }}>Q: {q.questionText}</div>
                      <div style={{ color: isDarkMode ? "#94a3b8" : "#475569" }}>Options Matrix: {q.options?.length || 0} vectors</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

        </section>
      </main>

      <style>{`
          .action-panel-btn:hover { color: ${isDarkMode ? "#fff" : "#0f172a"} !important; border-color: ${isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.3)"} !important; }
          .create-poll-btn-action:hover { opacity: 0.95; transform: scale(1.01); }
          .search-input-field:focus { border-color: #6366f1 !important; background: ${isDarkMode ? "rgba(99,102,241,0.02)" : "rgba(99,102,241,0.01)"} !important; }
          @keyframes neonOrbit {
            0% { transform: rotate(0deg) translate(0px, 0px); }
            50% { transform: rotate(180deg) translate(-10px, 15px); }
            100% { transform: rotate(360deg) translate(0px, 0px); }
          }
      `}</style>
    </div>
  );
};

export default Dashboard;