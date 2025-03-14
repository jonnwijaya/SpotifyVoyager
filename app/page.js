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
    const token = localStorage.getItem('spotifyAccessToken');
    const expiration = localStorage.getItem('tokenExpiration');
    
    if (token && expiration && parseInt(expiration) > Date.now()) {
      setIsAuthenticated(true);
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyLoginUrl(); // app/page.js (continued)
};

return (
  <div className="home-page">
    <Header />
    
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="container">
        <h1>SPOTIFY VOYAGER</h1>
        <p>
          Discover and manage your music experience effortlessly. Track your favorite songs, 
          explore new features, and engage with the Spotify community—all in a sleek, 
          user-friendly interface.
        </p>
        <div className="hero-actions">
          <button onClick={handleLogin} className="btn btn-primary">
            Connect with Spotify
          </button>
          <a href="#features" className="btn btn-outline">
            Learn more →
          </a>
        </div>
      </div>
    </section>
    
    {/* You can add more sections as needed */}
  </div>
);
}