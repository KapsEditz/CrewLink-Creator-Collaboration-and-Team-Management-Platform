import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

// 1. Import BOTH logos here
import logoLight from '../../assets/crewlink.png'; 
import logoDark from '../../assets/crewlink2.png'; 

import './navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark

  useEffect(() => {
    setIsMounted(true);
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.body.className = newTheme ? 'dark-theme' : 'light-theme';
  };

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 20);
          
          if (Math.abs(currentScrollY - lastScrollY) > 10) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              setIsVisible(false);
              setIsMobileMenuOpen(false);
            } else {
              setIsVisible(true);
            }
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`crewlink-navbar ${isMounted ? 'nav-enter' : ''} ${isScrolled ? 'nav-scrolled' : ''} ${isVisible ? '' : 'nav-hidden'}`}>
      <div className="navbar-container">
        
        <Link to="/" className="nav-brand" onClick={() => setIsMobileMenuOpen(false)}>
          {/* 2. Swap the logo based on isDarkMode! */}
          <img src={isDarkMode ? logoDark : logoLight} alt="CrewLink" className="brand-logo" />
          <span className="brand-text">CrewLink</span>
        </Link>

        <ul className="nav-links">
          <li><NavLink to="/about" className="nav-item">About</NavLink></li>
          <li><NavLink to="/features" className="nav-item">Features</NavLink></li>
          <li><NavLink to="/creators" className="nav-item">For Creators</NavLink></li>
        </ul>

        <div className="nav-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? (
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path><path d="M12 20v2"></path>
                <path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path>
                <path d="M2 12h2"></path><path d="M20 12h2"></path>
                <path d="M4.93 19.07l1.41-1.41"></path><path d="M17.66 6.34l1.41-1.41"></path>
              </svg>
            ) : (
              <svg className="theme-icon moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <Link to="/login" className="btn-ghost">Log In</Link>
          <Link to="/register" className="btn-primary">Sign Up</Link>
        </div>

        <button 
          className={`mobile-trigger ${isMobileMenuOpen ? 'is-active' : ''}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

      </div>

      <div className={`mobile-dropdown ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <NavLink to="/about" className="mobile-item" onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
        <NavLink to="/features" className="mobile-item" onClick={() => setIsMobileMenuOpen(false)}>Features</NavLink>
        <NavLink to="/creators" className="mobile-item" onClick={() => setIsMobileMenuOpen(false)}>For Creators</NavLink>
        <div className="mobile-divider"></div>
        <Link to="/login" className="mobile-item" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
        <Link to="/register" className="mobile-item text-brand" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;