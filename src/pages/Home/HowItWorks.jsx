import React from 'react';

const HowItWorks = () => {
    return (
        <section style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '80px 5%',
            position: 'relative', 
            zIndex: 5 
        }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <span style={{ 
                    fontSize: '13px', fontWeight: '800', color: '#c084fc', 
                    letterSpacing: '1px', textTransform: 'uppercase' 
                }}>
                    Simple Process
                </span>
                
                {/* 🌟 HIGHLIGHTED HEADING */}
                <h2 style={{ 
                    fontSize: '36px', fontWeight: '800', margin: '12px 0 0 0', 
                    letterSpacing: '-1px', color: 'inherit' 
                }}>
                    From <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>zero</span> to <span style={{ background: 'linear-gradient(135deg, #34d399 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>live</span> in 60 seconds.
                </h2>
            </div>

            <div className="steps-container" style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', position: 'relative' 
            }}>
                {/* Connecting Line (Desktop Only) */}
                <div className="connecting-line" style={{ 
                    position: 'absolute', top: '24px', left: '15%', right: '15%', 
                    height: '2px', background: 'linear-gradient(90deg, transparent, rgba(128,128,128,0.2), transparent)', 
                    zIndex: -1 
                }}></div>

                {/* Step 1 */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '50px', height: '50px', background: '#0f172a', color: '#fff', 
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '20px', fontWeight: '900', margin: '0 auto 20px auto',
                        boxShadow: '0 0 0 4px rgba(128,128,128,0.1), 0 10px 20px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>1</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>Create Poll</h3>
                    <p style={{ opacity: 0.8, fontSize: '15px', lineHeight: '1.6' }}>Write your question and add the options. No complex settings, just type and save.</p>
                </div>

                {/* Step 2 */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '50px', height: '50px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', 
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '20px', fontWeight: '900', margin: '0 auto 20px auto',
                        boxShadow: '0 0 0 4px rgba(99,102,241,0.2), 0 10px 25px rgba(99,102,241,0.4)',
                    }}>2</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>Share Link</h3>
                    <p style={{ opacity: 0.8, fontSize: '15px', lineHeight: '1.6' }}>Copy your unique, secure poll link and drop it in your WhatsApp, Discord, or live stream.</p>
                </div>

                {/* Step 3 */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '50px', height: '50px', background: '#0f172a', color: '#fff', 
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '20px', fontWeight: '900', margin: '0 auto 20px auto',
                        boxShadow: '0 0 0 4px rgba(128,128,128,0.1), 0 10px 20px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>3</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>Watch Live</h3>
                    <p style={{ opacity: 0.8, fontSize: '15px', lineHeight: '1.6' }}>Sit back and watch the charts update instantly as people cast their votes in real-time.</p>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .steps-container { grid-template-columns: 1fr !important; gap: 50px !important; }
                    .connecting-line { display: none !important; }
                }
            `}</style>
        </section>
    );
};

export default HowItWorks;