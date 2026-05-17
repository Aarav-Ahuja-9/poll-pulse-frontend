import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreatePollModal from "../components/CreatePollModal";
import Navbar from "../components/Navbar";
import { apiUrl } from "../config/api"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolls, setSelectedPolls] = useState([]);
  
  // Search and filter inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); 
  const [previewPollId, setPreviewPollId] = useState(null);

  // 🌗 CORE THEME STATE SWITCHER
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // 🚀 SYNC BODY SYSTEM THEME IMMEDIATELY
  useEffect(() => {
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
  }, [isDarkMode]);

  // 🌟 DYNAMIC THEME REALTIME LISTENER (Navbar Synchronizer)
  useEffect(() => {
    const syncThemeChanges = () => {
      const activeTheme = localStorage.getItem('theme');
      setIsDarkMode(activeTheme === 'dark' || activeTheme === null);
    };

    window.addEventListener('themeChange', syncThemeChanges);
    window.addEventListener('storage', syncThemeChanges);

    return () => {
      window.removeEventListener('themeChange', syncThemeChanges);
      window.removeEventListener('storage', syncThemeChanges);
    };
  }, []);

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

      const res = await axios.get(apiUrl("/api/polls/user/my-polls"), config);
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

      await axios.delete(apiUrl(`/api/polls/${id}`), config);
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
        apiUrl("/api/polls/user/bulk-delete"),
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

  // 🎨 DYNAMIC GRAPHIC STYLING SCHEMA MAPS (Fixes Light Mode Whitewash completely)
  const colorMainText = isDarkMode ? "#f8fafc" : "#0f172a";
  const colorSubText = isDarkMode ? "#94a3b8" : "#475569";
  const bgMainCard = isDarkMode ? "rgba(10, 15, 30, 0.4)" : "rgba(15, 23, 42, 0.04)";
  const borderCardTheme = isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.08)";
  const bgInputSearch = isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.04)";

  if (loading) {
    return (
      <div style={{ background: isDarkMode ? "#02040a" : "#f8fafc", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: colorMainText, fontFamily: "monospace", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ width: "8px", height: "8px", background: "#6366f1", borderRadius: "50%" }}></span>
          <h2>Loading Your Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`dashboard-wrapper${isDarkMode ? "" : " light"}`}
      style={{
        minHeight: "100vh",
        background: isDarkMode ? "#02040a" : "#f8fafc",
        color: colorMainText,
        transition: "color 0.3s ease, background-color 0.3s ease",
      }}
    >
      
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "500px", height: "500px", background: isDarkMode ? "radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: "400px", height: "400px", background: isDarkMode ? "radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)" : "radial-gradient(circle, rgba(168, 85, 247, 0.02) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

      {!isModalOpen && <Navbar />}

      <main className="dash-content" style={{ maxWidth: "1050px", margin: "0 auto", padding: "140px 24px 80px 24px", position: "relative", zIndex: 5 }}>
        
        {/* Top Header Layout */}
        <div className="dash-top-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div className="user-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                System Status: Active
              </div>

              {/* Theme State Override Sync Button */}
              <button 
                onClick={() => {
                  const currentTheme = localStorage.getItem('theme');
                  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
                  localStorage.setItem('theme', nextTheme);
                  window.dispatchEvent(new Event('themeChange'));
                }}
                style={{ background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: "none", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", color: colorSubText, cursor: "pointer", fontFamily: "monospace" }}
              >
                {isDarkMode ? "☀️ Change to Light UI" : "🌙 Change to Dark UI"}
              </button>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px", color: colorMainText }}>
              Hey {username},{" "}
              <span style={{ background: "linear-gradient(to right, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                What's the pulse today?
              </span>
            </h1>
          </div>
          <button onClick={handleLogout} style={{ background: "transparent", color: "#ef4444", border: isDarkMode ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(239, 68, 68, 0.6)", padding: "10px 18px", borderRadius: "100px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            Logout
          </button>
        </div>

        {/* Stats Row */}
        <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total Polls", val: polls.length, color: "inherit" },
            { label: "Total Votes", val: totalVotes, color: "#6366f1" },
            { label: "System Speed", val: "0.4ms", color: "#34d399" }
          ].map((item, index) => (
            <div key={index} style={{ background: isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(15, 23, 42, 0.02)", border: borderCardTheme, borderRadius: "16px", padding: "20px", transition: "all 0.3s" }}>
              <div style={{ fontSize: "12px", fontFamily: "monospace", color: colorSubText, textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ fontSize: "28px", fontWeight: "800", marginTop: "6px", color: item.color === "inherit" ? colorMainText : item.color }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* Action Panel */}
        <div className="action-cards" style={{ marginBottom: "32px" }}>
          <div className="create-card" style={{ background: bgMainCard, padding: "24px 28px", borderRadius: "20px", border: borderCardTheme, backdropFilter: "blur(12px)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s" }}>
            <div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700", color: colorMainText }}>Quick Action Terminal</h3>
              <p style={{ margin: 0, fontSize: "14px", color: colorSubText }}>Create and launch a brand new poll instantly.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} style={{ background: isDarkMode ? "#ffffff" : "#0f172a", color: isDarkMode ? "#02040a" : "#ffffff", border: "none", padding: "12px 24px", borderRadius: "100px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" }} className="create-poll-btn-action">
              + Create New Poll
            </button>
          </div>
        </div>

        <CreatePollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} refreshPolls={fetchPolls} />

        {/* Filters and Search Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px", position: "relative", zIndex: 10 }}>
          <input 
            type="text" 
            placeholder="🔍 Search polls by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              background: bgInputSearch, 
              border: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15, 23, 42, 0.1)", 
              padding: "10px 16px", 
              borderRadius: "100px", 
              color: colorMainText, 
              fontSize: "14px", 
              width: "100%", 
              maxWidth: "320px", 
              outline: "none",
              transition: "all 0.3s"
            }}
          />
          <div style={{ display: "flex", background: bgInputSearch, padding: "4px", borderRadius: "100px", border: borderCardTheme, transition: "all 0.3s" }}>
            {["ALL", "ACTIVE", "ENDED"].map((status) => (
              <button key={status} onClick={() => { setStatusFilter(status); setSelectedPolls([]); }} style={{ background: statusFilter === status ? (isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(15, 23, 42, 0.08)") : "transparent", color: statusFilter === status ? colorMainText : colorSubText, border: "none", padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Poll List Grid */}
        <section className="polls-section" style={{ display: "grid", gridTemplateColumns: previewPollId ? "1fr 340px" : "1fr", gap: "24px", transition: "all 0.3s", position: "relative", zIndex: 5 }}>
          
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(15, 23, 42, 0.06)", paddingBottom: "16px", transition: "all 0.3s", color: colorMainText }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>
                Your Polls ({filteredPolls.length})
              </h2>

              {filteredPolls.length > 0 && (
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button onClick={() => handleSelectAll(filteredPolls)} style={{ background: "transparent", color: colorSubText, border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.1)", padding: '8px 14px', borderRadius: "100px", cursor: "pointer", fontSize: "13px", fontWeight: "600", transition: "all 0.3s" }}>
                    {filteredPolls.map(p => p._id).every(id => selectedPolls.includes(id)) ? "Deselect All" : "Select Displayed"}
                  </button>
                  {selectedPolls.length > 0 && (
                    <button onClick={handleBulkDelete} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "100px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                      Delete Selected ({selectedPolls.length}) 🗑
                    </button>
                  )}
                </div>
              )}
            </div>

            {filteredPolls.length === 0 ? (
              <div className="empty-state" style={{ background: bgMainCard, borderRadius: "20px", padding: "60px 20px", textAlign: "center", border: isDarkMode ? "1px dashed rgba(255, 255, 255, 0.08)" : "1px dashed rgba(15, 23, 42, 0.08)", transition: "all 0.3s" }}>
                <p style={{ color: colorSubText }}>No polls found matching your search.</p>
              </div>
            ) : (
              <div className="polls-grid" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredPolls.map((poll) => (
                  <div key={poll._id} style={{ background: bgMainCard, borderRadius: "16px", padding: "16px 20px", border: selectedPolls.includes(poll._id) ? "1px solid #6366f1" : (previewPollId === poll._id ? (isDarkMode ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(15,23,42,0.3)") : (isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.08)")), display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s ease" }}>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <input type="checkbox" checked={selectedPolls.includes(poll._id)} onChange={() => handleSelectPoll(poll._id)} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#6366f1" }} />
                      <div onClick={() => setPreviewPollId(previewPollId === poll._id ? null : poll._id)} style={{ cursor: "pointer" }}>
                        <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700", color: colorMainText, transition: "color 0.3s" }}>{poll.title}</h3>
                        <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: colorSubText }}>
                          <span style={{ fontFamily: "monospace" }}>ID: {poll._id.substring(0, 8)}</span>
                          <span>•</span>
                          <span>Questions: {poll.questions?.length || 0}</span>
                          <span>•</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: (poll.isActive !== false ? "#34d399" : "#ef4444"), fontWeight: "600" }}>
                            <span style={{ width: "6px", height: "6px", background: (poll.isActive !== false ? "#34d399" : "#ef4444"), borderRadius: "50%" }}></span> 
                            {poll.isActive !== false ? "Live" : "Ended"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button onClick={() => { navigator.clipboard.writeText(`http://localhost:5173/poll/${poll.slug}`); alert("Link copied! 📋"); }} style={{ background: isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.04)", color: colorSubText, border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(15, 23, 42, 0.1)", padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s" }}>Copy Link</button>
                      <button onClick={() => navigate(`/dashboard/${poll._id}`)} style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Metrics</button>
                      <button onClick={() => handleDeletePoll(poll._id, poll.title)} style={{ background: "transparent", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.15)", padding: "6px 12px", borderRadius: "100px", cursor: "pointer" }}>Delete</button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Inspector Sidebar */}
          {previewPollId && (() => {
            const currentPreviewPoll = polls.find(p => p._id === previewPollId);
            if (!currentPreviewPoll) return null;
            return (
              <div style={{ background: isDarkMode ? "rgba(10, 15, 30, 0.6)" : "rgba(15, 23, 42, 0.04)", border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.1)", borderRadius: "20px", padding: "24px", backdropFilter: "blur(12px)", height: "fit-content", position: "sticky", top: "140px", transition: "all 0.3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#6366f1", background: "rgba(99,102,241,0.1)", padding: "2px 8px", borderRadius: "4px" }}>Quick View</span>
                  <span onClick={() => setPreviewPollId(null)} style={{ cursor: "pointer", opacity: 0.6, fontSize: "14px", fontWeight: "bold" }}>✕</span>
                </div>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700", color: colorMainText }}>{currentPreviewPoll.title}</h4>
                <p style={{ fontSize: "12px", color: colorSubText, margin: "0 0 16px 0", fontFamily: "monospace" }}>Slug: {currentPreviewPoll.slug}</p>
                
                <div style={{ borderTop: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(15, 23, 42, 0.08)", paddingTop: "14px", transition: "all 0.3s" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "#a855f7" }}>Questions Structure</div>
                  {currentPreviewPoll.questions?.map((q, idx) => (
                    <div key={idx} style={{ background: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", padding: "10px", borderRadius: "8px", marginBottom: "8px", fontSize: "12px", transition: "all 0.3s" }}>
                      <div style={{ fontWeight: "600", marginBottom: "4px", color: colorMainText }}>Q: {q.questionText}</div>
                      <div style={{ color: colorSubText }}>Options Count: {q.options?.length || 0}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

        </section>
      </main>
    </div>
  );
};

export default Dashboard;