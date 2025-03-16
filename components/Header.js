// components/Header.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Navigation links for the header
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
  { name: 'Dashboard', href: '/dashboard' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Check authentication status on component mount
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('spotifyAccessToken');
    const expiration = localStorage.getItem('tokenExpiration');
    
    setIsLoggedIn(token && expiration && parseInt(expiration) > Date.now());
    
    // Add scroll event listener for header styling
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent scrolling when menu is open
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`} style={{
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 1)',
      backdropFilter: scrolled ? 'blur(10px)' : 'none'
    }}>
      <div className="header-inner">
        <div className="logo">
          <Link href="/">
            <span className="logo-icon">SV</span>
            <span className="logo-text">Spotify Voyager</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="nav-desktop">
          {navigation.map((item) => (
            <a key={item.name} href={item.href}>
              {item.name}
            </a>
          ))}
          
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn btn-primary">
              My Dashboard
            </Link>
          ) : (
            <Link href="/api/auth/login" className="btn btn-primary">
              Connect with Spotify
            </Link>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="menu-button" 
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      {/* Mobile menu overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={toggleMobileMenu}
        aria-hidden="true"
      ></div>
      
      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo-icon">SV</div>
          <button 
            className="close-menu" 
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >✕</button>
        </div>
        
        <nav>
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="mobile-menu-link"
              onClick={toggleMobileMenu}
            >
              {item.name}
            </a>
          ))}
          
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="mobile-menu-link btn btn-primary"
              onClick={toggleMobileMenu}
            >
              My Dashboard
            </Link>
          ) : (
            <Link 
              href="/api/auth/login" 
              className="mobile-menu-link btn btn-primary"
              onClick={toggleMobileMenu}
            >
              Connect with Spotify
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}