import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

const VoterScreen = () => {
    const { slug } = useParams();
    const [poll, setPoll] = useState(null);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [submitting, setSubmitting] = useState(false);


    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const fetchPollData = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/polls/slug/${slug}`);
                if (res.data.success) {
                    setPoll(res.data.poll);
                    socket.emit('join-poll', res.data.poll._id);
                    await fetchResults(res.data.poll._id);
                }
            } catch (err) {
                console.error("Error loading poll:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPollData();
    }, [slug]);

    useEffect(() => {
        if (poll?._id) {
            socket.on('update-analytics', () => {
                console.log("⚡ Realtime Update: Another vote recorded!");
                fetchResults(poll._id);
            });
        }
        return () => socket.off('update-analytics');
    }, [poll]);

    const fetchResults = async (pollId) => {
        try {
            const res = await axios.get(`http://localhost:5001/api/polls/public-analytics/${pollId}`);
            setAnalytics(res.data);
        } catch (err) {
            console.error("Error fetching live results:", err);
        }
    };

    const handleOptionSelect = (qIndex, optIndex) => {
        if (hasVoted) return;
        setSelectedOptions({ ...selectedOptions, [qIndex]: optIndex });
    };

    const handleSubmitVote = async () => {
        if (Object.keys(selectedOptions).length !== poll.questions.length) {
            alert("Bhai, saare questions ka answer select karo pehle! 📋");
            return;
        }

        setSubmitting(true);
        const formattedAnswers = Object.keys(selectedOptions).map(qIdx => ({
            questionIndex: parseInt(qIdx),
            selectedOption: parseInt(selectedOptions[qIdx])
        }));

        try {
            await axios.post(`http://localhost:5001/api/polls/${poll._id}/respond`, {
                answers: formattedAnswers,
                userId: "Anonymous Voter"
            });
            setHasVoted(true);
            await fetchResults(poll._id);
        } catch (err) {
            console.error("Submission Error:", err);
            alert("Vote submit karne me koi error aayi!");
        } finally {
            setSubmitting(false);
        }
    };


    const handleNext = () => {
        if (selectedOptions[currentQuestionIndex] === undefined) {
            alert("Bhai, pehle is question ka answer select karo! 🤔");
            return;
        }
        setCurrentQuestionIndex((prev) => prev + 1);
    };

    const handlePrev = () => {
        setCurrentQuestionIndex((prev) => prev - 1);
    };

    if (loading) {
        return (
            <div style={{ background: '#0f172a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <h3 className="pulse-text">Connecting to Live Feed... ⚡</h3>
            </div>
        );
    }

    if (!poll) {
        return (
            <div style={{ background: '#0f172a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <h3>Campaign not found or link expired. ❌</h3>
            </div>
        );
    }


    const currentQuestion = poll.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === poll.questions.length - 1;

    return (
        <div style={{ background: '#0f172a', minHeight: '100vh', padding: '60px 20px', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: '650px', margin: '0 auto' }}>

                <header style={{ textAlign: 'center', marginBottom: '45px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>
                        <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'blink 1.5s infinite' }}></span> LIVE FEED ACTIVE
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', color: '#fff', margin: '0 0 12px 0' }}>{poll.title}</h1>
                    <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.5', margin: 0 }}>{poll.description || "See public stance and log your voice instantly below."}</p>

                    {!hasVoted && (
                        <div style={{ marginTop: '25px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
                            Question {currentQuestionIndex + 1} of {poll.questions.length}
                            <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '10px', marginTop: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${((currentQuestionIndex + 1) / poll.questions.length) * 100}%`, height: '100%', background: poll.accentColor || '#38bdf8', transition: 'width 0.3s ease' }} />
                            </div>
                        </div>
                    )}
                </header>

                {!hasVoted ? (
                    <div style={{ background: '#1e293b', borderRadius: '24px', padding: '32px', border: '1px solid #334155', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)', marginBottom: '30px', animation: 'fadeIn 0.4s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '19px', fontWeight: '600', margin: 0, color: '#f1f5f9' }}>{currentQuestion.text}</h3>
                            <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
                                {analytics.filter(a => a._id.qIdx === currentQuestionIndex).reduce((sum, item) => sum + item.count, 0)} total votes
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {currentQuestion.options.map((opt, optIndex) => {
                                const result = analytics.find(a => a._id.qIdx === currentQuestionIndex && String(a._id.optIdx) === String(optIndex));
                                const count = result ? result.count : 0;
                                const qTotal = analytics.filter(a => a._id.qIdx === currentQuestionIndex).reduce((sum, item) => sum + item.count, 0);
                                const pct = qTotal === 0 ? 0 : Math.round((count / qTotal) * 100);

                                const isSelected = selectedOptions[currentQuestionIndex] === optIndex;

                                return (
                                    <div
                                        key={optIndex}
                                        onClick={() => handleOptionSelect(currentQuestionIndex, optIndex)}
                                        style={{
                                            position: 'relative', padding: '18px 20px', borderRadius: '16px', background: '#0f172a', border: isSelected ? `2px solid ${poll.accentColor || '#38bdf8'}` : '1px solid #1e293b', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pct}%`, background: poll.accentColor || '#38bdf8', opacity: isSelected ? 0.15 : 0.07, transition: 'width 1s cubic-bezier(0.1, 0.8, 0.3, 1)' }} />

                                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: isSelected ? `5px solid ${poll.accentColor || '#38bdf8'}` : '2px solid #475569', background: isSelected ? '#fff' : 'transparent', transition: 'all 0.2s' }} />
                                                <span style={{ fontSize: '15px', fontWeight: isSelected ? '700' : '500', color: isSelected ? '#fff' : '#cbd5e1' }}>{opt}</span>
                                            </div>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: isSelected ? (poll.accentColor || '#38bdf8') : '#64748b' }}>
                                                {count} votes ({pct}%)
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '35px', gap: '15px' }}>
                            <button
                                onClick={handlePrev}
                                disabled={currentQuestionIndex === 0}
                                style={{ background: '#0f172a', color: '#94a3b8', border: '1px solid #334155', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentQuestionIndex === 0 ? 0.4 : 1, transition: 'all 0.2s' }}
                            >
                                ← Back
                            </button>

                            {!isLastQuestion ? (
                                <button
                                    onClick={handleNext}
                                    style={{ background: poll.accentColor || '#38bdf8', color: '#0f172a', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Next Question →
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitVote}
                                    disabled={submitting}
                                    style={{ background: '#22c55e', color: '#0f172a', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)' }}
                                >
                                    {submitting ? "Logging Pulse... ⏳" : "Lock In My Vote ⚡"}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (

                    <div>
                        {poll.questions.map((q, qIndex) => {
                            const qTotal = analytics.filter(a => a._id.qIdx === qIndex).reduce((sum, item) => sum + item.count, 0);
                            return (
                                <div key={qIndex} style={{ background: '#1e293b', borderRadius: '24px', padding: '32px', border: '1px solid #334155', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)', marginBottom: '25px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '25px' }}>
                                        <h3 style={{ fontSize: '19px', fontWeight: '600', margin: 0, color: '#f1f5f9' }}>{q.text}</h3>
                                        <span style={{ color: '#64748b', fontSize: '13px' }}>{qTotal} total votes</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        {q.options.map((opt, optIndex) => {
                                            const result = analytics.find(a => a._id.qIdx === qIndex && String(a._id.optIdx) === String(optIndex));
                                            const count = result ? result.count : 0;
                                            const pct = qTotal === 0 ? 0 : Math.round((count / qTotal) * 100);
                                            const isSelected = selectedOptions[qIndex] === optIndex;

                                            return (
                                                <div key={optIndex} style={{ position: 'relative', padding: '16px 20px', borderRadius: '14px', background: '#0f172a', border: isSelected ? `1px solid ${poll.accentColor || '#38bdf8'}` : '1px solid #1e293b', overflow: 'hidden' }}>
                                                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pct}%`, background: poll.accentColor || '#38bdf8', opacity: isSelected ? 0.2 : 0.08, transition: 'width 1s ease' }} />
                                                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2, fontSize: '15px' }}>
                                                        <span style={{ color: isSelected ? '#fff' : '#cbd5e1', fontWeight: isSelected ? '700' : '500' }}>
                                                            {opt} {isSelected && " (Your Choice) ✨"}
                                                        </span>
                                                        <span style={{ fontWeight: 'bold', color: poll.accentColor || '#38bdf8' }}>{count} votes ({pct}%)</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '20px', borderRadius: '16px', textAlign: 'center', color: '#22c55e', fontWeight: '600', animation: 'fadeIn 0.5s ease' }}>
                            ✔ Success! All choices have been integrated into the live stream metrics.
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes blink { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .pulse-text { animation: blink 2s infinite; font-weight: 600; font-size: 18px; }
            `}</style>
        </div>
    );
};

export default VoterScreen;