// app/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { getSpotifyLoginUrl } from '../lib/spotify';

export default function Home() {
  const router = useRouter();
  const [, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('spotifyAccessToken');
    const expiration = localStorage.getItem('tokenExpiration');
    
    if (token && expiration && parseInt(expiration) > Date.now()) {
      setIsAuthenticated(true);
      router.push('/dashboard');
    }
    
    // Add animation classes to elements
    const heroElements = document.querySelectorAll('.animated');
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('fade-in');
      }, index * 150);
    });
  }, [router]);

  // Handle Spotify login
  const handleLogin = () => {
    window.location.href = getSpotifyLoginUrl();
  };

  return (
    <div className="home-page">
      <Header />
      
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="animated">SPOTIFY VOYAGER</h1>
            <p className="animated">
              Discover and manage your music experience effortlessly. Track your favorite songs, 
              explore new features, and engage with the Spotify community—all in a sleek, 
              user-friendly interface.
            </p>
            <div className="hero-actions">
              <button 
                onClick={handleLogin} 
                className="btn btn-primary btn-lg animated"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="btn-icon"
                >
                  <path d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2ZM2 12h20"/>
                  <path d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2ZM2 12h20"/>
                  <path d="m9 12 3 3 3-3"/>
                  <path d="M12 9v6"/>
                </svg>
                Connect with Spotify
              </button>
              <a href="#features" className="btn btn-outline btn-lg animated">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section placeholder */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="text-center">Discover the Experience</h2>
          <div className="features-grid">
            {/* Feature cards would go here */}
          </div>
        </div>
      </section>
      
      {/* About section placeholder */}
      <section id="about" className="about-section">
        <div className="container">
          <h2 className="text-center">About Spotify Voyager</h2>
          {/* About content would go here */}
        </div>
      </section>
    </div>
  );
}