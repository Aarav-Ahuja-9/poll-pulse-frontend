import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreatePollModal from "../components/CreatePollModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPolls, setSelectedPolls] = useState([]);

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
      alert("Poll deleted! 🗑️");
      setPolls(polls.filter((poll) => poll._id !== id));
      setSelectedPolls(selectedPolls.filter((pId) => pId !== id));
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

      const res = await axios.post(
        `http://localhost:5001/api/polls/user/bulk-delete`,
        { pollIds: selectedPolls },
        config,
      );
      alert(res.data.message);

      setPolls(polls.filter((poll) => !selectedPolls.includes(poll._id)));
      setSelectedPolls([]);
    } catch (err) {
      console.error("Bulk Delete Error:", err);
      alert("Bulk delete karne me koi dikkat aayi!");
    }
  };

  const handleSelectPoll = (id) => {
    if (selectedPolls.includes(id)) {
      setSelectedPolls(selectedPolls.filter((pId) => pId !== id));
    } else {
      setSelectedPolls([...selectedPolls, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPolls.length === polls.length) {
      setSelectedPolls([]);
    } else {
      setSelectedPolls(polls.map((p) => p._id));
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

  if (loading) {
    return (
      <div
        style={{
          background: "#0f172a",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <h2>Loading Your Studio... 📊</h2>
      </div>
    );
  }

  return (
    <div
      className="dashboard-wrapper"
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        padding: "20px",
        color: "#f8fafc",
      }}
    >
      <main
        className="dash-content"
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        <div
          className="dash-top-bar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div className="user-info">
            <h1 style={{ fontSize: "28px", margin: 0 }}>
              Hey {username},{" "}
              <span className="pulse-text" style={{ color: "#38bdf8" }}>
                What's the pulse today?
              </span>
            </h1>
            <p style={{ color: "#94a3b8", marginTop: "5px" }}>
              Track, manage and create your polls in one place.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="logout-btn-minimal"
            style={{
              background: "transparent",
              color: "#ef4444",
              border: "1px solid #ef4444",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Logout
          </button>
        </div>

        <div className="action-cards" style={{ marginBottom: "40px" }}>
          <div
            className="create-card"
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #334155",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>Quick Action</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="create-poll-btn"
              style={{
                background: "#38bdf8",
                color: "#0f172a",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              + Create New Poll
            </button>
          </div>
        </div>

        <CreatePollModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refreshPolls={fetchPolls}
        />

        <section className="polls-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "22px", margin: 0 }}>
              Your Recent Polls ({polls.length})
            </h2>

            {polls.length > 0 && (
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <button
                  onClick={handleSelectAll}
                  style={{
                    background: "transparent",
                    color: "#94a3b8",
                    border: "1px solid #334155",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {selectedPolls.length === polls.length
                    ? "Unselect All"
                    : "Select All"}
                </button>

                {selectedPolls.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "6px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    Delete Selected ({selectedPolls.length}) 🗑️
                  </button>
                )}
              </div>
            )}
          </div>

          {polls.length === 0 ? (
            <div
              className="empty-state"
              style={{
                background: "#1e293b",
                borderRadius: "16px",
                padding: "40px",
                textAlign: "center",
                border: "1px dashed #334155",
              }}
            >
              <div
                className="icon"
                style={{ fontSize: "40px", marginBottom: "10px" }}
              >
                📊
              </div>
              <p style={{ color: "#94a3b8" }}>
                No polls yet. Let's create something awesome!
              </p>
            </div>
          ) : (
            <div
              className="polls-grid"
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {polls.map((poll) => (
                <div
                  key={poll._id}
                  className="poll-card"
                  style={{
                    background: "#1e293b",
                    borderRadius: "12px",
                    padding: "20px",
                    border: selectedPolls.includes(poll._id)
                      ? "1px solid #38bdf8"
                      : "1px solid #334155",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "border 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPolls.includes(poll._id)}
                      onChange={() => handleSelectPoll(poll._id)}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                        accentColor: "#38bdf8",
                      }}
                    />
                    <div>
                      <h3 style={{ margin: "0 0 5px 0", color: "#fff" }}>
                        {poll.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          fontSize: "14px",
                          color: "#94a3b8",
                        }}
                      >
                        <span>Questions: {poll.questions?.length || 0}</span>
                        <span>•</span>
                        <span style={{ color: "#22c55e" }}>Active</span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `http://localhost:5173/poll/${poll.slug}`,
                        );
                        alert("Voter link copied! 📋");
                      }}
                      style={{
                        background: "#0f172a",
                        color: "#94a3b8",
                        border: "1px solid #334155",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Copy Link
                    </button>

                    <button
                      onClick={() => navigate(`/dashboard/${poll._id}`)}
                      style={{
                        background: poll.accentColor || "#38bdf8",
                        color: "#000",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      View Analytics 📈
                    </button>

                    <button
                      onClick={() => handleDeletePoll(poll._id, poll.title)}
                      style={{
                        background: "transparent",
                        color: "#ef4444",
                        border: "1px solid #ef4444",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
