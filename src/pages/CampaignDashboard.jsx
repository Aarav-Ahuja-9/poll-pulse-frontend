import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';

const socket = io(import.meta.env.VITE_BACKEND_URL);

const CampaignDashboard = ({ onClose }) => {
    const { pollId } = useParams();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState([]);
    const [pollDetails, setPollDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalVotes, setTotalVotes] = useState(0);
    const [liveFeed, setLiveFeed] = useState([]);

    const getAuthConfig = () => {
        const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
        return userInfo?.token ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : null;
    };

    useEffect(() => {
        const config = getAuthConfig();
        if (!config) { navigate('/login'); return; }
        if (!pollId) { setLoading(false); return; }

        const fetchInitialData = async () => {
            try {
                const pollRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/polls/${pollId}`, config);
                setPollDetails(pollRes.data.poll);
                await fetchLiveResults(config);
            } catch (err) {
                console.error(err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
        socket.emit('join-poll', pollId);
    }, [pollId, navigate]);

    useEffect(() => {
        socket.on('update-analytics', () => {
            fetchLiveResults();
        });
        socket.on('new-voter-activity', (data) => {
            setLiveFeed((prevFeed) => [data, ...prevFeed.slice(0, 4)]);
        });
        return () => {
            socket.off('update-analytics');
            socket.off('new-voter-activity');
        };
    }, [pollId]);

    const fetchLiveResults = async (configOverride) => {
        if (!pollId) return;
        try {
            const config = configOverride || getAuthConfig();
            if (!config) return;

            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/polls/analytics/${pollId}`, config);
            setAnalytics(res.data);
            setTotalVotes(res.data.reduce((acc, curr) => acc + curr.count, 0));
        } catch (err) {
            console.error(err);
        }
    };


    const handleClearAllVotes = async () => {
        const confirmClear = window.confirm("Bhai, kya sach me is campaign ke SAARE votes delete karne hain? Ye step wapas nahi aayega! ⚠️");
        if (!confirmClear) return;

        try {
            const config = getAuthConfig();
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/polls/${pollId}/clear-all`, {}, config);
            alert(res.data.message);
            setLiveFeed([]);
            await fetchLiveResults(config);
        } catch (err) {
            console.error("Clear Error:", err);
            alert("Sare responses clear karne me koi error aayi!");
        }
    };


    const handleClearQuestionVotes = async (qIndex, qText) => {
        const confirmQClear = window.confirm(`Bhai, kya sach me sirf Question: "${qText}" ke saare votes clear karne hain? 🤔`);
        if (!confirmQClear) return;

        try {
            const config = getAuthConfig();
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/polls/${pollId}/clear-question`, { questionIndex: qIndex }, config);
            alert(res.data.message);
            await fetchLiveResults(config);
        } catch (err) {
            console.error("Question Clear Error:", err);
            alert("Is question ka data clear karne me dikkat aayi!");
        }
    };

    if (loading || !pollDetails) return null;

    return (
        <div style={{ background: '#0f172a', minHeight: '100vh', padding: '40px 20px', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', margin: 0, color: pollDetails?.accentColor || '#38bdf8' }}>{pollDetails?.title}</h1>
                        <p style={{ color: '#94a3b8', marginTop: '5px' }}>Campaign Management & Real-time Insights</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={handleClearAllVotes}
                            style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Clear All Votes 🧹
                        </button>
                        <button type="button" onClick={() => navigate('/dashboard')} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Exit Dashboard
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <StatCard title="Total Responses" value={totalVotes} icon="📊" color="#38bdf8" />
                    <StatCard title="Status" value="ACTIVE" icon="🟢" color="#22c55e" />
                    <StatCard title="Voter Privacy" value={pollDetails.collectVoterDetails ? "Named" : "Anonymous"} icon="🛡️" color="#fbbf24" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                    <div>
                        <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Live Performance</h2>
                        {pollDetails.questions?.map((q, qIndex) => {
                            const qTotal = analytics.filter(a => a._id.qIdx === qIndex).reduce((sum, item) => sum + item.count, 0);

                            return (
                                <div key={qIndex} style={{ background: '#1e293b', borderRadius: '20px', padding: '25px', border: '1px solid #334155', marginBottom: '25px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <h3 style={{ fontSize: '16px', margin: 0, paddingRight: '10px', lineHeight: '1.4' }}>{q.text}</h3>

                                        <button
                                            onClick={() => handleClearQuestionVotes(qIndex, q.text)}
                                            style={{ background: '#0f172a', color: '#94a3b8', border: '1px solid #334155', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            Reset Qs 🔄
                                        </button>
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: '13px', margin: '-10px 0 20px 0' }}>{qTotal} votes casted</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {q.options.map((opt, optIndex) => {
                                            const result = analytics.find(a => a._id.qIdx === qIndex && String(a._id.optIdx) === String(optIndex));
                                            const count = result ? result.count : 0;
                                            const pct = qTotal === 0 ? 0 : Math.round((count / qTotal) * 100);

                                            return (
                                                <div key={optIndex}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                                                        <span>{opt}</span>
                                                        <span style={{ fontWeight: 'bold', color: pollDetails?.accentColor || '#38bdf8' }}>{count} ({pct}%)</span>
                                                    </div>
                                                    <div style={{ height: '10px', background: '#0f172a', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${pct}%`, height: '100%', background: pollDetails?.accentColor || '#38bdf8', transition: 'width 1s ease' }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div>
                        <h2 style={{ fontSize: '22px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           Live Activity Feed <span style={{ fontSize: '12px', background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '10px', animation: 'pulse 1.5s infinite' }}>STREAMING</span>
                        </h2>
                        <div style={{ background: '#1e293b', borderRadius: '20px', padding: '25px', border: '1px solid #334155', minHeight: '300px' }}>
                            {liveFeed.length === 0 ? (
                                <div style={{ color: '#64748b', textAlign: 'center', paddingTop: '100px', fontSize: '14px' }}>
                                    Waiting for incoming votes... ⚡
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {liveFeed.map((activity, index) => (
                                        <div key={index} style={{ background: '#0f172a', padding: '14px', borderRadius: '12px', borderLeft: `4px solid ${pollDetails?.accentColor || '#38bdf8'}` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                                <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{activity.respondentId}</span>
                                                <span style={{ color: '#64748b' }}>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>Voted in the campaign! 🔥</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
            `}</style>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div style={{ background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
        <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: color }}>{value}</div>
    </div>
);

export default CampaignDashboard;