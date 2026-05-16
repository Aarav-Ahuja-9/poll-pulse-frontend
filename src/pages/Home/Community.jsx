import React from 'react';

const Community = () => {
    return (
        <section style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '40px 5% 100px 5%',
            position: 'relative', 
            zIndex: 5 
        }}>
            <div style={{ 
                background: 'rgba(128, 128, 128, 0.03)', 
                border: '1px solid rgba(128, 128, 128, 0.1)', 
                borderRadius: '32px', 
                padding: '60px 40px',
                textAlign: 'center'
            }}>
                <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px', margin: '0 0 40px 0' }}>
                    Engineered for high performance.
                </h2>

                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                    
                   {/* Stat 1 */}
                    <div>
                        <div style={{ fontSize: '48px', fontWeight: '900', background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
                            Live
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>WebSocket Sync</h4>
                        <p style={{ fontSize: '14px', opacity: 0.7, margin: 0 }}>Ultra-low latency vote reflection.</p>
                    </div>

                    {/* Stat 2 */}
                    <div>
                        <div style={{ fontSize: '48px', fontWeight: '900', background: 'linear-gradient(135deg, #34d399, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
                            100%
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>Open Source</h4>
                        <p style={{ fontSize: '14px', opacity: 0.7, margin: 0 }}>Transparent and community-driven.</p>
                    </div>

                    {/* Stat 3 */}
                    <div>
                        <div style={{ fontSize: '48px', fontWeight: '900', background: 'linear-gradient(135deg, #f43f5e, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
                            ∞
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>Concurrent Users</h4>
                        <p style={{ fontSize: '14px', opacity: 0.7, margin: 0 }}>Scales effortlessly with Node.js.</p>
                    </div>

                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .stats-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
                }
            `}</style>
        </section>
    );
};

export default Community;