import React from 'react';

const Features = () => {
    return (
        <section style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '80px 5% 120px 5%',
            position: 'relative', 
            zIndex: 5 
        }}>
            
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <span style={{ 
                    fontSize: '13px', fontWeight: '800', color: '#6366f1', 
                    letterSpacing: '1px', textTransform: 'uppercase' 
                }}>
                    Why SnapPolls?
                </span>
                <h2 style={{ 
                    fontSize: '36px', fontWeight: '800', margin: '12px 0 0 0', 
                    letterSpacing: '-1px', color: 'inherit' 
                }}>
                    Everything you need for live audience interaction.
                </h2>
            </div>

            {/* Features Grid (Bento Box Style) */}
            <div className="features-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '30px' 
            }}>
                
                {/* Feature Card 1 */}
                <div className="feature-card" style={{ 
                    background: 'rgba(128, 128, 128, 0.05)', 
                    border: '1px solid rgba(128, 128, 128, 0.1)', 
                    borderRadius: '24px', 
                    padding: '40px 30px', 
                    transition: 'all 0.3s ease' 
                }}>
                    <div style={{ 
                        width: '48px', height: '48px', background: 'rgba(99, 102, 241, 0.1)', 
                        border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        color: '#6366f1', marginBottom: '24px' 
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0', color: 'inherit' }}>
                        Zero-Delay Updates
                    </h3>
                    {/* 🌟 FIX: Opacity increased to 0.85 and color inherit added */}
                    <p style={{ fontSize: '15px', color: 'inherit', opacity: 0.85, lineHeight: '1.6', margin: 0, fontWeight: '500' }}>
                        Powered by WebSockets. The moment someone clicks an option, your dashboard charts update instantly. No page refreshes ever.
                    </p>
                </div>

                {/* Feature Card 2 */}
                <div className="feature-card" style={{ 
                    background: 'rgba(128, 128, 128, 0.05)', 
                    border: '1px solid rgba(128, 128, 128, 0.1)', 
                    borderRadius: '24px', 
                    padding: '40px 30px', 
                    transition: 'all 0.3s ease' 
                }}>
                    <div style={{ 
                        width: '48px', height: '48px', background: 'rgba(168, 85, 247, 0.1)', 
                        border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '12px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        color: '#c084fc', marginBottom: '24px' 
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0', color: 'inherit' }}>
                        Secure Voting
                    </h3>
                    {/* 🌟 FIX: Opacity increased to 0.85 and color inherit added */}
                    <p style={{ fontSize: '15px', color: 'inherit', opacity: 0.85, lineHeight: '1.6', margin: 0, fontWeight: '500' }}>
                        We use secure tokens to make sure the voting is fair. Share your links publicly without worrying about spam bots.
                    </p>
                </div>

                {/* Feature Card 3 */}
                <div className="feature-card" style={{ 
                    background: 'rgba(128, 128, 128, 0.05)', 
                    border: '1px solid rgba(128, 128, 128, 0.1)', 
                    borderRadius: '24px', 
                    padding: '40px 30px', 
                    transition: 'all 0.3s ease' 
                }}>
                    <div style={{ 
                        width: '48px', height: '48px', background: 'rgba(52, 211, 153, 0.1)', 
                        border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '12px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        color: '#34d399', marginBottom: '24px' 
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0', color: 'inherit' }}>
                        Clean Analytics
                    </h3>
                    {/* 🌟 FIX: Opacity increased to 0.85 and color inherit added */}
                    <p style={{ fontSize: '15px', color: 'inherit', opacity: 0.85, lineHeight: '1.6', margin: 0, fontWeight: '500' }}>
                        Your data is processed rapidly using MongoDB pipelines and presented in beautiful, easy-to-read charts on your dashboard.
                    </p>
                </div>

            </div>

            <style>{`
                .feature-card:hover {
                    transform: translateY(-8px);
                    background: rgba(128, 128, 128, 0.08) !important;
                    border-color: rgba(99, 102, 241, 0.3) !important;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
                }
                
                @media (max-width: 900px) {
                    .features-grid { grid-template-columns: 1fr !important; gap: 24px; }
                }
            `}</style>
        </section>
    );
};

export default Features;