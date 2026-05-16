import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="hero-container" style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '160px 5% 100px 5%',
            display: 'grid', 
            gridTemplateColumns: '1.2fr 0.8fr', 
            gap: '60px', 
            alignItems: 'center', 
            position: 'relative', 
            zIndex: 5 
        }}>
            
            {/* ⬅️ LEFT SIDE: Simple Text & Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                
                {/* Tech Badge */}
                <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '8px', 
                    background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', 
                    padding: '6px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: '700', 
                    color: '#6366f1', marginBottom: '28px' 
                }}>
                    <span className="live-dot" style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', display: 'inline-block' }}></span>
                    POWERED BY WEBSOCKETS
                </div>

                {/* Main Headline - WITH NEW FONT FOR "instantly" */}
                <h1 style={{ 
                    fontSize: '64px', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1.05', 
                    margin: '0 0 24px 0', color: 'inherit' 
                }}>
                    Create live polls.<br />
                    See results <span style={{ 
                        background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        fontFamily: '"Playfair Display", "Georgia", serif', /* 🌟 NAYA FONT YAHAN HAI */
                        fontStyle: 'italic', /* Thoda tircha premium look */
                        fontWeight: '700',
                        paddingRight: '8px' /* Gradient cut na ho end mein */
                    }}>instantly.</span>
                </h1>

                {/* Clear Subtext - Professional English */}
                <p style={{ 
                    fontSize: '18px', opacity: 0.8, lineHeight: '1.6', 
                    maxWidth: '540px', margin: '0 0 40px 0', fontWeight: '500' 
                }}>
                    Share the link with your audience and watch the votes roll in. 
                    Charts update in real-time without refreshing the page. Fast, secure, and incredibly easy to use.
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="btn-primary-hero"
                        style={{ 
                            background: '#4f46e5', color: '#fff', border: 'none', 
                            padding: '16px 36px', borderRadius: '14px', fontSize: '15px', fontWeight: '700', 
                            cursor: 'pointer', transition: 'all 0.3s ease' 
                        }}
                    >
                        Create Your First Poll 🚀
                    </button>
                    
                    <button 
                        onClick={() => {
                            const token = localStorage.getItem('token');
                            navigate(token ? '/dashboard' : '/login');
                        }} 
                        className="btn-secondary-hero"
                        style={{ 
                            background: 'transparent', color: 'inherit', border: '1px solid rgba(128, 128, 128, 0.3)', 
                            padding: '16px 32px', borderRadius: '14px', fontSize: '15px', fontWeight: '600', 
                            cursor: 'pointer', transition: 'all 0.3s ease' 
                        }}
                    >
                        View Dashboard
                    </button>
                </div>
            </div>

            {/* ➡️ RIGHT SIDE: Floating Glass Card Mockup */}
            <div className="hero-visual" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                
                <div style={{ position: 'absolute', inset: '10px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', filter: 'blur(50px)', opacity: 0.2, borderRadius: '30px', pointerEvents: 'none' }} />
                
                <div style={{ 
                    width: '100%', maxWidth: '420px', 
                    background: 'rgba(128, 128, 128, 0.05)', 
                    border: '1px solid rgba(128, 128, 128, 0.2)', borderRadius: '24px', padding: '30px',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.1)', position: 'relative', zIndex: 2
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>LIVE POLL</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', opacity: 0.6 }}>
                            <span className="live-dot" style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                            142 Votes
                        </span>
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 24px 0', lineHeight: '1.4' }}>
                        What is your favorite tech stack?
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ position: 'relative', padding: '16px', background: 'rgba(128, 128, 128, 0.05)', border: '1px solid rgba(128, 128, 128, 0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                            <div className="progress-bar-fill" style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '74%', background: 'rgba(99, 102, 241, 0.15)' }} />
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: '14px', zIndex: 2, fontWeight: '600' }}>
                                <span>MERN Stack ✔</span>
                                <span style={{ color: '#818cf8' }}>74%</span>
                            </div>
                        </div>

                        <div style={{ position: 'relative', padding: '16px', background: 'rgba(128, 128, 128, 0.05)', border: '1px solid rgba(128, 128, 128, 0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                            <div className="progress-bar-fill" style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '18%', background: 'rgba(168, 85, 247, 0.15)' }} />
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: '14px', zIndex: 2, fontWeight: '600' }}>
                                <span>Next.js</span>
                                <span style={{ color: '#c084fc' }}>18%</span>
                            </div>
                        </div>

                        <div style={{ position: 'relative', padding: '16px', background: 'rgba(128, 128, 128, 0.05)', border: '1px solid rgba(128, 128, 128, 0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                            <div className="progress-bar-fill" style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '8%', background: 'rgba(128, 128, 128, 0.15)' }} />
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: '14px', zIndex: 2, fontWeight: '600' }}>
                                <span>Vue / Nuxt</span>
                                <span style={{ opacity: 0.7 }}>8%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes floatCard {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes blink {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; box-shadow: 0 0 10px currentColor; }
                    100% { opacity: 0.3; }
                }
                .hero-visual { animation: floatCard 6s ease-in-out infinite; }
                .live-dot { animation: blink 2s infinite; }
                
                .btn-primary-hero:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 14px 30px rgba(79, 70, 229, 0.4) !important; 
                    background: #4338ca !important;
                }
                .btn-secondary-hero:hover { 
                    background: rgba(128, 128, 128, 0.1) !important; 
                    transform: translateY(-2px); 
                }

                @media (max-width: 900px) {
                    .hero-container { grid-template-columns: 1fr !important; text-align: center; gap: 40px !important; }
                    .hero-container > div { alignItems: center !important; }
                    .hero-container h1 { fontSize: '42px' !important; }
                    .hero-visual { order: -1; margin-top: 20px; }
                    .btn-primary-hero, .btn-secondary-hero { width: 100%; justify-content: center; display: flex; }
                }
            `}</style>
        </section>
    );
};

export default Hero;