import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const VoterScreen = () => {
  const { slug } = useParams();
  const [poll, setPoll] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Core Responses States Matrix
  const [voterName, setVoterName] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({}); // Choice & Rating types
  const [textAnswers, setTextAnswers] = useState({}); // Descriptive strings

  // Cryptographic Access Protection Layers
  const [isLocked, setIsLocked] = useState(false);
  const [accessPassword, setAccessPassword] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // ⏱️ TOTAL SECONDS REMAINING STATE
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  // 🌗 PLATFORM THEME SWITCH SYNC
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/polls/slug/${slug}`);
        if (res.data.success) {
          setPoll(res.data.poll);
          setIsLocked(res.data.poll.isPasswordProtected || false);
          socket.emit("join-poll", res.data.poll._id);
          await fetchResults(res.data.poll._id);
        }
      } catch (err) {
        console.error("Error loading poll pipeline streams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();

    const handleGlobalThemeShift = () => {
      const savedTheme = localStorage.getItem('theme');
      setIsDarkMode(savedTheme === 'dark');
    };
    window.addEventListener('themeChange', handleGlobalThemeShift);
    return () => window.removeEventListener('themeChange', handleGlobalThemeShift);
  }, [slug]);

  // ⏱️ TIMER EFFECT INTERVALLER (MINUTES TO SECONDS MATRIX)
  useEffect(() => {
    if (!poll || hasVoted || isLocked) return;

    const currentQuestion = poll.questions[currentQuestionIndex];
    
    if (timerRef.current) clearInterval(timerRef.current);

    if (currentQuestion && currentQuestion.timeLimit && currentQuestion.timeLimit > 0) {
      setTimeLeft(currentQuestion.timeLimit * 60);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerExpiry();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(null); // Infinity Mode Trigger
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, poll, hasVoted, isLocked]);

  useEffect(() => {
    if (poll?._id) {
      socket.on("update-analytics", () => {
        console.log("⚡ Realtime Sync: Another node logged a response vector!");
        fetchResults(poll._id);
      });
    }
    return () => socket.off("update-analytics");
  }, [poll]);

  const fetchResults = async (pollId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/polls/public-analytics/${pollId}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching live metrics:", err);
    }
  };

  const handleTimerExpiry = () => {
    console.log("⏳ Time expired for question index:", currentQuestionIndex);
    const isLast = currentQuestionIndex === poll.questions.length - 1;
    if (isLast) {
      handleSubmitVote(true); // Force auto-submit stream sync
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleUnlockPoll = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/polls/verify-access/${slug}`, {
        password: accessPassword,
      });
      if (res.data.success) {
        setIsLocked(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Incorrect Access Token Key!");
    }
  };

  const handleOptionSelect = (qIndex, optIndex) => {
    // 🔒 Block inputs safely if time has ran out to 0
    if (hasVoted || timeLeft === 0) return;
    setSelectedOptions({ ...selectedOptions, [qIndex]: optIndex });
  };

  const handleSubmitVote = async (isForced = false) => {
    if (!isForced && poll.collectVoterDetails && !voterName.trim()) {
      alert("Bhai, identity verification field required hai! Apna name likho 📝");
      return;
    }

    const formattedAnswers = poll.questions.map((q, idx) => ({
      questionIndex: idx,
      selectedOption: q.questionType === "CHOICE" ? (selectedOptions[idx] !== undefined ? parseInt(selectedOptions[idx]) : null) : null,
      textResponse: q.questionType === "TEXT" ? textAnswers[idx] || "" : null,
      ratingValue: q.questionType === "RATING" ? (selectedOptions[idx] !== undefined ? parseInt(selectedOptions[idx]) : null) : null,
    }));

    if (!isForced) {
      for (let i = 0; i < poll.questions.length; i++) {
        const q = poll.questions[i];
        if (q.isMandatory) {
          if (q.questionType === "CHOICE" && selectedOptions[i] === undefined) return alert(`Question ${i + 1} select karna zaroori hai!`);
          if (q.questionType === "TEXT" && (!textAnswers[i] || !textAnswers[i].trim())) return alert(`Question ${i + 1} ka answer type karna zaroori hai!`);
          if (q.questionType === "RATING" && selectedOptions[i] === undefined) return alert(`Question ${i + 1} ko clear star rating dena zaroori hai!`);
        }
      }
    }

    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/polls/${poll._id}/respond`, {
        answers: formattedAnswers,
        userId: poll.collectVoterDetails && voterName.trim() ? voterName : "Anonymous Voter",
      });
      setHasVoted(true);
      await fetchResults(poll._id);
    } catch (err) {
      console.error("Submission Error:", err);
      if (!isForced) alert("Vote process pipeline execution failed!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    const q = poll.questions[currentQuestionIndex];
    if (q.isMandatory) {
      if (q.questionType === "CHOICE" && selectedOptions[currentQuestionIndex] === undefined) return alert("Pehle is option node ko select karo! 🤔");
      if (q.questionType === "TEXT" && (!textAnswers[currentQuestionIndex] || !textAnswers[currentQuestionIndex].trim())) return alert("Pehle answer field type karo! ✍️");
      if (q.questionType === "RATING" && selectedOptions[currentQuestionIndex] === undefined) return alert("Pehle star matrix value select karo! ★");
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const formatTime = (totalSeconds) => {
    if (totalSeconds === null) return "Infinity ♾️";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // 🎨 THEME STRUCTURE VARIABLES
  const colorMainText = isDarkMode ? "#f8fafc" : "#0f172a";
  const colorSubText = isDarkMode ? "#94a3b8" : "#475569";
  const backgroundWrapper = isDarkMode ? "#02040a" : "#f8fafc";
  
  const backgroundGlassCard = isDarkMode ? "rgba(10, 11, 18, 0.72)" : "rgba(255, 255, 255, 0.75)";
  const backgroundInnerNodes = isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(15, 23, 42, 0.03)";
  const backgroundInputFields = isDarkMode ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 255, 255, 0.7)";
  const borderCardTheme = isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.09)";

  if (loading) {
    return (
      <div style={{ background: backgroundWrapper, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: colorMainText }}>
        <h3 className="pulse-text" style={{ fontSize: "15px", fontFamily: "monospace" }}>SYNCHRONIZING SECURE FEED LOGS... ⚡</h3>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: backgroundWrapper, padding: "20px" }}>
        <div style={{ background: backgroundGlassCard, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: borderCardTheme, padding: "40px", borderRadius: "24px", maxWidth: "420px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>🔒</div>
          <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "8px", color: colorMainText }}>Encrypted Session Node</h2>
          <p style={{ fontSize: "14px", color: colorSubText, marginBottom: "24px" }}>Enter the correct layout security cipher token access key.</p>
          <form onSubmit={handleUnlockPoll} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="password"
              placeholder="Enter session security key..."
              value={accessPassword}
              onChange={(e) => setAccessPassword(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", background: backgroundInputFields, color: colorMainText, border: borderCardTheme, outline: "none", fontSize: "15px" }}
              required
            />
            <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", border: "none", padding: "14px", borderRadius: "100px", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              Decrypt & Connect
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentQuestion = poll.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === poll.questions.length - 1;
  const isTimeCritical = timeLeft !== null && timeLeft <= 15;

  // 🔒 CHECK IF TIME HAS FULLY RUN OUT TO ZERO
  const isTimeOver = timeLeft === 0;

  return (
    <div style={{ background: backgroundWrapper, minHeight: "100vh", padding: "100px 24px 80px 24px", color: colorMainText, fontFamily: "'Inter', sans-serif", transition: "all 0.3s ease", position: "relative" }}>
      
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "500px", height: "500px", background: isDarkMode ? "radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

      <div style={{ maxWidth: "620px", margin: "0 auto", position: "relative", zIndex: 5 }}>
        
        <header style={{ textAlign: "center", marginBottom: "44px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "6px 14px", borderRadius: "100px", fontSize: "11px", fontWeight: "700", marginBottom: "20px" }}>
            <span style={{ width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%", display: "inline-block", animation: "blink 1.5s infinite" }} />
            LIVE INSTANT BALANCED LOOP
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "-0.8px", color: colorMainText, margin: "0 0 12px 0" }}>
            {poll.title}
          </h1>
          {poll.description && <p style={{ color: colorSubText, fontSize: "15px", margin: 0, fontWeight: "500" }}>{poll.description}</p>}

          {!hasVoted && (
            <div style={{ marginTop: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: colorSubText, fontWeight: "700" }}>
                <span>Ballot Frame Mapping</span>
                <span>{currentQuestionIndex + 1} / {poll.questions.length}</span>
              </div>
              <div style={{ width: "100%", height: "4px", background: isDarkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.06)", borderRadius: "100px", marginTop: "8px", overflow: "hidden" }}>
                <div style={{ width: `${((currentQuestionIndex + 1) / poll.questions.length) * 100}%`, height: "100%", background: "linear-gradient(90deg, #6366f1, #a855f7)", transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }} />
              </div>
            </div>
          )}
        </header>

        {!hasVoted ? (
          <div style={{ background: backgroundGlassCard, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "24px", padding: "32px", border: borderCardTheme, boxShadow: isDarkMode ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 25px 50px -12px rgba(0, 0, 0, 0.02)", animation: "fadeIn 0.4s ease" }}>
            
            {/* Live Count Display */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: isTimeOver || isTimeCritical ? "rgba(239, 68, 68, 0.12)" : "rgba(99, 102, 241, 0.12)", border: isTimeOver || isTimeCritical ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(99, 102, 241, 0.2)", padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: "700", fontFamily: "monospace", color: isTimeOver || isTimeCritical ? "#ef4444" : "#6366f1", transition: "all 0.3s ease" }}>
                <span>⏱️ {isTimeOver ? "Time's Up:" : "Time Remaining:"}</span>
                <span style={{ fontSize: "14px", letterSpacing: "0.5px" }}>
                  {isTimeOver ? "00:00" : formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {poll.collectVoterDetails && currentQuestionIndex === 0 && (
              <div style={{ background: backgroundInnerNodes, padding: "20px", borderRadius: "14px", border: "1px dashed #6366f1", marginBottom: "24px", opacity: isTimeOver ? 0.5 : 1 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", marginBottom: "8px", color: "#6366f1", letterSpacing: "0.5px" }}>Voter Full Name Required</label>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  disabled={isTimeOver}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", background: backgroundInputFields, color: colorMainText, border: borderCardTheme, outline: "none", fontSize: "14px", cursor: isTimeOver ? "not-allowed" : "text" }}
                />
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px", opacity: isTimeOver ? 0.5 : 1 }}>
              <h3 style={{ fontSize: "19px", fontWeight: "800", color: colorMainText }}>
                {currentQuestionIndex + 1}. {currentQuestion.text}
                {currentQuestion.isMandatory && <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>}
              </h3>
            </div>

            {currentQuestion.imageUrl && (
              <div style={{ width: "100%", height: "200px", borderRadius: "12px", overflow: "hidden", marginBottom: "20px", border: borderCardTheme, opacity: isTimeOver ? 0.5 : 1 }}>
                <img src={currentQuestion.imageUrl} alt="Reference Matrix" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {/* CHOICE COMPONENT */}
            {currentQuestion.questionType === "CHOICE" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", opacity: isTimeOver ? 0.5 : 1 }}>
                {currentQuestion.options.map((opt, optIndex) => {
                  const result = analytics.find((a) => a._id.qIdx === currentQuestionIndex && String(a._id.optIdx) === String(optIndex));
                  const count = result ? result.count : 0;
                  const qTotal = analytics.filter((a) => a._id.qIdx === currentQuestionIndex).reduce((sum, item) => sum + item.count, 0);
                  const pct = qTotal === 0 ? 0 : Math.round((count / qTotal) * 100);
                  const isSelected = selectedOptions[currentQuestionIndex] === optIndex;

                  return (
                    <div
                      key={optIndex}
                      onClick={() => handleOptionSelect(currentQuestionIndex, optIndex)}
                      style={{ position: "relative", padding: "16px 20px", borderRadius: "14px", background: backgroundInnerNodes, border: isSelected ? "1px solid #6366f1" : borderCardTheme, cursor: isTimeOver ? "not-allowed" : "pointer", overflow: "hidden", transition: "all 0.2s ease" }}
                      className="option-node-element"
                    >
                      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)", opacity: isSelected ? 0.12 : 0.04, transition: "width 0.8s ease" }} />
                      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: isSelected ? "1px solid #6366f1" : (isDarkMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(15,23,42,0.2)"), background: isSelected ? "#6366f1" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {isSelected && <div style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "50%" }} />}
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: isSelected ? "700" : "500", color: isSelected ? colorMainText : (isDarkMode ? "#cbd5e1" : "#334155") }}>{opt}</span>
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: isSelected ? "#6366f1" : colorSubText, fontFamily: "monospace" }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TEXT COMPONENT */}
            {currentQuestion.questionType === "TEXT" && (
              <textarea
                placeholder={isTimeOver ? "Time's up. Input locked." : "Type your answer here..."}
                rows={4}
                value={textAnswers[currentQuestionIndex] || ""}
                onChange={(e) => setTextAnswers({ ...textAnswers, [currentQuestionIndex]: e.target.value })}
                disabled={isTimeOver}
                style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", background: backgroundInputFields, color: colorMainText, border: borderCardTheme, outline: "none", fontSize: "14px", resize: "vertical", cursor: isTimeOver ? "not-allowed" : "text", opacity: isTimeOver ? 0.5 : 1 }}
              />
            )}

            {/* RATING COMPONENT */}
            {currentQuestion.questionType === "RATING" && (
              <div style={{ display: "flex", gap: "14px", justifyContent: "center", padding: "16px 0", opacity: isTimeOver ? 0.5 : 1 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleOptionSelect(currentQuestionIndex, star)}
                    style={{ fontSize: "32px", cursor: isTimeOver ? "not-allowed" : "pointer", color: selectedOptions[currentQuestionIndex] >= star ? "#fbbf24" : (isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)") }}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}

            {/* Navigation and Finalizing Controllers */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", gap: "12px" }}>
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0 || isTimeOver}
                style={{ background: "transparent", color: colorSubText, border: borderCardTheme, padding: "12px 28px", borderRadius: "100px", fontWeight: "700", fontSize: "14px", cursor: currentQuestionIndex === 0 || isTimeOver ? "not-allowed" : "pointer", opacity: currentQuestionIndex === 0 || isTimeOver ? 0.3 : 1 }}
              >
                Back
              </button>

              {!isLastQuestion ? (
                <button
                  onClick={handleNext}
                  disabled={isTimeOver}
                  style={{ background: colorMainText, color: backgroundWrapper, border: "none", padding: "12px 32px", borderRadius: "100px", fontWeight: "700", fontSize: "14px", cursor: isTimeOver ? "not-allowed" : "pointer", opacity: isTimeOver ? 0.5 : 1 }}
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={() => handleSubmitVote(false)}
                  disabled={submitting || isTimeOver}
                  style={{ background: isTimeOver ? "rgba(239, 68, 68, 0.2)" : "linear-gradient(135deg, #6366f1, #a855f7)", color: isTimeOver ? "#ef4444" : "#fff", border: isTimeOver ? "1px solid #ef4444" : "none", padding: "12px 32px", borderRadius: "100px", fontWeight: "700", fontSize: "14px", cursor: submitting || isTimeOver ? "not-allowed" : "pointer", boxShadow: isTimeOver ? "none" : "0 4px 15px rgba(99, 102, 241, 0.25)" }}
                >
                  {submitting ? "Processing..." : (isTimeOver ? "Locked 🔒" : "Lock In My Vote ⚡")}
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Live Post-Vote Metrics Views */
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "fadeIn 0.5s ease" }}>
            {poll.questions.map((q, qIndex) => {
              const qTotal = analytics.filter((a) => a._id.qIdx === qIndex).reduce((sum, item) => sum + item.count, 0);
              return (
                <div key={qIndex} style={{ background: backgroundGlassCard, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "20px", padding: "24px 28px", border: borderCardTheme }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", color: colorMainText, margin: 0 }}>
                      {qIndex + 1}. {q.text}
                    </h3>
                    <span style={{ color: colorSubText, fontSize: "12px", fontWeight: "600", fontFamily: "monospace" }}>
                      {qTotal} total responses
                    </span>
                  </div>

                  {q.questionType === "CHOICE" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {q.options.map((opt, optIndex) => {
                        const result = analytics.find((a) => a._id.qIdx === qIndex && String(a._id.optIdx) === String(optIndex));
                        const count = result ? result.count : 0;
                        const pct = qTotal === 0 ? 0 : Math.round((count / qTotal) * 100);
                        const isSelected = selectedOptions[qIndex] === optIndex;

                        return (
                          <div key={optIndex} style={{ position: "relative", padding: "14px 20px", borderRadius: "12px", background: backgroundInnerNodes, border: borderCardTheme, overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)", opacity: isSelected ? 0.16 : 0.05, transition: "width 1s ease" }} />
                            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2, fontSize: "14px" }}>
                              <span style={{ color: isSelected ? colorMainText : (isDarkMode ? "#cbd5e1" : "#475569"), fontWeight: isSelected ? "700" : "500" }}>
                                {opt} {isSelected && " ✨"}
                              </span>
                              <span style={{ fontWeight: "700", color: "#6366f1", fontFamily: "monospace" }}>{pct}% ({count})</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : q.questionType === "RATING" ? (
                    <div style={{ padding: "14px 20px", background: backgroundInnerNodes, borderRadius: "12px", border: borderCardTheme, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: colorSubText }}>Your Logged Rating Matrix:</span>
                      <span style={{ color: "#fbbf24", fontWeight: "800", fontSize: "16px" }}>{"★".repeat(selectedOptions[qIndex] || 0)}</span>
                    </div>
                  ) : (
                    <div style={{ padding: "14px 20px", background: backgroundInnerNodes, borderRadius: "12px", border: borderCardTheme, fontSize: "14px" }}>
                      <div style={{ color: colorSubText, fontSize: "11px", textTransform: "uppercase", marginBottom: "4px", fontWeight: "700" }}>Your Alphanumeric Response:</div>
                      <div style={{ color: colorMainText, fontWeight: "500" }}>"{textAnswers[qIndex] || "N/A"}"</div>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.15)", padding: "16px", borderRadius: "16px", textAlign: "center", color: "#22c55e", fontSize: "14px", fontWeight: "700" }}>
              ✔ Data streams compiled and logged into live socket channels successfully.
            </div>
          </div>
        )}
      </div>

      <style>{`
          @keyframes blink { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          .pulse-text { animation: blink 2s infinite; }
          .option-node-element:hover { border-color: rgba(99, 102, 241, 0.4) !important; }
      `}</style>
    </div>
  );
};

export default VoterScreen;