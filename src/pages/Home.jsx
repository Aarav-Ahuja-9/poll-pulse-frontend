import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../pages/Home/Hero';
import Features from '../pages/Home/Features';
import HowItWorks from '../pages/Home/HowItWorks';
import Community from '../pages/Home/Community';
import Footer from '../pages/Home/Footer';

const Home = () => {
    return (
        <div style={{ position: 'relative', overflowX: 'hidden' }}>
            <div style={{ 
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', 
                width: '100%', maxWidth: '1600px', height: '800px', 
                backgroundImage: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.1) 0%, transparent 60%)', 
                pointerEvents: 'none', zIndex: -1 
            }} />
            
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Community />
            <Footer />
        </div>
    );
};

export default Home;