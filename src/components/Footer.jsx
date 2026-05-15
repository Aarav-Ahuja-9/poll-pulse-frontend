import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          P<span>B</span>
        </div>
        <p className="footer-text">Built with speed for the next generation of creators.</p>
        <div className="footer-links">
          <a href="https://github.com/aaravahuja" target="_blank">GitHub</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <div className="footer-bottom">
          &copy; 2026 PulseBoard. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;