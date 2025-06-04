
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('spotifyAccessToken');
      const expiration = localStorage.getItem('tokenExpiration');
      setIsLoggedIn(token && expiration && parseInt(expiration) > Date.now());
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    router.push('/api/auth/login');
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/api/auth/login');
    }
  };

  return (
    <div className="home-page">
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Your Musical Universe Awaits</h1>
            <p>
              Discover insights into your Spotify listening habits, generate AI-powered playlists, 
              and share your unique Music DNA with the world.
            </p>
            <div className="hero-actions">
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                {isLoggedIn ? 'Open Dashboard' : 'Start Your Journey'}
              </button>
              <a href="#features" className="btn btn-outline btn-lg">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="text-center">
            <h2>Explore Your Music Like Never Before</h2>
            <p style={{ 
              fontSize: 'var(--font-size-lg)', 
              color: 'var(--color-text-secondary)', 
              maxWidth: '600px', 
              margin: '0 auto var(--space-12)'
            }}>
              Transform your Spotify data into beautiful insights and shareable experiences
            </p>
          </div>
          
          <div className="features-grid">
            <div className="card">
              <div className="card-content">
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: 'var(--space-6)', 
                  textAlign: 'center' 
                }}>🎵</div>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                  Smart Analytics
                </h3>
                <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  Deep dive into your listening patterns with advanced analytics and beautiful visualizations.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-content">
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: 'var(--space-6)', 
                  textAlign: 'center' 
                }}>🧬</div>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                  Music DNA Cards
                </h3>
                <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  Generate stunning, shareable Music DNA cards perfect for Instagram Stories and social media.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-content">
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: 'var(--space-6)', 
                  textAlign: 'center' 
                }}>🤖</div>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                  AI Playlists
                </h3>
                <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  Let our AI create personalized playlists based on your mood, preferences, and listening history.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-content">
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: 'var(--space-6)', 
                  textAlign: 'center' 
                }}>📊</div>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                  Detailed Insights
                </h3>
                <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  Understand your music taste with genre breakdowns, discovery scores, and vintage preferences.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-content">
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: 'var(--space-6)', 
                  textAlign: 'center' 
                }}>🚀</div>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                  Modern Design
                </h3>
                <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  Experience your music through a beautifully crafted, responsive interface.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-content">
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: 'var(--space-6)', 
                  textAlign: 'center' 
                }}>📱</div>
                <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                  Mobile First
                </h3>
                <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  Seamlessly access your music insights on any device, optimized for mobile experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2>Discover Your Musical Identity</h2>
            <p style={{ 
              fontSize: 'var(--font-size-lg)', 
              color: 'var(--color-text-secondary)', 
              lineHeight: '1.8',
              marginBottom: 'var(--space-8)' 
            }}>
              Spotify Voyager transforms your music listening data into meaningful insights and beautiful, 
              shareable content. Connect your Spotify account to unlock a deeper understanding of your 
              musical preferences and discover new ways to engage with your favorite artists and songs.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                {isLoggedIn ? 'Go to Dashboard' : 'Connect Spotify'}
              </button>
              <a href="/pricing" className="btn btn-outline btn-lg">
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: 'var(--space-12) var(--space-4)', 
        color: 'var(--color-text-secondary)', 
        fontSize: 'var(--font-size-sm)', 
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)'
      }}>
        <div className="container">
          <p>&copy; 2024 Spotify Voyager. Made with ❤️ for music lovers.</p>
        </div>
      </footer>
    </div>
  );
}
