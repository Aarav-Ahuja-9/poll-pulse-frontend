import React from 'react';

const Hero = () => {
  return (
    <section className="home-hero">
      <div className="glow-1"></div>
      <div className="glow-2"></div>

      <div className="hero-content">
        <div className="badge animate-fade">New: Real-time Analytics 2.0</div>

        <h1 className="hero-h1">
          Capture the vibe <br />
          <span className="accent-text">in real-time.</span>
        </h1>

        <p className="hero-p">
          PulseBoard is the minimalist polling engine built for speed.
          Anonymous, secure, and purely digital.
        </p>

        <div className="hero-actions">
          <a href="/signup" className="btn-primary">Launch Project</a>
          <a href="/features" className="btn-secondary">Explore Features</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;