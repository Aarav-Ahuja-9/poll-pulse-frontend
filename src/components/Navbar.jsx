import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" className="nav-logo">
          P<span>B</span>
        </a>

        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/features" className="nav-link">Work</a>
          <a href="/signup" className="nav-link nav-special">Join</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;