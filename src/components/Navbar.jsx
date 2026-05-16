import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // 🌟 THEME FIX: Load hote hi body ko perfectly sync kar dega
    useEffect(() => {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        if (isDarkMode) {
            document.body.style.backgroundColor = '#02040a'; // Asli Dark
            document.body.style.color = '#f8fafc';
        } else {
            document.body.style.backgroundColor = '#f8fafc'; // Asli Light
            document.body.style.color = '#0f172a';
        }
    }, [isDarkMode]);

    // Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 🧠 SMART ROUTING LOGIC
    const handleDashboardClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    // 🌗 THEME TOGGLE LOGIC
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <header style={{
            position: 'fixed',
            top: isScrolled ? '16px' : '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: isScrolled ? '75%' : '85%',
            maxWidth: '1000px',
            backgroundColor: isScrolled 
                ? (isDarkMode ? 'rgba(10, 15, 30, 0.65)' : 'rgba(255, 255, 255, 0.7)') 
                : (isDarkMode ? 'rgba(10, 15, 30, 0.1)' : 'rgba(255, 255, 255, 0.2)'),
            backdropFilter: isScrolled ? 'blur(24px) saturate(200%)' : 'blur(12px) saturate(100%)',
            WebkitBackdropFilter: isScrolled ? 'blur(24px) saturate(200%)' : 'blur(12px) saturate(100%)',
            borderRadius: '100px',
            border: isScrolled 
                ? (isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.05)') 
                : (isDarkMode ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(0, 0, 0, 0.02)'),
            borderTop: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.8)',
            zIndex: 100,
            boxShadow: isScrolled 
                ? (isDarkMode ? '0 20px 40px -10px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.2)' : '0 15px 35px -10px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 1)') 
                : 'none',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: isScrolled ? '10px 24px' : '16px 32px',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* 🎯 LOGO */}
                <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} 
                    onClick={() => navigate('/')}
                    className="logo-group"
                >
                    <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
                        borderRadius: '10px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: '900', 
                        color: '#fff', 
                        fontSize: '15px', 
                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 12px rgba(99, 102, 241, 0.4)',
                        transition: 'transform 0.3s ease'
                    }} className="logo-icon">
                        S
                    </div>
                    <span style={{ fontSize: '19px', fontWeight: '800', letterSpacing: '-0.5px', color: isDarkMode ? '#fff' : '#0f172a', transition: 'color 0.3s ease' }}>
                        Snap<span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Polls</span>
                    </span>
                </div>

                {/* 🌐 NAV LINKS & CONTROLS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span onClick={() => navigate('/')} style={{ color: isDarkMode ? '#94a3b8' : '#475569', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} className={`nav-link-item ${!isDarkMode ? 'light' : ''}`}>
                        Home
                    </span>
                    
                    <span onClick={handleDashboardClick} style={{ color: isDarkMode ? '#94a3b8' : '#475569', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} className={`nav-link-item ${!isDarkMode ? 'light' : ''}`}>
                        My Dashboard
                    </span>

                    <button onClick={() => navigate('/register')} style={{ position: 'relative', background: isDarkMode ? '#ffffff' : '#0f172a', color: isDarkMode ? '#02040a' : '#ffffff', border: 'none', padding: '10px 22px', borderRadius: '100px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} className={`nav-btn-aura ${!isDarkMode ? 'light' : ''}`}>
                        Create Poll →
                    </button>

                    {/* 🌗 THEME TOGGLE BUTTON */}
                    <button 
                        onClick={toggleTheme} 
                        style={{
                            background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: isDarkMode ? '#fff' : '#0f172a',
                            transition: 'all 0.3s ease',
                            marginLeft: '8px' 
                        }}
                        className="theme-toggle-btn"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                .nav-link-item:hover { color: #ffffff !important; text-shadow: 0 0 12px rgba(255,255,255,0.4); }
                .nav-link-item.light:hover { color: #0f172a !important; text-shadow: none; }
                
                .logo-group:hover .logo-icon { transform: rotate(-10deg) scale(1.05); }
                
                .theme-toggle-btn:hover { transform: scale(1.1) rotate(15deg); background: rgba(99, 102, 241, 0.1) !important; color: #6366f1 !important; border-color: rgba(99, 102, 241, 0.3) !important; }
                
                .nav-btn-aura { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                .nav-btn-aura:hover { transform: translateY(-2px) scale(1.02); background: #f8fafc !important; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.1) !important; }
                
                .nav-btn-aura.light:hover { background: #1e293b !important; box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2), 0 0 0 4px rgba(0, 0, 0, 0.05) !important; }
            `}</style>
        </header>
    );
};

export default Navbar;