import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // THEME FIX: Sync body perfectly on load
    useEffect(() => {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        if (isDarkMode) {
            document.body.style.backgroundColor = '#02040a';
            document.body.style.color = '#f8fafc';
        } else {
            document.body.style.backgroundColor = '#f8fafc';
            document.body.style.color = '#0f172a';
        }
    }, [isDarkMode]);

    // Scroll Physics
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

    const handleDashboardClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

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
            // 💎 OPTIMIZED TRANSPARENCY: Fluid pass-through look
            backgroundColor: isScrolled 
                ? (isDarkMode ? 'rgba(10, 15, 30, 0.12)' : 'rgba(255, 255, 255, 0.2)') 
                : (isDarkMode ? 'rgba(10, 15, 30, 0.02)' : 'rgba(255, 255, 255, 0.04)'),
            // 🌟 PURE BLUR ONLY: No saturate filter to avoid fake glow creation
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '100px',
            // 🎨 CRISP BORDER ALWAYS VISIBLE
            border: isDarkMode 
                ? '1px solid rgba(255, 255, 255, 0.15)' 
                : '1px solid rgba(15, 23, 42, 0.1)',
            zIndex: 100,
            // 🚫 ABSOLUTELY NO SHADOWS OR GLOWS
            boxShadow: 'none',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: isScrolled ? '10px 24px' : '14px 32px',
                transition: 'all 0.3s ease'
            }}>
                {/* 🎯 LOGO */}
                <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} 
                    onClick={() => navigate('/')}
                >
                    <div style={{ 
                        width: '30px', 
                        height: '30px', 
                        background: '#6366f1', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: '900', 
                        color: '#fff', 
                        fontSize: '13px'
                    }}>
                        S
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px', color: isDarkMode ? '#fff' : '#0f172a' }}>
                        SnapPolls
                    </span>
                </div>

                {/* 🌐 NAV LINKS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span onClick={() => navigate('/')} className={`nav-link-item ${!isDarkMode ? 'light' : ''}`}>
                        Home
                    </span>
                    
                    <span onClick={handleDashboardClick} className={`nav-link-item ${!isDarkMode ? 'light' : ''}`}>
                        My Dashboard
                    </span>

                    {/* 🛠️ FLAT SOLID BUTTON */}
                    <button 
                        onClick={() => navigate('/login')} 
                        style={{ 
                            background: isDarkMode ? '#f8fafc' : '#0f172a', 
                            color: isDarkMode ? '#0f172a' : '#f8fafc', 
                            border: 'none', 
                            padding: '10px 20px', 
                            borderRadius: '100px', 
                            fontSize: '14px', 
                            fontWeight: '700', 
                            cursor: 'pointer',
                            boxShadow: 'none',
                            transition: 'opacity 0.2s ease'
                        }} 
                    >
                        Create Poll →
                    </button>

                    {/* 🌗 THEME TOGGLE */}
                    <button 
                        onClick={toggleTheme} 
                        style={{
                            background: 'transparent',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            color: isDarkMode ? '#94a3b8' : '#475569',
                            transition: 'color 0.2s ease',
                            marginLeft: '4px'
                        }}
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
                .nav-link-item { color: #94a3b8; font-size: 14px; font-weight: 600; cursor: pointer; transition: color 0.2s ease; text-shadow: none !important; }
                .nav-link-item:hover { color: #ffffff !important; }
                
                .nav-link-item.light { color: #475569; }
                .nav-link-item.light:hover { color: #0f172a !important; }
                
                .nav-btn-clean:hover { opacity: 0.9; }
            `}</style>
        </header>
    );
};

export default Navbar;