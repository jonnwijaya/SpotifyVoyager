
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('spotifyAccessToken');
      const expiration = localStorage.getItem('tokenExpiration');
      setIsLoggedIn(token && expiration && parseInt(expiration) > Date.now());
    };
    
    checkAuth();
    
    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = mobileMenuOpen ? '' : 'hidden';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };
  
  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">SV</div>
            <span className="logo-text">Spotify Voyager</span>
          </Link>
          
          <nav className="nav-desktop">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn btn-primary">
                Dashboard
              </Link>
            ) : (
              <Link href="/api/auth/login" className="btn btn-primary">
                Connect with Spotify
              </Link>
            )}
          </nav>
          
          <button 
            className="menu-button" 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>
      
      {/* Mobile menu overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={closeMobileMenu}
      />
      
      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo-icon">SV</div>
          <button 
            className="close-menu" 
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        
        <nav>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="mobile-menu-link"
              onClick={closeMobileMenu}
            >
              {item.name}
            </Link>
          ))}
          
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="mobile-menu-link btn btn-primary"
              onClick={closeMobileMenu}
              style={{ margin: 'var(--space-md)', width: 'calc(100% - 2 * var(--space-md))' }}
            >
              Dashboard
            </Link>
          ) : (
            <Link 
              href="/api/auth/login" 
              className="mobile-menu-link btn btn-primary"
              onClick={closeMobileMenu}
              style={{ margin: 'var(--space-md)', width: 'calc(100% - 2 * var(--space-md))' }}
            >
              Connect with Spotify
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
