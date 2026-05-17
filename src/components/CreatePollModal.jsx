import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";

const CreatePollModal = ({ isOpen, onClose, refreshPolls }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    questions: [
      {
        questionType: "CHOICE",
        text: "",
        imageUrl: "",
        options: ["", ""],
        correctOptions: [],
        timeLimit: "",
        isMandatory: true,
      },
    ],
    pollSessionExpiry: "24",
    maxVotes: "",
    resultsVisibility: "after_vote",
    collectVoterDetails: false,
    isPasswordProtected: false,
    pollPassword: "",
    accentColor: "#6366f1", 
  });

  // 🌗 THEME SYNC
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalThemeShift = () => {
      const savedTheme = localStorage.getItem('theme');
      setIsDarkMode(savedTheme === 'dark');
    };

    handleGlobalThemeShift();
    window.addEventListener('themeChange', handleGlobalThemeShift);
    return () => window.removeEventListener('themeChange', handleGlobalThemeShift);
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addQuestion = () => {
    updateField("questions", [
      ...formData.questions,
      {
        questionType: "CHOICE",
        text: "",
        imageUrl: "",
        options: ["", ""],
        correctOptions: [],
        timeLimit: "",
        isMandatory: true,
      },
    ]);
  };

  const removeQuestion = (qIndex) => {
    if (formData.questions.length > 1) {
      updateField(
        "questions",
        formData.questions.filter((_, i) => i !== qIndex),
      );
    }
  };

  const handleQuestionDataChange = (qIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex][field] = value;

    if (field === "questionType" && value !== "CHOICE") {
      updatedQuestions[qIndex].options = [];
      updatedQuestions[qIndex].correctOptions = [];
    } else if (
      field === "questionType" &&
      value === "CHOICE" &&
      updatedQuestions[qIndex].options.length === 0
    ) {
      updatedQuestions[qIndex].options = ["", ""];
    }
    updateField("questions", updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    updateField("questions", updatedQuestions);
  };

  const handleAddOption = (qIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options.push("");
    updateField("questions", updatedQuestions);
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    const updatedQuestions = [...formData.questions];
    if (updatedQuestions[qIndex].options.length > 2) {
      updatedQuestions[qIndex].options = updatedQuestions[
        qIndex
      ].options.filter((_, i) => i !== optIndex);
      updatedQuestions[qIndex].correctOptions = updatedQuestions[
        qIndex
      ].correctOptions
        .filter((i) => i !== optIndex)
        .map((i) => (i > optIndex ? i - 1 : i));
      updateField("questions", updatedQuestions);
    }
  };

  const toggleCorrectOption = (qIndex, optIndex) => {
    const updatedQuestions = [...formData.questions];
    const currentCorrect = updatedQuestions[qIndex].correctOptions;
    updatedQuestions[qIndex].correctOptions = currentCorrect.includes(optIndex)
      ? currentCorrect.filter((i) => i !== optIndex)
      : [...currentCorrect, optIndex];
    updateField("questions", updatedQuestions);
  };

  const submitPoll = async () => {
    if (!formData.title.trim()) return alert("Campaign Title is required!");
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.text.trim()) return alert(`Question ${i + 1} text is missing!`);
      if (q.questionType === "CHOICE" && q.options.some((opt) => !opt.trim())) {
        return alert(`Question ${i + 1} has empty options!`);
      }
    }

    const payload = {
      ...formData,
      maxVotes: formData.maxVotes ? parseInt(formData.maxVotes) : null,
    };

    try {
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const token = userInfo?.token;
      if (!token) {
        return alert("Please log in before creating a campaign.");
      }
      await axios.post(apiUrl("/api/polls/create"), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Campaign Deployed Successfully! 🚀");
      onClose();
      refreshPolls();
    } catch (err) {
      alert(err.response?.data?.message || "Deployment Error!");
    }
  };

  // 💎 TRANSLUCENT VARIABLE SHIFTS
  const colorText = isDarkMode ? "#f8fafc" : "#0f172a";
  const colorSubText = isDarkMode ? "#94a3b8" : "#475569";
  const borderContainer = isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(15, 23, 42, 0.08)";
  
  const backgroundModalMain = isDarkMode ? "rgba(10, 11, 18, 0.82)" : "rgba(255, 255, 255, 0.88)";
  const backgroundInnerCards = isDarkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(15, 23, 42, 0.03)";
  const backgroundInputFields = isDarkMode ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 255, 255, 0.6)";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isDarkMode ? "rgba(2, 4, 10, 0.7)" : "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        // 🌟 FIXED LAYER COMPLEX: Forced absolute highest z-index rendering index bounds
        zIndex: 999999, 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: backgroundModalMain,
          width: "100%",
          maxWidth: "850px",
          height: "90vh",
          maxHeight: "900px",
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: borderContainer,
          boxShadow: isDarkMode ? "0 25px 60px -12px rgba(0, 0, 0, 0.6)" : "0 25px 60px -12px rgba(15, 23, 42, 0.15)",
          transition: "all 0.3s ease",
          position: "relative",
          zIndex: 1000000 // Sub-container protection layer
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "24px 32px",
            borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "transparent",
            flexShrink: 0,
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "monospace",
                background: "rgba(99, 102, 241, 0.12)",
                color: "#6366f1",
                padding: "4px 10px",
                borderRadius: "100px",
                fontWeight: "700",
              }}
            >
              ✨ NEW POLL
            </span>
            <h2
              style={{ margin: "10px 0 0 0", color: colorText, fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px" }}
            >
              Create New Poll
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: colorSubText,
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px",
            color: colorText,
          }}
        >
          {/* Title Box */}
          <div
            style={{
              marginBottom: "24px",
              background: backgroundInnerCards,
              padding: "24px",
              borderRadius: "16px",
              border: borderContainer,
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: colorText,
                  fontWeight: "700",
                  fontSize: "14px"
                }}
              >
                Poll Title
              </label>
              <input
                type="text"
                placeholder="e.g., The Ultimate Developer Survey"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: backgroundInputFields,
                  border: borderContainer,
                  color: colorText,
                  boxSizing: "border-box",
                  outline: "none",
                  fontSize: "15px",
                  transition: "all 0.2s"
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: colorSubText,
                  fontSize: "13px",
                  fontWeight: "500"
                }}
              >
                Description / Instructions (Optional)
              </label>
              <textarea
                placeholder="Briefly explain what this poll is about..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: backgroundInputFields,
                  border: borderContainer,
                  color: colorText,
                  boxSizing: "border-box",
                  minHeight: "80px",
                  resize: "vertical",
                  outline: "none",
                  fontSize: "14px",
                  transition: "all 0.2s"
                }}
              />
            </div>
          </div>

          {/* Questions Render Loop */}
          {formData.questions.map((q, qIndex) => (
            <div
              key={qIndex}
              style={{
                border: borderContainer,
                padding: "24px",
                borderRadius: "16px",
                marginBottom: "20px",
                backgroundColor: backgroundInnerCards,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  removeAttribute: "true",
                  marginBottom: "20px",
                  paddingBottom: "12px",
                  borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.06)",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <h3 style={{ margin: 0, color: colorText, fontSize: "16px", fontWeight: "700" }}>
                    Question {qIndex + 1}
                  </h3>
                  <select
                    value={q.questionType}
                    onChange={(e) =>
                      handleQuestionDataChange(
                        qIndex,
                        "questionType",
                        e.target.value,
                      )
                    }
                    style={{
                      padding: "6px 14px",
                      borderRadius: "100px",
                      background: backgroundInputFields,
                      color: "#6366f1",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      outline: "none"
                    }}
                  >
                    <option value="CHOICE">Multiple Choice</option>
                    <option value="TEXT">Short Text Answer</option>
                    <option value="RATING">Star Rating (1-5)</option>
                  </select>
                  <label
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      background: q.isMandatory
                        ? "rgba(34, 197, 94, 0.12)"
                        : "rgba(255, 255, 255, 0.05)",
                      color: q.isMandatory ? "#22c55e" : colorSubText,
                      padding: "4px 10px",
                      borderRadius: "6px",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!q.isMandatory}
                      onChange={(e) =>
                        handleQuestionDataChange(
                          qIndex,
                          "isMandatory",
                          e.target.checked,
                        )
                      }
                      style={{ cursor: "pointer", margin: 0, accentColor: "#22c55e" }}
                    />
                    {q.isMandatory ? "✓ REQUIRED" : "OPTIONAL"}
                  </label>
                </div>
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    style={{
                      color: "#ef4444",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "13px"
                    }}
                  >
                    Remove Question
                  </button>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ flex: "1 1 300px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginBottom: "6px",
                      color: colorSubText
                    }}
                  >
                    Question Text
                  </label>
                  <input
                    type="text"
                    placeholder="What do you want to ask?"
                    value={q.text}
                    onChange={(e) =>
                      handleQuestionDataChange(qIndex, "text", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: backgroundInputFields,
                      border: borderContainer,
                      color: colorText,
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                </div>

                <div
                  style={{
                    flex: "1 1 150px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginBottom: "6px",
                      color: colorSubText
                    }}
                  >
                    Question Image (Optional)
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "0 14px",
                      background: backgroundInputFields,
                      border: "1px dashed rgba(99,102,241,0.3)",
                      color: "#6366f1",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "13px",
                      height: "42px",
                      boxSizing: "border-box",
                      overflow: "hidden",
                      transition: "all 0.2s",
                    }}
                  >
                    {q.imageUrl ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <img
                          src={q.imageUrl}
                          alt="preview"
                          style={{
                            height: "24px",
                            width: "24px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <span style={{ color: colorText }}>Change Image</span>
                      </div>
                    ) : (
                      <>🖼 Upload Image</>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const localUrl = URL.createObjectURL(
                            e.target.files[0],
                          );
                          handleQuestionDataChange(
                            qIndex,
                            "imageUrl",
                            localUrl,
                          );
                        }
                      }}
                    />
                  </label>
                </div>

                <div style={{ flex: "0 1 120px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginBottom: "6px",
                      color: colorSubText
                    }}
                  >
                    Time Limit (Mins)
                  </label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={q.timeLimit}
                    onChange={(e) =>
                      handleQuestionDataChange(
                        qIndex,
                        "timeLimit",
                        e.target.value,
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: backgroundInputFields,
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      color: colorText,
                      boxSizing: "border-box",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Multiple Choices Template */}
              {q.questionType === "CHOICE" && (
                <div
                  style={{
                    marginTop: "16px",
                    background: isDarkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.4)",
                    padding: "16px",
                    borderRadius: "10px",
                    border: borderContainer
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontFamily: "monospace",
                      textTransform: "uppercase",
                      marginBottom: "12px",
                      color: colorSubText,
                    }}
                  >
                    Options (Tick the box next to the correct answer)
                  </label>
                  {q.options.map((opt, optIndex) => (
                    <div
                      key={optIndex}
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={q.correctOptions.includes(optIndex)}
                        onChange={() => toggleCorrectOption(qIndex, optIndex)}
                        style={{ width: "18px", cursor: "pointer", accentColor: "#6366f1" }}
                        title="Mark as Correct Answer"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${optIndex + 1}`}
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(qIndex, optIndex, e.target.value)
                        }
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          borderRadius: "8px",
                          background: backgroundInputFields,
                          border: borderContainer,
                          color: colorText,
                          fontSize: "14px",
                          outline: "none"
                        }}
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(qIndex, optIndex)}
                          style={{
                            padding: "0 14px",
                            background: "transparent",
                            color: "#ef4444",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "700"
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(qIndex)}
                    style={{
                      marginTop: "4px",
                      padding: "6px 14px",
                      background: "transparent",
                      color: "#6366f1",
                      border: "1px dashed rgba(99,102,241,0.4)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {/* Short Text Fallback */}
              {q.questionType === "TEXT" && (
                <div style={{ padding: "20px", background: backgroundInputFields, borderRadius: "8px", border: "1px dashed rgba(255,255,255,0.06)", color: colorSubText, textAlign: "center", fontSize: "13px" }}>
                  ✍️ Voters will get a text box to type their descriptive answer here.
                </div>
              )}

              {/* Star Ratings Fallback */}
              {q.questionType === "RATING" && (
                <div style={{ padding: "20px", background: backgroundInputFields, borderRadius: "8px", border: "1px dashed rgba(255,255,255,0.06)", color: "#fbbf24", textAlign: "center", fontSize: "22px", letterSpacing: "5px" }}>
                  ★ ★ ★ ★ ★ <span style={{ fontSize: "13px", color: colorSubText, letterSpacing: "normal", display: "block", marginTop: "4px" }}>(Voters will select a rating out of 5 stars)</span>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            style={{
              width: "100%",
              padding: "14px",
              border: "1px dashed rgba(99,102,241,0.4)",
              background: "transparent",
              color: "#6366f1",
              borderRadius: "12px",
              cursor: "pointer",
              marginBottom: "24px",
              fontWeight: "700",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
          >
            + Add Another Question
          </button>

          {/* Access Rules Controls Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "10px",
              background: backgroundInnerCards,
              padding: "24px",
              borderRadius: "16px",
              border: borderContainer,
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: colorSubText }}>Session Expiry</label>
              <select
                value={formData.pollSessionExpiry}
                onChange={(e) => updateField("pollSessionExpiry", e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: backgroundInputFields, color: colorText, border: borderContainer, outline: "none", cursor: "pointer" }}
              >
                <option value="1">1 Hour</option>
                <option value="24">24 Hours</option>
                <option value="168">7 Days</option>
                <option value="never">Never Expire</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: colorSubText }}>Voter Privacy</label>
              <select
                value={formData.collectVoterDetails ? "named" : "anonymous"}
                onChange={(e) => updateField("collectVoterDetails", e.target.value === "named")}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: backgroundInputFields, color: colorText, border: borderContainer, outline: "none", cursor: "pointer" }}
              >
                <option value="anonymous">🕵 Anonymous Voting</option>
                <option value="named">📝 Require Voter Name</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: colorSubText }}>Poll Access Type</label>
              <select
                value={formData.isPasswordProtected ? "password" : "open"}
                onChange={(e) => {
                  const isProtected = e.target.value === "password";
                  updateField("isPasswordProtected", isProtected);
                  if (!isProtected) updateField("pollPassword", "");
                }}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", background: backgroundInputFields, color: colorText, border: "1px solid rgba(99, 102, 241, 0.2)", outline: "none", cursor: "pointer" }}
              >
                <option value="open">🌐 Open Link (Public)</option>
                <option value="password">🔒 Password Protected</option>
              </select>
            </div>

            {formData.isPasswordProtected && (
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#6366f1" }}>Set Poll Password</label>
                <input
                  type="text"
                  placeholder="Enter access password..."
                  value={formData.pollPassword}
                  onChange={(e) => updateField("pollPassword", e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", background: backgroundInputFields, border: "1px dashed #6366f1", color: colorText, boxSizing: "border-box", outline: "none" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer Bar */}
        <div
          style={{
            padding: "20px 32px",
            borderTop: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.06)",
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "12px 24px",
              background: "transparent",
              color: colorSubText,
              border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(15, 23, 42, 0.15)",
              borderRadius: "100px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px"
            }}
          >
            Discard
          </button>
          <button
            type="button"
            onClick={submitPoll}
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              color: "#fff",
              border: "none",
              borderRadius: "100px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.2)",
            }}
          >
            Launch Poll 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePollModal;