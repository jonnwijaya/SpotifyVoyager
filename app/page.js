
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
    
    // Add staggered animation to elements
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('fade-in');
      }, index * 200);
    });
  }, [router]);

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
              user-friendly interface designed for music lovers.
            </p>
            <div className="hero-actions animated">
              <button 
                onClick={handleLogin} 
                className="btn btn-primary btn-lg"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.809-.871 7.077-.496 9.713 1.115.293.18.385.563.207.856zm1.223-2.723c-.226.367-.706.482-1.073.257-2.687-1.652-6.785-2.131-9.965-1.166-.422.127-.869-.106-.995-.529-.127-.422.106-.869.529-.995 3.632-1.102 8.147-.568 11.248 1.339.367.226.482.706.256 1.094zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.51.155-1.048-.133-1.202-.644-.155-.51.133-1.048.644-1.202 3.635-1.102 9.405-.865 12.992 1.454.44.284.570.877.285 1.317-.285.44-.877.57-1.317.285z"/>
                </svg>
                Connect with Spotify
              </button>
              <a href="#features" className="btn btn-outline btn-lg">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="text-center">Discover the Experience</h2>
          <div className="features-grid">
            <div className="card">
              <div className="card-content">
                <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>🎵</div>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>Track Your Music</h3>
                <p style={{ textAlign: 'center', color: 'var(--color-gray-600)' }}>
                  Keep track of your favorite songs and discover your music patterns with detailed analytics.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-content">
                <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>📊</div>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>Music Analytics</h3>
                <p style={{ textAlign: 'center', color: 'var(--color-gray-600)' }}>
                  Get insights into your listening habits with beautiful charts and statistics.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-content">
                <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>🚀</div>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>Space-Age Design</h3>
                <p style={{ textAlign: 'center', color: 'var(--color-gray-600)' }}>
                  Experience your music through a beautifully designed, cosmic-themed interface.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="about" className="about-section">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2>About Spotify Voyager</h2>
            <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-600)', lineHeight: '1.8' }}>
              Spotify Voyager is your personal music companion that transforms your Spotify experience 
              into an interstellar journey. Connect your account to explore your musical universe, 
              discover patterns in your listening habits, and navigate through your favorite tracks 
              with our space-themed interface.
            </p>
            <div style={{ marginTop: 'var(--space-2xl)' }}>
              <button onClick={handleLogin} className="btn btn-primary btn-lg">
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
