import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer style={{ 
            borderTop: '1px solid rgba(128, 128, 128, 0.15)', 
            padding: '80px 5% 40px 5%',
            background: 'rgba(128, 128, 128, 0.02)', // Bohot slight background shift
            position: 'relative',
            zIndex: 5
        }}>
            <div className="footer-grid" style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 1fr', 
                gap: '40px',
                marginBottom: '60px'
            }}>
                
                {/* Logo & Description */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fff', fontSize: '14px' }}>
                            S
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                            SnapPolls
                        </span>
                    </div>
                    <p style={{ opacity: 0.7, fontSize: '14px', lineHeight: '1.6', maxWidth: '280px' }}>
                        The fastest way to gather live audience feedback. Built with MERN stack and WebSockets for zero-latency interactions.
                    </p>
                </div>

                {/* Links Col 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Product</h4>
                    <span onClick={() => navigate('/create')} className="footer-link" style={{ fontSize: '14px', opacity: 0.7, cursor: 'pointer', transition: 'opacity 0.2s' }}>Create Poll</span>
                    <span onClick={() => navigate('/dashboard')} className="footer-link" style={{ fontSize: '14px', opacity: 0.7, cursor: 'pointer', transition: 'opacity 0.2s' }}>Dashboard</span>
                </div>

                {/* Links Col 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Resources</h4>
                    <span className="footer-link" style={{ fontSize: '14px', opacity: 0.7, cursor: 'pointer', transition: 'opacity 0.2s' }}>Documentation</span>
                    <span className="footer-link" style={{ fontSize: '14px', opacity: 0.7, cursor: 'pointer', transition: 'opacity 0.2s' }}>API Reference</span>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link" style={{ fontSize: '14px', opacity: 0.7, cursor: 'pointer', transition: 'opacity 0.2s', color: 'inherit', textDecoration: 'none' }}>GitHub Repo</a>
                </div>

                {/* Links Col 3 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Legal</h4>
                    <span className="footer-link" style={{ fontSize: '14px', opacity: 0.7, cursor: 'pointer', transition: 'opacity 0.2s' }}>Privacy Policy</span>
                    <span className="footer-link" style={{ fontSize: '14px', opacity: 0.7, cursor: 'pointer', transition: 'opacity 0.2s' }}>Terms of Service</span>
                </div>

            </div>

            {/* Copyright Bar */}
            <div style={{ 
                maxWidth: '1200px', margin: '0 auto', 
                borderTop: '1px solid rgba(128, 128, 128, 0.2)', 
                paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '16px'
            }}>
                <span style={{ fontSize: '13px', opacity: 0.6 }}>
                    © 2026 SnapPolls. All rights reserved.
                </span>
                
                {/* Mini System Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600', opacity: 0.8, background: 'rgba(128,128,128,0.1)', padding: '4px 12px', borderRadius: '100px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                    All systems operational
                </div>
            </div>

            <style>{`
                .footer-link:hover { opacity: 1 !important; color: #6366f1 !important; }
                
                @media (max-width: 768px) {
                    .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
                }
                @media (max-width: 480px) {
                    .footer-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </footer>
    );
};

export default Footer;