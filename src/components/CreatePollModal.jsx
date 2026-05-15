import React, { useState } from "react";
import axios from "axios";

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
    accentColor: "#38bdf8",
  });

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
      await axios.post("http://localhost:5001/api/polls/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Campaign Deployed Successfully! 🚀");
      onClose();
      refreshPolls();
    } catch (err) {
      alert(err.response?.data?.message || "Deployment Error!");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        zIndex: 99999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          maxWidth: "850px",
          height: "90vh",
          maxHeight: "900px",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#1e293b",
            flexShrink: 0,
          }}
        >
          <div>
            <span
              style={{
                fontSize: "12px",
                background: formData.accentColor,
                color: "#000",
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              ✨ CREATE CAMPAIGN
            </span>
            <h2
              style={{ margin: "10px 0 0 0", color: "#fff", fontSize: "24px" }}
            >
              Construct Pulse
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              fontSize: "28px",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            color: "#cbd5e1",
          }}
        >
          <div
            style={{
              marginBottom: "25px",
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #334155",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Campaign Title
              </label>
              <input
                type="text"
                placeholder="e.g., The Ultimate Developer Survey"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "#fff",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                Description / Instructions (Optional)
              </label>
              <textarea
                placeholder="Briefly explain what this campaign is about..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "#fff",
                  boxSizing: "border-box",
                  minHeight: "80px",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          {formData.questions.map((q, qIndex) => (
            <div
              key={qIndex}
              style={{
                border: "1px solid #334155",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                backgroundColor: "#1e293b",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #334155",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <h3 style={{ margin: 0, color: "#fff" }}>
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
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: "#0f172a",
                      color: formData.accentColor,
                      border: `1px solid ${formData.accentColor}`,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    <option value="CHOICE">Multiple Choice</option>
                    <option value="TEXT">Short Text Answer</option>
                    <option value="RATING">Star Rating (1-5)</option>
                  </select>
                  <label
                    style={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      background: q.isMandatory
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                      color: q.isMandatory ? "#22c55e" : "#64748b",
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
                      style={{ cursor: "pointer", margin: 0 }}
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
                      fontWeight: "bold",
                    }}
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                <div style={{ flex: "1 1 300px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      marginBottom: "5px",
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
                      padding: "10px",
                      borderRadius: "8px",
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "#fff",
                      boxSizing: "border-box",
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
                      marginBottom: "5px",
                    }}
                  >
                    Question Image
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "0 10px",
                      background: q.imageUrl ? "#0f172a" : "transparent",
                      border: `1px dashed ${formData.accentColor}`,
                      color: formData.accentColor,
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "12px",
                      height: "40px",
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
                        <span style={{ color: "#cbd5e1" }}>Change Image</span>
                      </div>
                    ) : (
                      <>🖼️ Upload File</>
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
                      marginBottom: "5px",
                    }}
                  >
                    Timer (Mins)
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
                      padding: "10px",
                      borderRadius: "8px",
                      background: "#0f172a",
                      border: `1px solid ${formData.accentColor}`,
                      color: "#fff",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {q.questionType === "CHOICE" && (
                <div
                  style={{
                    marginTop: "15px",
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      marginBottom: "10px",
                      color: "#94a3b8",
                    }}
                  >
                    Options (Tick checkbox to mark Correct Answer)
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
                        style={{ width: "20px", cursor: "pointer" }}
                        title="Mark as Correct"
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
                          padding: "10px",
                          borderRadius: "8px",
                          background: "#1e293b",
                          border: "1px solid #334155",
                          color: "#fff",
                        }}
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(qIndex, optIndex)}
                          style={{
                            padding: "0 15px",
                            background: "#334155",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(qIndex)}
                    style={{
                      marginTop: "5px",
                      padding: "8px 15px",
                      background: "transparent",
                      color: formData.accentColor,
                      border: `1px dashed ${formData.accentColor}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {q.questionType === "TEXT" && (
                <div
                  style={{
                    padding: "20px",
                    background: "#0f172a",
                    borderRadius: "8px",
                    border: "1px dashed #475569",
                    color: "#94a3b8",
                    textAlign: "center",
                  }}
                >
                  ✍️ Voters will get a text box to type their descriptive answer
                  here.
                </div>
              )}

              {q.questionType === "RATING" && (
                <div
                  style={{
                    padding: "20px",
                    background: "#0f172a",
                    borderRadius: "8px",
                    border: "1px dashed #475569",
                    color: "#fbbf24",
                    textAlign: "center",
                    fontSize: "24px",
                    letterSpacing: "5px",
                  }}
                >
                  ★ ★ ★ ★ ★{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#94a3b8",
                      letterSpacing: "normal",
                      display: "block",
                      marginTop: "5px",
                    }}
                  >
                    (Voters will select a rating out of 5)
                  </span>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            style={{
              width: "100%",
              padding: "15px",
              border: "2px dashed #475569",
              background: "transparent",
              color: "#fff",
              borderRadius: "12px",
              cursor: "pointer",
              marginBottom: "30px",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
          >
            + Add Another Question
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "20px",
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #334155",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "5px",
                  color: "#94a3b8",
                }}
              >
                Session Expiry
              </label>
              <select
                value={formData.pollSessionExpiry}
                onChange={(e) =>
                  updateField("pollSessionExpiry", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "1px solid #334155",
                }}
              >
                <option value="1">1 Hour</option>
                <option value="24">24 Hours</option>
                <option value="168">7 Days</option>
                <option value="never">Never Expire</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "5px",
                  color: "#94a3b8",
                }}
              >
                Voter Identity
              </label>
              <select
                value={formData.collectVoterDetails ? "named" : "anonymous"}
                onChange={(e) =>
                  updateField("collectVoterDetails", e.target.value === "named")
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#0f172a",
                  color: "#fff",
                  border: "1px solid #334155",
                  cursor: "pointer",
                }}
              >
                <option value="anonymous">🕵️ Anonymous Voting</option>
                <option value="named">📝 Require Voter Name</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "5px",
                  color: "#94a3b8",
                }}
              >
                Poll Access
              </label>
              <select
                value={formData.isPasswordProtected ? "password" : "open"}
                onChange={(e) => {
                  const isProtected = e.target.value === "password";
                  updateField("isPasswordProtected", isProtected);
                  if (!isProtected) updateField("pollPassword", "");
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#0f172a",
                  color: "#fff",
                  border: `1px solid ${formData.accentColor}`,
                  cursor: "pointer",
                }}
              >
                <option value="open">🌐 Open Link (Public)</option>
                <option value="password">🔒 Password Protected</option>
              </select>
            </div>

            {formData.isPasswordProtected && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    marginBottom: "5px",
                    color: formData.accentColor,
                  }}
                >
                  Set Access Password
                </label>
                <input
                  type="text"
                  placeholder="Enter secure password..."
                  value={formData.pollPassword}
                  onChange={(e) => updateField("pollPassword", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    background: "#0f172a",
                    border: `1px dashed ${formData.accentColor}`,
                    color: "#fff",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            padding: "20px",
            borderTop: "1px solid #334155",
            backgroundColor: "#1e293b",
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "12px 24px",
              background: "transparent",
              color: "#cbd5e1",
              border: "1px solid #475569",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Discard
          </button>
          <button
            type="button"
            onClick={submitPoll}
            style={{
              padding: "12px 30px",
              background: formData.accentColor,
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: `0 4px 14px 0 ${formData.accentColor}66`,
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
