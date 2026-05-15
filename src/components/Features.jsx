import React from 'react';

const Features = () => {
  const featureList = [
    { icon: '⚡', title: 'Real-time', desc: 'Watch votes update live as they happen.' },
    { icon: '🛡️', title: 'Private', desc: 'Secure and anonymous polling for everyone.' },
    { icon: '📊', title: 'Analytics', desc: 'Deep insights into your audience pulse.' }
  ];

  return (
    <section className="features-section">
      <div className="features-grid">
        {featureList.map((f, i) => (
          <div key={i} className="feature-card">
            <div className="f-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;