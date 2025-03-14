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
  
  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    const expiration = localStorage.getItem('tokenExpiration');
    
    setIsLoggedIn(token && expiration && parseInt(expiration) > Date.now());
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
    <header className="site-header">
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
            <Link href="/api/auth/login">
              Log in →
            </Link>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <button className="menu-button" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      {/* Mobile menu overlay */}
      <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}></div>
      
      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo-icon">SV</div>
          <button className="close-menu" onClick={toggleMobileMenu}>✕</button>
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
              className="mobile-menu-link"
              onClick={toggleMobileMenu}
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}